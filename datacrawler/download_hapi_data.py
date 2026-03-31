import re
import socket
import ssl
from ftplib import FTP, FTP_TLS, all_errors, error_perm
from logging import Logger
from pathlib import Path
from typing import List, Optional, Tuple
from datetime import datetime

from datacrawler.dependencies.dépendances import initialise_les_dépendances


class _SessionReuseFTPTLS(FTP_TLS):
    """Subclass of FTP_TLS that reuses the control channel TLS session on the
    data channel. Required by servers (e.g. pure-ftpd) that enforce session reuse."""

    def ntransfercmd(self, cmd: str, rest: Optional[int] = None) -> Tuple[socket.socket, Optional[int]]:  # type: ignore[override]
        conn, size = FTP.ntransfercmd(self, cmd, rest)
        if self._prot_p:  # type: ignore[attr-defined]
            conn = self.context.wrap_socket(  # type: ignore[attr-defined]
                conn,
                server_side=False,
                server_hostname=self.host,
                session=self.sock.session,  # type: ignore[union-attr]
            )
        return conn, size


_IMPLICIT_FTPS_PORT = 990


def connect_ftps(host: str, port: int, username: str, password: str, logger: Logger) -> FTP_TLS:
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    ftps = _SessionReuseFTPTLS(context=ssl_context)

    if port == _IMPLICIT_FTPS_PORT:
        # Implicit FTPS: The mode use currently
        ftps.host = host
        ftps.port = port
        raw_sock = socket.create_connection((host, port), timeout=ftps.timeout)
        ftps.sock = ssl_context.wrap_socket(raw_sock, server_hostname=host)
        ftps.af = ftps.sock.family
        ftps.file = ftps.sock.makefile("r", encoding=ftps.encoding)
        ftps.welcome = ftps.getresp()
    else:
        # Explicit FTPS (FTPES): In case of change
        ftps.connect(host=host, port=port)

    ftps.login(user=username, passwd=password)
    ftps.prot_p()
    logger.info("Connexion FTPS à %s (port %d, mode %s) réussie.", host, port, "implicite" if port == _IMPLICIT_FTPS_PORT else "explicite")
    return ftps


def list_hapi_files(ftps: FTP_TLS, remote_path: str) -> List[str]:
    current_year = datetime.now().year
    pattern = re.compile(r"^(\d{4})_engagements_exporter_(\d{8})\.csv$")

    # For each year keep only the most recent file (highest yyyyMMDD date).
    # Format: {year: (filename, full_date_str)}
    best_per_year: dict[int, tuple[str, str]] = {}

    try:
        # La commande MLSD n’est pas implementée sur tous les servers
        entries: List[tuple[str, dict[str, str]]] = list(ftps.mlsd(remote_path))
    except error_perm:
        # On passe à la commande NLSD qui est plus largement supportée mais ne fournit pas de facts (type, size, etc.)
        entries = [(Path(raw).name, {}) for raw in ftps.nlst(remote_path)]

    for name, facts in entries:
        # Skip directories when type info is available; regex is the guard otherwise.
        if facts.get("type") == "dir":
            continue

        match = pattern.match(name)
        if not match:
            continue

        try:
            year = int(match.group(1))
            date_str = match.group(2)
        except (ValueError, TypeError):
            continue

        if year < current_year - 4 or year > current_year:
            continue

        # Lexicographic comparison is correct for yyyyMMDD strings
        if year not in best_per_year or date_str > best_per_year[year][1]:
            best_per_year[year] = (name, date_str)

    return [filename for filename, _ in best_per_year.values()]


def download_remote_file(ftps: FTP_TLS, remote_path: str, local_path: Path, filename: str, logger: Logger) -> None:
    remote_file_path = f"{remote_path.rstrip('/')}/{filename}"
    local_file_path = local_path / filename
    with open(local_file_path, "wb") as file:
        ftps.retrbinary(f"RETR {remote_file_path}", file.write)
    logger.info("Le fichier '%s' a été téléchargé avec succès vers '%s'.", filename, local_file_path)


def _safe_close(ftps: Optional[FTP_TLS], logger: Logger) -> None:
    try:
        if ftps:
            ftps.quit()
    except all_errors as exc:
        logger.debug("Erreur lors de la fermeture de la connexion FTPS: %s", exc)


def main() -> None:
    """Script pour télécharger les données brutes HAPI depuis un serveur FTPS.

    Ce script se connecte à un serveur FTPS en utilisant les informations
    d'identification fournies dans les variables d'environnement. Il recherche
    les fichiers portant le préfixe configuré et datant des 5 dernières années,
    les télécharge dans un répertoire local (récréé à zéro), puis se déconnecte.
    """
    logger, variables_d_environnement = initialise_les_dépendances()

    # --- Configuration ---
    ftps_host = variables_d_environnement["HAPI_FTPS_HOST"]
    ftps_port = int(variables_d_environnement["HAPI_FTPS_PORT"])
    ftps_username = variables_d_environnement["HAPI_FTPS_USERNAME"]
    ftps_password = variables_d_environnement["HAPI_FTPS_PASSWORD"]
    remote_path = "/ftps/Infocentre/Production/download/STARS FIR"
    local_path = Path(variables_d_environnement["HAPI_DATA_PATH"])

    # --- Création du répertoire de destination ---
    local_path.mkdir(parents=True, exist_ok=True)
    logger.info("Répertoire de destination '%s' prêt.", local_path)

    ftps = None

    try:
        ftps = connect_ftps(ftps_host, ftps_port, ftps_username, ftps_password, logger)

        try:
            filenames = list_hapi_files(ftps, remote_path)
        except all_errors as exc:
            logger.exception("Impossible de lister les fichiers sur le FTPS: %s", exc)
            return

        if not filenames:
            logger.warning("Aucun fichier HAPI correspondant trouvé sur le FTPS.")
            return

        for filename in filenames:
            try:
                download_remote_file(ftps, remote_path, local_path, filename, logger)
            except all_errors as exc:
                logger.exception("Une erreur est survenue lors du téléchargement du fichier '%s': %s", filename, exc)
                # Stop on first error to mimic TypeScript behavior where errors are bubbled up
                return

    except all_errors as exc:
        logger.exception("Une erreur est survenue lors de la connexion FTPS: %s", exc)
    finally:
        _safe_close(ftps, logger)
        logger.info("Déconnexion du FTPS.")


if __name__ == "__main__":
    main()

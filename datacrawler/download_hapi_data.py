import re
import socket
import ssl
from datetime import datetime
from ftplib import FTP, FTP_TLS
from pathlib import Path
from typing import Optional, Tuple

import ftputil
import ftputil.error

from datacrawler.dependencies.dépendances import initialise_les_dépendances


class _SessionReuseFTPTLS(FTP_TLS):
    """Subclass of FTP_TLS that reuses the control channel TLS session on the
    data channel. Required by servers (e.g. pure-ftpd) that enforce session reuse."""

    def ntransfercmd(self, cmd: str, rest: Optional[int] = None) -> Tuple[socket.socket, Optional[int]]:  # type: ignore[override]
        conn, size = FTP.ntransfercmd(self, cmd, rest)
        if self._prot_p:  # type: ignore[attr-defined]
            conn = self.context.wrap_socket(
                conn,
                server_side=False,
                server_hostname=self.host,
                session=self.sock.session,  # type: ignore[union-attr]
            )
        return conn, size


_IMPLICIT_FTPS_PORT = 990


def _make_session_factory(port: int) -> type:
    """Return a session-factory class for ftputil, handling implicit (port 990) or explicit FTPS."""

    class _ImplicitFTPSSession(_SessionReuseFTPTLS):
        def __init__(self, host: str, user: str, password: str) -> None:
            ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
            ssl_context.set_ciphers("DEFAULT@SECLEVEL=1")
            super().__init__(context=ssl_context)
            if port == _IMPLICIT_FTPS_PORT:
                self.host = host
                self.port = port
                raw_sock = socket.create_connection((host, port), timeout=self.timeout)
                self.sock = ssl_context.wrap_socket(raw_sock, server_hostname=host)
                self.af = self.sock.family
                self.file = self.sock.makefile("r", encoding=self.encoding)
                self.welcome = self.getresp()
            else:
                self.connect(host=host, port=port)
            self.login(user=user, passwd=password)
            self.prot_p()

    return _ImplicitFTPSSession


def list_hapi_files(ftp_host: ftputil.FTPHost, remote_path: str) -> list[str]:
    current_year = datetime.now().year
    pattern = re.compile(r"^(\d{4})_engagements_exporter_(\d{8})\.csv$")

    best_per_year: dict[int, tuple[str, str]] = {}

    for name in ftp_host.listdir(remote_path):
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

        if year not in best_per_year or date_str > best_per_year[year][1]:
            best_per_year[year] = (name, date_str)

    return [filename for filename, _ in best_per_year.values()]


def main() -> None:
    """Script pour télécharger les données brutes HAPI depuis un serveur FTPS."""
    logger, variables_d_environnement = initialise_les_dépendances()

    ftps_host = variables_d_environnement["HAPI_FTPS_HOST"]
    ftps_port = int(variables_d_environnement["HAPI_FTPS_PORT"])
    ftps_username = variables_d_environnement["HAPI_FTPS_USERNAME"]
    ftps_password = variables_d_environnement["HAPI_FTPS_PASSWORD"]
    remote_path = "/ftps/Infocentre/Production/download/STARS FIR"
    local_path = Path(variables_d_environnement["HAPI_DATA_PATH"])

    local_path.mkdir(parents=True, exist_ok=True)
    logger.info("Répertoire de destination '%s' prêt.", local_path)

    try:
        logger.info("Tentative de connexion au FTPS à %s (port %d)...", ftps_host, ftps_port)
        with ftputil.FTPHost(ftps_host, ftps_username, ftps_password, session_factory=_make_session_factory(ftps_port)) as ftp_host:
            mode = "implicite" if ftps_port == _IMPLICIT_FTPS_PORT else "explicite"
            logger.info("Connexion FTPS à %s (port %d, mode %s) réussie.", ftps_host, ftps_port, mode)

            try:
                filenames = list_hapi_files(ftp_host, remote_path)
            except ftputil.error.FTPError as exc:
                logger.exception("Impossible de lister les fichiers sur le FTPS: %s", exc)
                return

            if not filenames:
                logger.warning("Aucun fichier HAPI correspondant trouvé sur le FTPS.")
                return

            for filename in filenames:
                remote_file_path = f"{remote_path.rstrip('/')}/{filename}"
                local_file_path = str(local_path / filename)
                try:
                    ftp_host.download(remote_file_path, local_file_path)
                    logger.info("Le fichier '%s' a été téléchargé avec succès vers '%s'.", filename, local_file_path)
                except ftputil.error.FTPError as exc:
                    logger.exception("Une erreur est survenue lors du téléchargement du fichier '%s': %s", filename, exc)
                    return

    except ftputil.error.FTPError as exc:
        logger.exception("Une erreur est survenue lors de la connexion FTPS: %s", exc)
    finally:
        logger.info("Déconnexion du FTPS.")


if __name__ == "__main__":
    main()

import re
import stat
from logging import Logger
from pathlib import Path
from typing import List, Optional
from datetime import datetime

import paramiko
from paramiko import SSHException
from paramiko.sftp import SFTPError

from datacrawler.dependencies.dépendances import initialise_les_dépendances


def connect_sftp(host: str, port: int, username: str, password: str, logger: Logger) -> tuple:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    ssh.connect(
        hostname=host,
        port=port,
        username=username,
        password=password,
        allow_agent=False,
        look_for_keys=False,
    )

    sftp = ssh.open_sftp()
    logger.info("Connexion SFTP à %s réussie.", host)
    return ssh, sftp


def list_hapi_files(sftp: paramiko.SFTPClient, remote_path: str, file_prefix: str) -> List:
    attrs = sftp.listdir_attr(remote_path)

    current_year = datetime.now().year
    pattern = re.compile(rf"^{re.escape(file_prefix)}_(\d{{4}})_\d{{14}}")

    entries = []
    for entry in attrs:
        filename = getattr(entry, "filename", None)
        st_mode = getattr(entry, "st_mode", None)
        if not filename or not isinstance(st_mode, int):
            continue
        if not stat.S_ISREG(st_mode):
            continue

        match = pattern.match(filename)
        if not match:
            continue

        try:
            year = int(match.group(1))
        except (ValueError, TypeError):
            continue

        if year < current_year - 4 or year > current_year:
            continue

        entries.append(entry)

    return entries


def download_remote_file(sftp: paramiko.SFTPClient, remote_path: str, local_path: Path, filename: str, logger: Logger) -> None:
    remote_file_path = f"{remote_path}/{filename}"
    local_file_path = local_path / filename
    sftp.get(remote_file_path, str(local_file_path))
    logger.info("Le fichier '%s' a été téléchargé avec succès vers '%s'.", filename, local_file_path)


def _safe_close(sftp: Optional[paramiko.SFTPClient], ssh: Optional[paramiko.SSHClient], logger: Logger) -> None:
    try:
        if sftp:
            sftp.close()
        if ssh:
            ssh.close()
    except (OSError, SSHException, SFTPError) as exc:
        logger.debug("Erreur lors de la fermeture de la connexion SFTP: %s", exc)


def main() -> None:
    """Script pour télécharger les données brutes HAPI depuis un serveur SFTP.

    Ce script se connecte à un serveur SFTP en utilisant les informations
    d'identification fournies dans les variables d'environnement. Il recherche
    les fichiers portant le préfixe configuré et datant des 5 dernières années,
    les télécharge dans un répertoire local (récréé à zéro), puis se déconnecte.
    """
    logger, variables_d_environnement = initialise_les_dépendances()

    # --- Configuration ---
    sftp_host = variables_d_environnement["HAPI_SFTP_HOST"]
    sftp_port = int(variables_d_environnement["HAPI_SFTP_PORT"])
    sftp_username = variables_d_environnement["HAPI_SFTP_USERNAME"]
    sftp_password = variables_d_environnement["HAPI_SFTP_PASSWORD"]
    remote_path = "ftps/Infocentre/Production/download/HAPI/anciennes_campagnes"
    local_path = Path(variables_d_environnement["HAPI_DATA_PATH"])
    file_prefix = "ENGAGEMENTS_PAR_BENEFICIAIRE"

    # --- Création du répertoire de destination ---
    local_path.mkdir(parents=True, exist_ok=True)
    logger.info("Répertoire de destination '%s' prêt.", local_path)

    ssh = None
    sftp = None

    try:
        ssh, sftp = connect_sftp(sftp_host, sftp_port, sftp_username, sftp_password, logger)

        try:
            entries = list_hapi_files(sftp, remote_path, file_prefix)
        except (OSError, IOError, SFTPError) as exc:
            logger.exception("Impossible de lister les fichiers sur le SFTP: %s", exc)
            return

        if not entries:
            logger.warning("Aucun fichier HAPI correspondant trouvé sur le SFTP.")
            return

        for entry in entries:
            filename = getattr(entry, "filename", None)
            if not filename:
                logger.warning("Entrée trouvée sans nom valide.")
                continue

            try:
                download_remote_file(sftp, remote_path, local_path, filename, logger)
            except (OSError, IOError, SFTPError) as exc:
                logger.exception("Une erreur est survenue lors du téléchargement du fichier '%s': %s", filename, exc)
                # Stop on first error to mimic TypeScript behavior where errors are bubbled up
                return

    except (SSHException, OSError) as exc:
        logger.exception("Une erreur est survenue lors de la connexion SFTP: %s", exc)
    finally:
        _safe_close(sftp, ssh, logger)
        logger.info("Déconnexion du SFTP.")


if __name__ == "__main__":
    main()

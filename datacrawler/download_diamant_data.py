import re
import shutil
import stat
from logging import Logger
from pathlib import Path
from typing import Optional

import paramiko
from paramiko import SSHException
from paramiko.sftp import SFTPError

from datacrawler.dependencies.dépendances import initialise_les_dépendances

REMOTE_PATH = "DIAMANT/incoming"
FILE_PREFIXES = [
    "ANN_CA_EJ_ET",
    "ANN_ERRD_EJ",
    "ANN_ERRD_EJ_ET",
    "ANN_MS_TDP_ET",
    "ANN_PER_ERRD_EPRD",
    "ANN_RPU",
    "ANN_SAE",
    "MEN_PMSI_ANNUEL",
    "MEN_PMSI_MENCUMU",
    "QUO_SAN_FINANCE",
    "MEN_HAPI",
]


def connect_sftp(host: str, port: int, username: str, key_filename: str, logger: Logger) -> tuple:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(
        hostname=host,
        port=port,
        username=username,
        key_filename=key_filename,
        allow_agent=False,
        look_for_keys=False,
    )
    sftp = ssh.open_sftp()
    logger.info("[DNUM] La connexion au SFTP est ouverte.")
    return ssh, sftp


def list_remote_files(sftp: paramiko.SFTPClient, remote_path: str) -> list:
    """Liste tous les fichiers du répertoire distant."""
    try:
        attrs = sftp.listdir_attr(remote_path)
        entries = []
        for entry in attrs:
            filename = getattr(entry, "filename", None)
            st_mode = getattr(entry, "st_mode", None)
            if not filename or not isinstance(st_mode, int):
                continue
            if not stat.S_ISREG(st_mode):
                continue
            entries.append(entry)
        return entries
    except IOError as exc:
        raise SFTPError(f"Erreur lors du listing du répertoire {remote_path}") from exc


def find_latest_file_for_prefix(entries: list, prefix: str) -> Optional[object]:
    """Trouve le fichier le plus récent pour un préfixe donné (format DIAMANT)."""
    pattern = re.compile(rf"^{prefix}_\d{{4}}_\d{{2}}_\d{{2}}\.CSV\.gpg$")

    matching_entries = []
    for entry in entries:
        filename = getattr(entry, "filename", "")
        if pattern.match(filename):
            matching_entries.append(entry)

    if not matching_entries:
        return None

    # Tri par nom de fichier décroissant (les dates sont dans le nom YYYY_MM_DD)
    matching_entries.sort(key=lambda e: getattr(e, "filename", ""), reverse=True)
    return matching_entries[0]


def download_remote_file(sftp: paramiko.SFTPClient, remote_path: str, local_path: Path, filename: str, logger: Logger) -> None:
    remote_file_path = f"{remote_path}/{filename}"
    local_file_path = local_path / filename
    sftp.get(remote_file_path, str(local_file_path))
    logger.info("[DNUM] Le fichier DIAMANT %s a été téléchargé.", filename)


def recreate_local_directory(local_path: Path) -> None:
    if local_path.exists():
        shutil.rmtree(local_path)
    local_path.mkdir(parents=True, exist_ok=True)


def _safe_close(sftp: Optional[paramiko.SFTPClient], ssh: Optional[paramiko.SSHClient], logger: Logger) -> None:
    try:
        if sftp:
            sftp.close()
        if ssh:
            ssh.close()
            logger.info("[DNUM] La connexion au SFTP est fermée.")
    except (OSError, SSHException, SFTPError) as exc:
        logger.debug("Erreur lors de la fermeture de la connexion SFTP: %s", exc)


def main() -> None:
    """Script pour télécharger les données brutes DIAMANT depuis un serveur SFTP."""
    logger, variables_d_environnement = initialise_les_dépendances()

    # --- Configuration ---
    sftp_host = variables_d_environnement["DNUM_SFTP_HOST"]
    sftp_port = int(variables_d_environnement["DNUM_SFTP_PORT"])
    sftp_username = variables_d_environnement["DNUM_SFTP_USERNAME"]
    sftp_private_key = variables_d_environnement["DNUM_SFTP_PRIVATE_KEY"]
    local_path = Path(variables_d_environnement["DIAMANT_ENCRYPTED_DATA_PATH"])

    # --- Réinitialisation du répertoire de destination ---
    try:
        recreate_local_directory(local_path)
    except OSError as exc:
        logger.exception("Impossible de recréer le répertoire de destination: %s", exc)
        return

    ssh = None
    sftp = None

    try:
        ssh, sftp = connect_sftp(sftp_host, sftp_port, sftp_username, sftp_private_key, logger)

        # Récupérer la liste complète des fichiers
        try:
            all_entries = list_remote_files(sftp, REMOTE_PATH)
        except (OSError, IOError, SFTPError) as exc:
            logger.exception("Impossible de lister les fichiers sur le SFTP: %s", exc)
            return

        for prefix in FILE_PREFIXES:
            latest = find_latest_file_for_prefix(all_entries, prefix)

            if latest:
                filename = getattr(latest, "filename")
                try:
                    download_remote_file(sftp, REMOTE_PATH, local_path, filename, logger)
                except (OSError, IOError, SFTPError) as exc:
                    logger.exception("Une erreur est survenue lors du téléchargement du fichier %s : %s", filename, exc)
            else:
                logger.error("[DIAMANT] Le fichier %s n’est pas présent sur le sftp.", prefix)

    except (SSHException, OSError) as exc:
        logger.exception("[DNUM] Une erreur est survenue lors de la connexion au SFTP : %s", exc)
    finally:
        _safe_close(sftp, ssh, logger)


if __name__ == "__main__":
    main()

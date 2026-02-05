import shutil
import stat
import subprocess
from logging import Logger
from pathlib import Path
from typing import Optional

import paramiko
from paramiko import SSHException
from paramiko.sftp import SFTPError

from datacrawler.dependencies.dépendances import initialise_les_dépendances

REMOTE_PATH = "/flux_finess"
LOCAL_PATH_SUFFIX = "finess"

FILES_TO_DOWNLOAD = {
    "simple": [
        "finess_cs1400101_stock_",
        "finess_cs1400102_stock_",
    ],
    "nomenclature": [
        "finess_cs1500106_stock_",
        "finess_cs1500107_stock_",
    ],
    "enrichi": [
        "finess_cs1400103_stock_",
        "finess_cs1400104_stock_",
        "finess_cs1400105_stock_",
        "finess_cs1600101_stock_",
        "finess_cs1600102_stock_",
        "amm_arhgos_",
    ],
}


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
    logger.info("Connexion SFTP à %s réussie.", host)
    return ssh, sftp


def list_files_with_prefix(sftp: paramiko.SFTPClient, remote_path: str, file_prefix: str) -> list:
    try:
        attrs = sftp.listdir_attr(remote_path)
    except FileNotFoundError:
        return []

    entries = []
    for entry in attrs:
        filename = getattr(entry, "filename", None)
        st_mode = getattr(entry, "st_mode", None)
        if not filename or not isinstance(st_mode, int):
            continue
        if not filename.startswith(file_prefix) or not filename.endswith(".xml.gz"):
            continue
        if not stat.S_ISREG(st_mode):
            continue
        entries.append(entry)
    return entries


def pick_latest_file(entries: list) -> Optional[object]:
    if not entries:
        return None
    # Sort by filename descending (assuming consistent date format in filenames)
    entries.sort(key=lambda e: getattr(e, "filename", ""), reverse=True)
    return entries[0]


def download_remote_file(sftp: paramiko.SFTPClient, remote_path: str, local_path: Path, filename: str, logger: Logger) -> None:
    remote_file_path = f"{remote_path}/{filename}"
    local_file_path = local_path / filename
    sftp.get(remote_file_path, str(local_file_path))
    logger.info("Le fichier '%s' a été téléchargé avec succès vers '%s'.", filename, local_file_path)


def unzip_files(local_path: Path, logger: Logger) -> None:
    try:
        subprocess.run(["gunzip", "-rf", str(local_path)], check=True)
        logger.info("[FINESS] Sources de données décompressées dans '%s'.", local_path)
    except subprocess.CalledProcessError as exc:
        logger.exception("Une erreur est survenue lors de la décompression du répertoire %s : %s", local_path, exc)
        raise exc


def _safe_close(sftp: Optional[paramiko.SFTPClient], ssh: Optional[paramiko.SSHClient], logger: Logger) -> None:
    try:
        if sftp:
            sftp.close()
        if ssh:
            ssh.close()
    except (OSError, SSHException, SFTPError) as exc:
        logger.debug("Erreur lors de la fermeture de la connexion SFTP: %s", exc)


def main() -> None:
    """Script pour télécharger les données brutes FINESS depuis un serveur SFTP.

    Ce script se connecte à un serveur SFTP, télécharge les fichiers les plus récents
    correspondant aux préfixes définis, les enregistre localement et les décompresse.
    """
    logger, variables_d_environnement = initialise_les_dépendances()

    # --- Configuration ---
    sftp_host = variables_d_environnement["SFTP_HOST"]
    sftp_port = int(variables_d_environnement["SFTP_PORT"])
    sftp_username = variables_d_environnement["SFTP_USERNAME"]
    sftp_private_key = variables_d_environnement["SFTP_PRIVATE_KEY"]
    base_local_path = Path(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"]) / LOCAL_PATH_SUFFIX

    # --- Nettoyage et création du répertoire de destination ---
    if base_local_path.exists():
        shutil.rmtree(base_local_path)

    # Création des sous-dossiers
    for subfolder in FILES_TO_DOWNLOAD.keys():
        (base_local_path / subfolder).mkdir(parents=True, exist_ok=True)

    logger.info("Répertoires de destination prêts dans '%s'.", base_local_path)

    ssh = None
    sftp = None

    try:
        ssh, sftp = connect_sftp(sftp_host, sftp_port, sftp_username, sftp_private_key, logger)

        for subfolder, prefixes in FILES_TO_DOWNLOAD.items():
            remote_subfolder_path = f"{REMOTE_PATH}/{subfolder}"
            local_subfolder_path = base_local_path / subfolder

            for prefix in prefixes:
                try:
                    entries = list_files_with_prefix(sftp, remote_subfolder_path, prefix)
                except (OSError, IOError, SFTPError) as exc:
                    logger.exception("Impossible de lister les fichiers sur le SFTP dans %s: %s", remote_subfolder_path, exc)
                    continue

                latest = pick_latest_file(entries)
                if latest is None:
                    logger.warning("Aucun fichier avec le préfixe '%s' trouvé sur le SFTP dans '%s'.", prefix, remote_subfolder_path)
                    continue

                filename = getattr(latest, "filename", None)
                if not filename:
                    logger.warning("Fichier trouvé sans nom valide.")
                    continue

                logger.info("Fichier le plus récent trouvé : %s", filename)

                try:
                    download_remote_file(sftp, remote_subfolder_path, local_subfolder_path, filename, logger)
                except (OSError, IOError, SFTPError) as exc:
                    logger.exception("Une erreur est survenue lors du téléchargement du fichier: %s", exc)

        # --- Décompression ---
        unzip_files(base_local_path, logger)

    except (SSHException, OSError) as exc:
        logger.exception("Une erreur est survenue lors de la connexion SFTP: %s", exc)
    finally:
        _safe_close(sftp, ssh, logger)
        logger.info("Déconnexion du SFTP.")


if __name__ == "__main__":
    main()

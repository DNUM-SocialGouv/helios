import stat
from logging import Logger
from pathlib import Path
from typing import Optional
import paramiko
from paramiko import SSHException
from paramiko.sftp import SFTPError

from datacrawler.dependencies.dépendances import initialise_les_dépendances


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


def list_sivss_files(sftp: paramiko.SFTPClient, remote_path: str, file_prefix: str) -> list:
    attrs = sftp.listdir_attr(remote_path)
    entries = []
    for entry in attrs:
        filename = getattr(entry, "filename", None)
        st_mode = getattr(entry, "st_mode", None)
        if not filename or not isinstance(st_mode, int):
            continue
        if not filename.startswith(file_prefix):
            continue
        if not stat.S_ISREG(st_mode):
            continue
        entries.append(entry)
    return entries


def pick_latest_file(entries: list) -> Optional[object]:
    if not entries:
        return None
    # Try par nom de fichier
    entries.sort(key=lambda e: getattr(e, "filename", ""), reverse=True)
    return entries[0]


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
    """Script pour télécharger les données brutes SIVSS depuis un serveur SFTP.

    Ce script se connecte à un serveur SFTP en utilisant les informations
    d'identification fournies dans les variables d'environnement. Il recherche
    le fichier le plus récent avec le préfixe 'sivss_', le télécharge dans
    un répertoire local, puis se déconnecte.
    """
    logger, variables_d_environnement = initialise_les_dépendances()

    # --- Configuration ---
    sftp_host = variables_d_environnement["DNUM_SFTP_HOST"]
    sftp_port = int(variables_d_environnement["DNUM_SFTP_PORT"])
    sftp_username = variables_d_environnement["DNUM_SFTP_USERNAME"]
    sftp_private_key = variables_d_environnement["DNUM_SFTP_PRIVATE_KEY"]
    remote_path = "SIVSS"
    local_path = Path(variables_d_environnement["SIVSS_DATA_PATH"])
    file_prefix = "sivss_"

    # --- Création du répertoire de destination ---
    local_path.mkdir(parents=True, exist_ok=True)
    logger.info("Répertoire de destination '%s' prêt.", local_path)

    ssh = None
    sftp = None

    try:
        ssh, sftp = connect_sftp(sftp_host, sftp_port, sftp_username, sftp_private_key, logger)

        try:
            entries = list_sivss_files(sftp, remote_path, file_prefix)
        except (OSError, IOError, SFTPError) as exc:
            logger.exception("Impossible de lister les fichiers sur le SFTP: %s", exc)
            return

        latest = pick_latest_file(entries)
        if latest is None:
            logger.warning("Aucun fichier avec le préfixe '%s' trouvé sur le SFTP.", file_prefix)
            return

        filename = getattr(latest, "filename", None)
        if not filename:
            logger.warning("Fichier trouvé sans nom valide.")
            return

        logger.info("Fichier le plus récent trouvé : %s", filename)

        try:
            download_remote_file(sftp, remote_path, local_path, filename, logger)
        except (OSError, IOError, SFTPError) as exc:
            logger.exception("Une erreur est survenue lors du téléchargement du fichier: %s", exc)

    except (SSHException, OSError) as exc:
        logger.exception("Une erreur est survenue lors de la connexion SFTP: %s", exc)
    finally:
        _safe_close(sftp, ssh, logger)
        logger.info("Déconnexion du SFTP.")


if __name__ == "__main__":
    main()

import stat
from logging import Logger
from pathlib import Path
from typing import Optional

import paramiko
from paramiko import SSHException
from paramiko.sftp import SFTPError

from datacrawler.dependencies.dépendances import initialise_les_dépendances

REMOTE_PATH = "VIGIE_RH"
FILE_PREFIX = [
    "vigierh_table_passage_professions",
    "vigierh_ref_tranche_age",
    "vigierh_ref_profession2",
    "vigierh_ref_profession1",
    "vigierh_ref_nature_contrat",
    "vigierh_ref_motifs_ruptures",
    "vigierh_ref_duree_cdd",
    "vigierh_pyramide",
    "vigierh_profession2",
    "vigierh_profession1",
    "vigierh_nature_contrats_trimestriel",
    "vigierh_nature_contrats_annuel",
    "vigierh_motifs_ruptures",
    "vigierh_etablissement_trimestriel",
    "vigierh_etablissement_mensuel",
    "vigierh_etablissement_annuel",
    "vigierh_duree_cdd",
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
    logger.info("Connexion SFTP à %s réussie.", host)
    return ssh, sftp


def list_siicea_files(sftp: paramiko.SFTPClient, remote_path: str, file_prefix: str) -> list:
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
    entries.sort(key=lambda e: getattr(e, "st_mtime", 0), reverse=True)
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
    """Script pour télécharger les données brutes VigieRH depuis un serveur SFTP.

    Ce script se connecte à un serveur SFTP en utilisant les informations
    d'identification fournies dans les variables d'environnement. Il recherche
    le fichier le plus récent avec un des prefix recherche, les télécharge dans
    un répertoire local, puis se déconnecte.
    """
    logger, variables_d_environnement = initialise_les_dépendances()

    # --- Configuration ---
    sftp_host = variables_d_environnement["DNUM_SFTP_HOST"]
    sftp_port = int(variables_d_environnement["DNUM_SFTP_PORT"])
    sftp_username = variables_d_environnement["DNUM_SFTP_USERNAME"]
    sftp_private_key = variables_d_environnement["DNUM_SFTP_PRIVATE_KEY"]
    local_path = Path(variables_d_environnement["VIGIE_RH_DATA_PATH"])

    # --- Création du répertoire de destination ---
    local_path.mkdir(parents=True, exist_ok=True)
    logger.info("Répertoire de destination '%s' prêt.", local_path)

    ssh = None
    sftp = None

    try:
        ssh, sftp = connect_sftp(sftp_host, sftp_port, sftp_username, sftp_private_key, logger)

        for prefix in FILE_PREFIX:
            try:
                entries = list_siicea_files(sftp, REMOTE_PATH, prefix)
            except (OSError, IOError, SFTPError) as exc:
                logger.exception("Impossible de lister les fichiers sur le SFTP: %s", exc)
                return

            latest = pick_latest_file(entries)
            if latest is None:
                logger.warning("Aucun fichier avec le préfixe '%s' trouvé sur le SFTP.", prefix)
                return

            filename = getattr(latest, "filename", None)
            if not filename:
                logger.warning("Fichier trouvé sans nom valide.")
                return

            logger.info("Fichier le plus récent trouvé : %s", filename)

            try:
                download_remote_file(sftp, REMOTE_PATH, local_path, filename, logger)
            except (OSError, IOError, SFTPError) as exc:
                logger.exception("Une erreur est survenue lors du téléchargement du fichier: %s", exc)

    except (SSHException, OSError) as exc:
        logger.exception("Une erreur est survenue lors de la connexion SFTP: %s", exc)
    finally:
        _safe_close(sftp, ssh, logger)
        logger.info("Déconnexion du SFTP.")


if __name__ == "__main__":
    main()

import os
import subprocess
from logging import Logger

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.formate_les_logs_des_process import log_process


def chiffre(
        dossier_source: str,
        dossier_cible: str,
        logger: Logger,
        executable_gpg: str
) -> None:
    logger.info(
        f"Début du chiffrement des données DIAMANT à partir du répertoire {dossier_source}")
    for basename_du_fichier_avec_les_données in os.listdir(dossier_source):
        nom_cible_du_fichier_chiffré = os.path.join(
            dossier_cible,
            basename_du_fichier_avec_les_données + ".gpg"
        )
        fichier_avec_les_données = os.path.join(
            dossier_source,
            basename_du_fichier_avec_les_données
        )
        process = subprocess.run(
            f'{executable_gpg} --output {nom_cible_du_fichier_chiffré} --encrypt --recipient clef_dev_helios'
            f' {fichier_avec_les_données}',
            shell=True,
            check=True
        )
        log_process(logger, process)
        logger.info(f"Fichier {fichier_avec_les_données} chiffré")
    nombre_de_fichiers_chiffrés = len(os.listdir(dossier_cible))
    logger.info(
        f"Fin du chiffrement des données DIAMANT. {nombre_de_fichiers_chiffrés} fichiers csv"
        f" ont été chiffrés dans le répertoire {dossier_cible}")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    dossier_où_sauvegarder_les_données_diamant_chiffrées = variables_d_environnement["DIAMANT_ENCRYPTED_DATA_PATH"]
    dossier_avec_les_csv_diamant = variables_d_environnement["DIAMANT_DATA_PATH"]
    chiffre(dossier_avec_les_csv_diamant,
            dossier_où_sauvegarder_les_données_diamant_chiffrées,
            logger_helios,
            variables_d_environnement["EXECUTABLE_GPG"]
            )

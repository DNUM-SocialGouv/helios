import base64
import os
import subprocess
from logging import Logger

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.formate_les_logs_des_process import log_process


def déchiffre_les_fichiers_du_dossier(dossier_avec_les_données_chiffrées: str,
                                      dossier_où_sauveagarder_les_csv: str,
                                      clef_privée: str,
                                      logger: Logger,
                                      executable_gpg:str) -> None:
    clef_privée_décodée = base64.decode(clef_privée)
    for fichier in os.listdir(dossier_où_sauveagarder_les_csv):
        os.unlink(os.path.join(dossier_où_sauveagarder_les_csv, fichier))
    logger.info(
        f"Début du déchiffrement des données DIAMANT à partir du répertoire {dossier_avec_les_données_chiffrées}")
    process = subprocess.run(
        f'echo "{clef_privée}" | base64 --decode | {executable_gpg} --import',
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False
    )
    logger.info(process.returncode)
    log_process(logger, process)
    for basename_du_fichier_avec_les_données_chiffrées in os.listdir(dossier_avec_les_données_chiffrées):
        nom_cible_du_fichier_déchiffré = os.path.join(
            dossier_où_sauveagarder_les_csv,
            basename_du_fichier_avec_les_données_chiffrées[:-4]
        )
        fichier_chiffré = os.path.join(
            dossier_avec_les_données_chiffrées,
            basename_du_fichier_avec_les_données_chiffrées
        )
        process = subprocess.run(
            f'{executable_gpg} --output {nom_cible_du_fichier_déchiffré} --decrypt {fichier_chiffré}',
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False
        )
        log_process(logger, process)
        logger.info(f"Fichier {basename_du_fichier_avec_les_données_chiffrées} déchiffré")
    nombre_de_fichiers_déchiffrés = len(os.listdir(dossier_où_sauveagarder_les_csv))
    logger.info(
        f"Fin du déchiffrement des données DIAMANT. {nombre_de_fichiers_déchiffrés} fichiers csv"
        f" ont été enregistrés dans le répertoire {dossier_où_sauveagarder_les_csv}")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    dossier_avec_les_données_diamant_chiffrées = variables_d_environnement["DIAMANT_ENCRYPTED_DATA_PATH"]
    dossier_où_sauveagarder_les_csv_diamant = variables_d_environnement["DIAMANT_DATA_PATH"]
    clef_privée_diamant = variables_d_environnement["DIAMANT_KEY"]
    déchiffre_les_fichiers_du_dossier(dossier_avec_les_données_diamant_chiffrées,
                                      dossier_où_sauveagarder_les_csv_diamant, clef_privée_diamant, logger_helios,
                                      variables_d_environnement["EXECUTABLE_GPG"])

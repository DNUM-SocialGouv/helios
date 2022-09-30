import os
import subprocess
from logging import Logger
from typing import Callable

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.formate_les_logs_des_process import log_process


def vérifie_qu_on_a_la_clef_pour_déchiffrer(
        executable_gpg: str,
        fichier_chiffré: str,
        exécute: Callable = subprocess.run):
    retourne_l_id_de_la_clef_utilisée_pour_chiffrer_le_fichier = exécute(
        f"{executable_gpg} --list-packets {fichier_chiffré} | grep keyid",
        shell=True,
        capture_output=True,
        check=False
    )
    ligne_où_apparaît_l_id_de_la_clef = retourne_l_id_de_la_clef_utilisée_pour_chiffrer_le_fichier.stdout.decode()
    id_de_la_clef = ligne_où_apparaît_l_id_de_la_clef.split(" ")[-1].replace("\n", "")
    trouve_l_id_de_la_clef_parmi_celles_connues_par_gpg = exécute(
        f"{executable_gpg} --list-secret-keys --keyid-format LONG | grep {id_de_la_clef}",
        shell=True,
        capture_output=True,
        check=False
    )
    la_clef_est_connue = len(trouve_l_id_de_la_clef_parmi_celles_connues_par_gpg.stdout.decode()) > 0
    return la_clef_est_connue


def déchiffre_les_fichiers_du_dossier(
        dossier_avec_les_données_chiffrées: str,
        dossier_où_sauvegarder_les_csv: str,
        logger: Logger,
        executable_gpg: str,
        vérifie_qu_on_a_la_clef_pour_déchiffrer: Callable = vérifie_qu_on_a_la_clef_pour_déchiffrer,
        exécute: Callable = subprocess.run
) -> None:
    for fichier in os.listdir(dossier_où_sauvegarder_les_csv):
        os.unlink(os.path.join(dossier_où_sauvegarder_les_csv, fichier))
    logger.info(
        f"Début du déchiffrement des données DIAMANT à partir du répertoire {dossier_avec_les_données_chiffrées}")
    for basename_du_fichier_avec_les_données_chiffrées in os.listdir(dossier_avec_les_données_chiffrées):
        nom_cible_du_fichier_déchiffré = os.path.join(
            dossier_où_sauvegarder_les_csv,
            basename_du_fichier_avec_les_données_chiffrées[:-4]
        )
        fichier_chiffré = os.path.join(
            dossier_avec_les_données_chiffrées,
            basename_du_fichier_avec_les_données_chiffrées
        )
        if vérifie_qu_on_a_la_clef_pour_déchiffrer(executable_gpg, fichier_chiffré):
            process = exécute(
                f"{executable_gpg} --output {nom_cible_du_fichier_déchiffré} --decrypt {fichier_chiffré}",
                shell=True,
                capture_output=True,
                check=False
            )
            log_process(logger, process)
            if process.returncode == 0:
                logger.info(f"Fichier {basename_du_fichier_avec_les_données_chiffrées} déchiffré")

        else:
            logger.error(f"La clef privée fournie ne peut pas déchiffrer le fichier {basename_du_fichier_avec_les_données_chiffrées}")
    nombre_de_fichiers_déchiffrés = len(os.listdir(dossier_où_sauvegarder_les_csv))
    logger.info(
        f"Fin du déchiffrement des données DIAMANT. {nombre_de_fichiers_déchiffrés} fichiers csv"
        f" ont été enregistrés dans le répertoire {dossier_où_sauvegarder_les_csv}")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    dossier_avec_les_données_diamant_chiffrées = variables_d_environnement["DIAMANT_ENCRYPTED_DATA_PATH"]
    dossier_où_sauveagarder_les_csv_diamant = variables_d_environnement["DIAMANT_DATA_PATH"]
    clef_privée_diamant = variables_d_environnement["DIAMANT_KEY"]
    déchiffre_les_fichiers_du_dossier(dossier_avec_les_données_diamant_chiffrées,
                                      dossier_où_sauveagarder_les_csv_diamant,
                                      logger_helios,
                                      variables_d_environnement["EXECUTABLE_GPG"])

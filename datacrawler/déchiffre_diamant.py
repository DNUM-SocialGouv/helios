import os
import shutil
import subprocess
from logging import Logger
from pathlib import Path
from typing import Callable

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.formate_les_logs_des_process import log_process


def _vérifie_la_clef(fichier_chiffré: str, exécute_une_commande: Callable = subprocess.run) -> bool:
    retourne_l_id_de_la_clef_utilisée_pour_chiffrer_le_fichier = exécute_une_commande(
        f"gpg --list-packets {fichier_chiffré} | grep keyid", shell=True, capture_output=True, check=False
    )
    ligne_où_apparaît_l_id_de_la_clef = retourne_l_id_de_la_clef_utilisée_pour_chiffrer_le_fichier.stdout.decode()
    id_de_la_clef = ligne_où_apparaît_l_id_de_la_clef.split(" ")[-1].replace("\n", "")
    trouve_l_id_de_la_clef_parmi_celles_connues_par_gpg = exécute_une_commande(
        f"gpg --list-secret-keys --keyid-format LONG | grep {id_de_la_clef}", shell=True, capture_output=True, check=False
    )
    la_clef_est_connue = len(trouve_l_id_de_la_clef_parmi_celles_connues_par_gpg.stdout.decode()) > 0
    return la_clef_est_connue


def déchiffre(
    dossier_avec_les_données_chiffrées: str,
    dossier_où_sauvegarder_les_csv: str,
    logger: Logger,
    vérifie_la_clef: Callable = _vérifie_la_clef,
    exécute_une_commande: Callable = subprocess.run,
) -> None:
    if os.path.exists(dossier_où_sauvegarder_les_csv):
        shutil.rmtree(dossier_où_sauvegarder_les_csv)
    Path(dossier_où_sauvegarder_les_csv).mkdir(parents=True, exist_ok=True)

    logger.info(f"Début du déchiffrement des données DIAMANT à partir du répertoire {dossier_avec_les_données_chiffrées}")

    for basename_du_fichier_avec_les_données_chiffrées in os.listdir(dossier_avec_les_données_chiffrées):
        nom_cible_du_fichier_déchiffré = os.path.join(dossier_où_sauvegarder_les_csv, basename_du_fichier_avec_les_données_chiffrées[:-4])
        fichier_chiffré = os.path.join(dossier_avec_les_données_chiffrées, basename_du_fichier_avec_les_données_chiffrées)
        if vérifie_la_clef(fichier_chiffré):
            process = exécute_une_commande(
                f"gpg --output {nom_cible_du_fichier_déchiffré} --decrypt {fichier_chiffré}", shell=True, capture_output=True, check=False
            )
            log_process(logger, process)
            code_de_succès_commande_gpg = 0
            if process.returncode == code_de_succès_commande_gpg:
                logger.info(f"Fichier {basename_du_fichier_avec_les_données_chiffrées} déchiffré")

        else:
            logger.error(f"La clef privée fournie ne peut pas déchiffrer le fichier {basename_du_fichier_avec_les_données_chiffrées}")

    nombre_de_fichiers_déchiffrés = len(os.listdir(dossier_où_sauvegarder_les_csv))

    logger.info(
        f"Fin du déchiffrement des données DIAMANT. {nombre_de_fichiers_déchiffrés} fichiers CSV "
        f"ont été enregistrés dans le répertoire {dossier_où_sauvegarder_les_csv}"
    )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    dossier_avec_les_données_diamant_chiffrées = variables_d_environnement["DIAMANT_ENCRYPTED_DATA_PATH"]
    dossier_où_sauvegarder_les_csv_diamant = variables_d_environnement["DIAMANT_DATA_PATH"]
    déchiffre(dossier_avec_les_données_diamant_chiffrées, dossier_où_sauvegarder_les_csv_diamant, logger_helios)

import os

import pandas as pd

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_qualite
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.delete_files_in_directory import delete_files_in_directory
from datacrawler.transform.equivalence_siicea_helios import (
    colonnes_a_lire_bloc_qualite_inspections,
    extrais_l_equivalence_des_types_des_colonnes,
    equivalences_siicea_helios,
)


def filter_statut(statut: str) -> bool:
    return statut == "Clôturé"


def filter_inspection(donnees_inspections: pd.DataFrame) -> pd.DataFrame:
    date_regex = r"^(19\d{2}|2\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$"
    return donnees_inspections[
        (donnees_inspections["Statut de la mission"].apply(filter_statut))
        & (donnees_inspections["Code FINESS"].astype(str).str.len() == 9)
        & ((donnees_inspections["Date réelle Rapport"].str.fullmatch(date_regex, na=True)))
        & ((donnees_inspections["Date réelle Visite"].str.fullmatch(date_regex, na=True)))
    ]


def check_downloaded_siicea_file(chemin_local_du_fichier_siicea: str, fichier_siicea_traite: str) -> None:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(equivalences_siicea_helios)
    donnees_inspections = lis_le_fichier_csv(chemin_local_du_fichier_siicea, colonnes_a_lire_bloc_qualite_inspections, types_des_colonnes)
    donnees_inspections_filtrees = filter_inspection(donnees_inspections).drop_duplicates()
    donnees_inspections_filtrees.to_csv(fichier_siicea_traite, index=False, sep=";")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()

    siicea_data_path = variables_d_environnement["SIICEA_DATA_PATH"]
    checked_siicea_data_path = variables_d_environnement["CHECKED_SIICEA_DATA_PATH"]

    if not os.path.exists(checked_siicea_data_path):
        os.makedirs(checked_siicea_data_path)

    delete_files_in_directory(checked_siicea_data_path)
    fichiers = os.listdir(siicea_data_path)

    chemin_local_du_fichier_sivss = os.path.join(siicea_data_path, trouve_le_nom_du_fichier_qualite(fichiers, "siicea", logger_helios))

    fichier_sivss_traite = os.path.join(checked_siicea_data_path, trouve_le_nom_du_fichier_qualite(fichiers, "siicea", logger_helios))

    check_downloaded_siicea_file(chemin_local_du_fichier_sivss, fichier_sivss_traite)

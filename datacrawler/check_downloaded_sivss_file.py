import os
from datetime import datetime
from datetime import date

import pandas as pd

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_qualite
from datacrawler.extract.delete_files_in_directory import delete_files_in_directory
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.transform.equivalences_sivss_helios import (
    colonnes_a_lire_bloc_qualite_evenements_indesirables,
    extrais_l_equivalence_des_types_des_colonnes,
    equivalences_sivss_evenements_indesirables_helios,
)


def get_year_from_date(date_to_convert: str) -> int:
    return datetime.strptime(date_to_convert, "%Y-%m-%d").year


def filter_famille(famille: str) -> bool:
    return (famille == "Evénements indésirables/graves associés aux soins") | (famille == "Evénements/incidents dans un établissement ou organisme")


def filter_motif(motif: str) -> bool:
    return (motif != "Incomplet") & (motif != "Doublon") & (motif != "Non validé")


def filter_etat(etat: str) -> bool:
    return etat != "Interco"


def filter_evenements_indesirables(donnees_evenements_indesirables: pd.DataFrame) -> pd.DataFrame:
    current_year = int(date.today().strftime("%Y"))
    date_regex = r"^(19\d{2}|2\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$"
    return donnees_evenements_indesirables[
        (donnees_evenements_indesirables["DATE_CLOTURE"].str.fullmatch(date_regex, na=True))
        & (donnees_evenements_indesirables["MOTIF_CLOTURE"].apply(filter_motif))
        & (donnees_evenements_indesirables["ETAT"].apply(filter_etat))
        & (donnees_evenements_indesirables["FAMILLE_PRINCIPALE"].apply(filter_famille))
        & (donnees_evenements_indesirables["DATE_RECEPTION"].apply(get_year_from_date).le(current_year))
        & (donnees_evenements_indesirables["DATE_RECEPTION"].apply(get_year_from_date).ge(current_year - 5))
        & (donnees_evenements_indesirables["NUMERO_SIVSS"].astype(str).str.len() == 6)
    ]


def check_downloaded_sivss_file(chemin_local_du_fichier_evenements_indesirables: str, fichier_sivss_traite_param: str) -> None:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(equivalences_sivss_evenements_indesirables_helios)
    donnees_evenements_indesirables = lis_le_fichier_csv(
        chemin_local_du_fichier_evenements_indesirables, colonnes_a_lire_bloc_qualite_evenements_indesirables, types_des_colonnes
    )
    donnees_evenements_indesirables_filtrees = filter_evenements_indesirables(donnees_evenements_indesirables)
    donnees_evenements_indesirables_filtrees.to_csv(fichier_sivss_traite_param, index=False, sep=";")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()

    sivss_data_path = variables_d_environnement["SIVSS_DATA_PATH"]
    checked_sivss_data_path = variables_d_environnement["CHECKED_SIVSS_DATA_PATH"]

    if not os.path.exists(checked_sivss_data_path):
        os.makedirs(checked_sivss_data_path)

    delete_files_in_directory(checked_sivss_data_path)
    fichiers = os.listdir(sivss_data_path)

    chemin_local_du_fichier_sivss = os.path.join(sivss_data_path, trouve_le_nom_du_fichier_qualite(fichiers, "sivss", logger_helios))

    fichier_sivss_traite = os.path.join(checked_sivss_data_path, trouve_le_nom_du_fichier_qualite(fichiers, "sivss", logger_helios))

    check_downloaded_sivss_file(chemin_local_du_fichier_sivss, fichier_sivss_traite)

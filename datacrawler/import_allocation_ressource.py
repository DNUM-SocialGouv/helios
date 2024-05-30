import os

import pandas as pd

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_a_lire_allocation_ressource,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_men_hapi_allocation_ressource_helios
)

def filter_allocation_ressource(donnees_allocation_ressource: pd.DataFrame) -> pd.DataFrame:
    year_regex = r'((20[012]\d{1}|19\d{2}))'
    month_regex = r'(([0-9])|(1[012]))'
    return donnees_allocation_ressource[(donnees_allocation_ressource['Finess EJ'].astype(str).str.len() == 9)
            & ((donnees_allocation_ressource['Finess'].astype(str).str.len() == 9)) 
            & ((donnees_allocation_ressource['Année Campagne HAPI'].str.fullmatch(year_regex, na=True)))
            & ((donnees_allocation_ressource['Mois'].str.fullmatch(month_regex, na=True)))
            ]

def check_downloaded_men_hapi_file(chemin_local_du_fichier_men_hapi: str) -> pd.DataFrame:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_hapi_allocation_ressource_helios)
    donnees_allocation_ressource = lis_le_fichier_csv(chemin_local_du_fichier_men_hapi, colonnes_a_lire_allocation_ressource, types_des_colonnes)
    donnees_allocation_ressource_filtrees = filter_allocation_ressource(donnees_allocation_ressource)
    return donnees_allocation_ressource_filtrees


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()

    men_hapi_data_path = variables_d_environnement["DIAMANT_DATA_PATH"]
    fichiers = os.listdir(men_hapi_data_path)

    chemin_local_du_fichier_men_hapi = os.path.join(
        men_hapi_data_path, trouve_le_nom_du_fichier_diamant(fichiers, "MEN_HAPI", logger_helios)
    )

    check_downloaded_men_hapi_file(chemin_local_du_fichier_men_hapi, logger_helios)

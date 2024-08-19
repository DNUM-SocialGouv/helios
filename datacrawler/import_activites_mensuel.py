import os

from datetime import datetime
import pandas as pd
from logging import Logger

from sqlalchemy.engine import Engine, create_engine
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_sirec_csv

from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_a_lire_activites_mensuel,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_men_pmsi_mensumu_helios
)

def filter_activites_mensuels(donnees_activites_mencumu: pd.DataFrame) -> pd.DataFrame:
    year_regex = r'((20[012]\d{1}|19\d{2}))'
    année_n_moins_1 = datetime.now().year - 1
    année_de_départ = datetime.now().year - 5
    return donnees_activites_mencumu[((donnees_activites_mencumu['Finess'].astype(str).str.len() == 9)) 
            & ((donnees_activites_mencumu['Année'].str.fullmatch(year_regex, na=True)))
            & ((donnees_activites_mencumu['Année'].astype(int).between(année_de_départ, année_n_moins_1)))
            & ((donnees_activites_mencumu['Mois'].astype(int).between(1, 12)))
            & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés MCO'].astype(str).str.isnumeric())
            & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés Médecine'].astype(str).str.isnumeric())
            & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés Chirurgie'].astype(str).str.isnumeric())
            & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés Obstétrique'].astype(str).str.isnumeric())
            & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés HTP/AMBU Médecine'].astype(str).str.isnumeric())
            & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés HTP/AMBU Chirurgie'].astype(str).str.isnumeric())
            & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés HTP/AMBU Obstétrique'].astype(str).str.isnumeric())
            & (donnees_activites_mencumu['Nombre de journées cumulées mensuelles hospit complète SSR'].astype(str).str.isnumeric())
            & (donnees_activites_mencumu['Nombre de journées cumulées mensuelles HTP SSR'].astype(str).str.isnumeric())
            ]

def check_downloaded_men_pmsi_mencumu_file(chemin_local_du_fichier_men_pmsi_mencumu: str) -> pd.DataFrame:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_pmsi_mensumu_helios)
    donnees_activites_mencumu = lis_le_fichier_sirec_csv(chemin_local_du_fichier_men_pmsi_mencumu, colonnes_a_lire_activites_mensuel, types_des_colonnes)
    activites_mensuel = filter_activites_mensuels(donnees_activites_mencumu)


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    men_pmsi_mencumu_data_path = variables_d_environnement["DIAMANT_DATA_PATH"]
    fichiers = os.listdir(men_pmsi_mencumu_data_path)

    chemin_local_du_fichier_men_pmsi_mencumu = os.path.join(
        men_pmsi_mencumu_data_path, trouve_le_nom_du_fichier_diamant(fichiers, "MEN_PMSI_MENCUMU", logger_helios)
    )

    check_downloaded_men_pmsi_mencumu_file(chemin_local_du_fichier_men_pmsi_mencumu)


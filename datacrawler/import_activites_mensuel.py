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

def transform_activites_mensuel(donnees_activites_mencumu: pd.DataFrame) -> pd.DataFrame:
    return donnees_activites_mencumu

def check_downloaded_men_pmsi_mencumu_file(chemin_local_du_fichier_men_pmsi_mencumu: str, logger: Logger) -> pd.DataFrame:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_pmsi_mensumu_helios)
    donnees_activites_mencumu = lis_le_fichier_sirec_csv(chemin_local_du_fichier_men_pmsi_mencumu, colonnes_a_lire_activites_mensuel, types_des_colonnes)
    activites_mensuel = transform_activites_mensuel(donnees_activites_mencumu)
    logger.info(f"les activites mensuels::::::::: - {activites_mensuel} ")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    men_pmsi_mencumu_data_path = variables_d_environnement["DIAMANT_DATA_PATH"]
    fichiers = os.listdir(men_pmsi_mencumu_data_path)

    chemin_local_du_fichier_men_pmsi_mencumu = os.path.join(
        men_pmsi_mencumu_data_path, trouve_le_nom_du_fichier_diamant(fichiers, "MEN_PMSI_MENCUMU", logger_helios)
    )

    check_downloaded_men_pmsi_mencumu_file(chemin_local_du_fichier_men_pmsi_mencumu, logger_helios)


import os
from datetime import datetime
from logging import Logger

import pandas as pd
from sqlalchemy.engine import Engine, create_engine
from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv

from datacrawler.load.nom_des_tables import TABLE_ACTIVITE_SANITAIRE_MENSUEL, FichierSource
from datacrawler.transform.transforme_les_activites_sanitaires_mensuels.transforme_les_donnees_activites_mensuels import (
    transforme_les_donnees_activites_mensuels,
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_a_lire_activites_mensuel,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_men_pmsi_mensumu_helios,
)


def filter_activites_mensuels(donnees_activites_mencumu: pd.DataFrame) -> pd.DataFrame:
    year_regex = r"((20[012]\d{1}|19\d{2}))"
    année_n_moins_1 = datetime.now().year
    année_de_départ = datetime.now().year - 5
    return donnees_activites_mencumu[
        ((donnees_activites_mencumu["Finess"].astype(str).str.len() == 9))
        & ((donnees_activites_mencumu["Année"].astype(str).str.fullmatch(year_regex, na=True)))
        & ((donnees_activites_mencumu["Année"].astype(int).between(année_de_départ, année_n_moins_1)))
        & ((donnees_activites_mencumu["Mois"].astype(int).between(1, 12)))
        # & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés Médecine'].astype(str).str.isnumeric())
        # & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés Chirurgie'].astype(str).str.isnumeric())
        # & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés Obstétrique'].astype(str).str.isnumeric())
        # & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés HTP/AMBU Médecine'].astype(str).str.isnumeric())
        # & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés HTP/AMBU Chirurgie'].astype(str).str.isnumeric())
        # & (donnees_activites_mencumu['Nombre de séjours mensuels cumulés HTP/AMBU Obstétrique'].astype(str).str.isnumeric())
        # & (donnees_activites_mencumu['Nombre de journées cumulées mensuelles hospit complète SSR'].astype(str).str.isnumeric())
        # & (donnees_activites_mencumu['Nombre de journées cumulées mensuelles HTP SSR'].astype(str).str.isnumeric())
    ]


def check_downloaded_men_pmsi_mencumu_file(chemin_local_du_fichier_men_pmsi_mencumu_param: str) -> pd.DataFrame:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_pmsi_mensumu_helios)
    donnees_activites_mencumu = lis_le_fichier_csv(chemin_local_du_fichier_men_pmsi_mencumu_param, colonnes_a_lire_activites_mensuel, types_des_colonnes)
    activites_mensuel = filter_activites_mensuels(donnees_activites_mencumu)
    return activites_mensuel


def import_activites_mensuels(
    donnees_activites_mensuel_filtrees: pd.DataFrame, base_de_données: Engine, chemin_local_du_fichier_men_pmsi_mencumu_param: str, logger: Logger
) -> None:
    numéros_finess_des_établissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_données)

    transform_donnees_activites_mensuel = transforme_les_donnees_activites_mensuels(
        donnees_activites_mensuel_filtrees, numéros_finess_des_établissements_connus, logger
    )

    date_du_fichier_men_pmsi_mencumu = extrais_la_date_du_nom_de_fichier_diamant(chemin_local_du_fichier_men_pmsi_mencumu_param)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs activites sanitaires mensuels",
            "DIAMANT",
            connection,
            TABLE_ACTIVITE_SANITAIRE_MENSUEL,
            transform_donnees_activites_mensuel,
            [(FichierSource.DIAMANT_MEN_PMSI_MENCUMU, date_du_fichier_men_pmsi_mencumu)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    men_pmsi_mencumu_data_path = variables_d_environnement["DIAMANT_DATA_PATH"]
    fichiers = os.listdir(men_pmsi_mencumu_data_path)

    chemin_local_du_fichier_men_pmsi_mencumu = os.path.join(
        men_pmsi_mencumu_data_path, trouve_le_nom_du_fichier_diamant(fichiers, "MEN_PMSI_MENCUMU", logger_helios)
    )

    donnees_activites_mensuels_fitrees = check_downloaded_men_pmsi_mencumu_file(chemin_local_du_fichier_men_pmsi_mencumu)
    import_activites_mensuels(donnees_activites_mensuels_fitrees, base_de_données_helios, chemin_local_du_fichier_men_pmsi_mencumu, logger_helios)

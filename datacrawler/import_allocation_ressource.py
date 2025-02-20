import os
from datetime import datetime
from logging import Logger

import pandas as pd
from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import (
    récupère_les_numéros_finess_des_entites_juridiques_de_la_base,
    récupère_les_numéros_finess_des_établissements_de_la_base,
)
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_diamant
from datacrawler.load.nom_des_tables import TABLE_RESSOURCE_ALLOCATION_EJ, TABLE_RESSOURCE_ALLOCATION_ET, FichierSource
from datacrawler.transform.transforme_les_donnees_allocation_ressource.transforme_les_donnees_allocation_ressource import (
    transforme_les_donnees_allocation_ressource_ej,
    transforme_les_donnees_allocation_ressource_et,
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_a_lire_allocation_ressource,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_men_hapi_allocation_ressource_helios,
)


def filter_allocation_ressource(donnees_allocation_ressource: pd.DataFrame) -> pd.DataFrame:
    year_regex = r"(19\d{2}|2\d{3})"
    année_n_moins_1 = datetime.now().year - 1
    année_de_départ = datetime.now().year - 5
    return donnees_allocation_ressource[
        ((donnees_allocation_ressource["Finess"].astype(str).str.len() == 9))
        & ((donnees_allocation_ressource["Année Campagne HAPI"].str.fullmatch(year_regex, na=True)))
        & ((donnees_allocation_ressource["Année Campagne HAPI"].astype(int).between(année_de_départ, année_n_moins_1)))
    ]


def check_downloaded_men_hapi_file(chemin_local_du_fichier_men_hapi_param: str) -> pd.DataFrame:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_hapi_allocation_ressource_helios)
    donnees_allocation_ressource = lis_le_fichier_csv(chemin_local_du_fichier_men_hapi_param, colonnes_a_lire_allocation_ressource, types_des_colonnes)
    return filter_allocation_ressource(donnees_allocation_ressource)


def import_allocation_ressource(
    donnees_allocation_ressource_filtrees_param: pd.DataFrame, base_de_données: Engine, chemin_local_du_fichier_men_hapi_param: str, logger: Logger
) -> None:
    numéros_finess_des_entites_juridiques_connues = récupère_les_numéros_finess_des_entites_juridiques_de_la_base(base_de_données)
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    transform_donnees_allocation_ressource = transforme_les_donnees_allocation_ressource_ej(
        donnees_allocation_ressource_filtrees_param, numéros_finess_des_entites_juridiques_connues, logger
    )

    transform_donnees_allocation_ressource_et = transforme_les_donnees_allocation_ressource_et(
        donnees_allocation_ressource_filtrees_param, numéros_finess_des_établissements_connus, logger
    )

    date_du_fichier_men_hapi = extrais_la_date_du_nom_de_fichier_diamant(chemin_local_du_fichier_men_hapi_param)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs allocation ressource entité juridique",
            "DIAMANT",
            connection,
            TABLE_RESSOURCE_ALLOCATION_EJ,
            transform_donnees_allocation_ressource,
            [(FichierSource.DIAMANT_MEN_HAPI, date_du_fichier_men_hapi)],
            logger,
        )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs allocation ressource établissement sanitaire",
            "DIAMANT",
            connection,
            TABLE_RESSOURCE_ALLOCATION_ET,
            transform_donnees_allocation_ressource_et,
            [(FichierSource.DIAMANT_MEN_HAPI, date_du_fichier_men_hapi)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    men_hapi_data_path = variables_d_environnement["DIAMANT_DATA_PATH"]
    fichiers = os.listdir(men_hapi_data_path)

    chemin_local_du_fichier_men_hapi = os.path.join(men_hapi_data_path, trouve_le_nom_du_fichier_diamant(fichiers, "MEN_HAPI", logger_helios))

    donnees_allocation_ressource_filtrees = check_downloaded_men_hapi_file(chemin_local_du_fichier_men_hapi)

    import_allocation_ressource(donnees_allocation_ressource_filtrees, base_de_données_helios, chemin_local_du_fichier_men_hapi, logger_helios)

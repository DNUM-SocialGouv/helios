import os
from logging import Logger
from typing import List

import pandas as pd
from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_hapi
from datacrawler.extract.lecteur_csv import lis_le_fichier_hapi_csv
from datacrawler.extract.lecteur_sql import (
    récupère_les_numéros_finess_des_entites_juridiques_de_la_base,
    récupère_les_numéros_finess_des_établissements_de_la_base,
)
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


def import_allocation_ressource(fichiers_param: List[str], men_hapi_data_path_param: str, base_de_données: Engine, logger: Logger) -> None:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_hapi_allocation_ressource_helios)
    dataframes = []
    for fichier in fichiers_param:
        chemin_local_du_fichier_men_hapi = os.path.join(men_hapi_data_path_param, fichier)
        donnees_allocation_ressource_par_annee = lis_le_fichier_hapi_csv(
            chemin_local_du_fichier_men_hapi, colonnes_a_lire_allocation_ressource, types_des_colonnes
        )
        dataframes.append(donnees_allocation_ressource_par_annee)
    donnees_allocation_ressource = pd.concat(dataframes, ignore_index=True)
    transform_donnees_allocation_ressource = transforme_les_donnees_allocation_ressource_ej(
        donnees_allocation_ressource, récupère_les_numéros_finess_des_entites_juridiques_de_la_base(base_de_données), logger
    )
    transform_donnees_allocation_ressource_et = transforme_les_donnees_allocation_ressource_et(
        donnees_allocation_ressource, récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données), logger
    )
    chemin_local_du_dernier_fichier_men_hapi = os.path.join(men_hapi_data_path_param, sorted(fichiers_param, reverse=True)[0])
    date_du_fichier_men_hapi = extrais_la_date_du_nom_de_fichier_hapi(chemin_local_du_dernier_fichier_men_hapi)
    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs allocation ressource entité juridique",
            "HAPI",
            connection,
            TABLE_RESSOURCE_ALLOCATION_EJ,
            transform_donnees_allocation_ressource,
            [(FichierSource.DIAMANT_MEN_HAPI, date_du_fichier_men_hapi)],
            logger,
        )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs allocation ressource établissement sanitaire",
            "HAPI",
            connection,
            TABLE_RESSOURCE_ALLOCATION_ET,
            transform_donnees_allocation_ressource_et,
            [(FichierSource.DIAMANT_MEN_HAPI, date_du_fichier_men_hapi)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    men_hapi_data_path = variables_d_environnement["HAPI_DATA_PATH"]
    fichiers = os.listdir(men_hapi_data_path)

    import_allocation_ressource(fichiers, men_hapi_data_path, base_de_données_helios, logger_helios)

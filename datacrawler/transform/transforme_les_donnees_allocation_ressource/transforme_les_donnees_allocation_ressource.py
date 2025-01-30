from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_allocation_ressource,
    index_allocation_ressource_et,
    équivalences_diamant_men_hapi_allocation_ressource_helios,
    équivalences_diamant_men_hapi_allocation_ressource_et_helios,
)


def filter_type_beneficiaire(type_beneficiaire):
    return type_beneficiaire == "ES"


def transforme_les_donnees_allocation_ressource_ej(
    donnees_allocation_ressource: pd.DataFrame, numéros_finess_des_entites_juridiques_connues: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    donnees_allocation_ressource_filtrees = donnees_allocation_ressource[donnees_allocation_ressource["TYPE_BENEFICIAIRE"].apply(filter_type_beneficiaire)]
    est_dans_finess = donnees_allocation_ressource_filtrees["ID_BENEFICIAIRE"].isin(
        numéros_finess_des_entites_juridiques_connues["numero_finess_entite_juridique"]
    )
    logger.info(f"[HAPI] {est_dans_finess.sum()} allocations de ressource sont liées à une EJ trouvé en base dans les fichiers hapi")
    donnees_allocation_ressource_filtrees = donnees_allocation_ressource_filtrees.drop(columns=["TYPE_BENEFICIAIRE"], axis=1)

    return (
        donnees_allocation_ressource_filtrees[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_men_hapi_allocation_ressource_helios))
        .set_index(index_allocation_ressource)
    )


def transforme_les_donnees_allocation_ressource_et(
    donnees_allocation_ressource: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    donnees_allocation_ressource_filtrees = donnees_allocation_ressource[donnees_allocation_ressource["TYPE_BENEFICIAIRE"].apply(filter_type_beneficiaire)]
    est_dans_finess = donnees_allocation_ressource_filtrees["ID_BENEFICIAIRE"].isin(
        numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"]
    )
    logger.info(f"[HAPI] {est_dans_finess.sum()} allocations de ressource sont liées à un ET trouvé en base dans les fichiers hapi")
    donnees_allocation_ressource_filtrees = donnees_allocation_ressource_filtrees.drop(columns=["TYPE_BENEFICIAIRE"], axis=1)

    return (
        donnees_allocation_ressource_filtrees[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_men_hapi_allocation_ressource_et_helios))
        .set_index(index_allocation_ressource_et)
    )

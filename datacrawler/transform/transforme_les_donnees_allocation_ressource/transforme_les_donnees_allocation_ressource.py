from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_allocation_ressource,
    index_allocation_ressource_et,
    équivalences_diamant_men_hapi_allocation_ressource_helios,
    équivalences_diamant_men_hapi_allocation_ressource_et_helios
)


def transforme_les_donnees_allocation_ressource_ej(
    donnees_allocation_ressource: pd.DataFrame, numéros_finess_des_entites_juridiques_connues: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = donnees_allocation_ressource["Finess"].isin(numéros_finess_des_entites_juridiques_connues["numero_finess_entite_juridique"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} allocations de ressource sont liées à une EJ trouvé en base dans le fichier men_hapi")

    return (
        donnees_allocation_ressource[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_men_hapi_allocation_ressource_helios))
        .set_index(index_allocation_ressource)
    )

def transforme_les_donnees_allocation_ressource_et(
    donnees_allocation_ressource: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = donnees_allocation_ressource["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} allocations de ressource sont liées à un ET trouvé en base dans le fichier men_hapi")

    return (
        donnees_allocation_ressource[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_men_hapi_allocation_ressource_et_helios))
        .set_index(index_allocation_ressource_et)
    )

from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_à_garder_finess_cs1400103,
    index_des_autorisations_sanitaires,
    équivalences_finess_cs1400103_helios,
    colonnes_a_garder_finess_amm_arhgos,
    index_autorisations_amm_sanitaires,
    equivalences_finess_amm_arhgos_helios
)


def transforme_les_données_des_autorisations(
    données_finess_des_autorisations: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_finess_des_autorisations["nofinesset"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[FINESS] {est_dans_finess.sum()} autorisations sont liées à un ET trouvé en base dans le fichier finess_cs1400103")

    return (
        données_finess_des_autorisations[est_dans_finess][colonnes_à_garder_finess_cs1400103]
        .rename(columns=équivalences_finess_cs1400103_helios)
        .dropna(subset=index_des_autorisations_sanitaires)
        .drop_duplicates(subset=index_des_autorisations_sanitaires)
        .set_index(index_des_autorisations_sanitaires)
    )


def transforme_les_donnees_des_autorisations_amm(
    donnees_des_autorisations_amm: pd.DataFrame, numeros_finess_des_etablissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = donnees_des_autorisations_amm["nofinesset"].isin(numeros_finess_des_etablissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[FINESS] {est_dans_finess.sum()} autorisations amm sont liées à un ET trouvé en base dans le fichier amm_arhgos")

    return (
        donnees_des_autorisations_amm[est_dans_finess][colonnes_a_garder_finess_amm_arhgos]
        .rename(columns=equivalences_finess_amm_arhgos_helios)
        .dropna(subset=index_autorisations_amm_sanitaires)
        .drop_duplicates(subset=index_autorisations_amm_sanitaires)
        .set_index(index_autorisations_amm_sanitaires)
    )

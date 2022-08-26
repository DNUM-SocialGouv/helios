from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_à_garder_finess_cs1400103,
    index_des_autorisations_sanitaires,
    équivalences_finess_cs1400103_helios,
)


def transforme_les_données_finess_cs1400103(
    données_finess_cs1400103: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_finess_cs1400103["nofinesset"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[FINESS] {est_dans_finess.sum()} autorisations sont liées à un ET trouvé en base dans le fichier finess_cs1400103")

    return (
        données_finess_cs1400103[est_dans_finess][colonnes_à_garder_finess_cs1400103]
        .rename(columns=équivalences_finess_cs1400103_helios)
        .dropna(subset=index_des_autorisations_sanitaires)
        .drop_duplicates(subset=index_des_autorisations_sanitaires)
        .set_index(index_des_autorisations_sanitaires)
    )

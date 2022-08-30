from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_à_garder_finess_cs1600101,
    index_des_autres_activités_sanitaires,
    équivalences_finess_cs1600101_helios,
)


def transforme_les_données_des_autres_activités(
    données_finess_des_autres_activités: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_finess_des_autres_activités["nofinesset"].isin(
        numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"]
    )
    logger.info(f"[FINESS] {est_dans_finess.sum()} autres activités sont liées à un ET trouvé en base dans le fichier finess_cs1600101")

    return (
        données_finess_des_autres_activités[est_dans_finess][colonnes_à_garder_finess_cs1600101]
        .rename(columns=équivalences_finess_cs1600101_helios)
        .dropna(subset=index_des_autres_activités_sanitaires)
        .drop_duplicates(subset=index_des_autres_activités_sanitaires)
        .set_index(index_des_autres_activités_sanitaires)
    )

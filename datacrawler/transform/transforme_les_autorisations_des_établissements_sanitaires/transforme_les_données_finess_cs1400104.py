from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (colonnes_à_garder_finess_cs1400104, index_des_équipements_matériels_lourds,
                                                              équivalences_finess_cs1400104_helios)


def transforme_les_données_finess_cs1400104(
    données_finess_cs1400104: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_finess_cs1400104["nofinesset"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[FINESS] {est_dans_finess.sum()} équipements matériels lourds sont liés à un ET trouvé en base dans le fichier finess_cs1400104")

    return (
        données_finess_cs1400104[est_dans_finess][colonnes_à_garder_finess_cs1400104]
        .rename(columns=équivalences_finess_cs1400104_helios)
        .dropna(subset=index_des_équipements_matériels_lourds)
        .drop_duplicates(subset=index_des_équipements_matériels_lourds)
        .set_index(index_des_équipements_matériels_lourds)
    )

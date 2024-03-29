from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_à_garder_finess_cs1600102,
    index_des_reconnaissances_contractuelles,
    équivalences_finess_cs1600102_helios,
)


def transforme_les_données_des_reconnaissances_contractuelles(
    données_finess_des_reconnaissances_contractuelles: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_finess_des_reconnaissances_contractuelles["nofinesset"].isin(
        numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"]
    )
    logger.info(f"[FINESS] {est_dans_finess.sum()} reconnaissances contractuelles sont liées à un ET trouvé en base dans le fichier finess_cs1600102")

    return (
        données_finess_des_reconnaissances_contractuelles[est_dans_finess][colonnes_à_garder_finess_cs1600102]
        .rename(columns=équivalences_finess_cs1600102_helios)
        .dropna(subset=index_des_reconnaissances_contractuelles)
        .drop_duplicates(subset=index_des_reconnaissances_contractuelles)
        .set_index(index_des_reconnaissances_contractuelles)
    )

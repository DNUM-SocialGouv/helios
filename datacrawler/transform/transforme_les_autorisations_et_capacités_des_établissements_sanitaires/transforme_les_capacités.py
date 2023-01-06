from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_capacités_sanitaires,
    équivalences_diamant_ann_sae_helios,
)


def transforme_les_données_des_capacités(
    données_diamant_ann_sae: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_diamant_ann_sae["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} capacités sont liées à un ET trouvé en base dans le fichier ann_sae")

    return (
        données_diamant_ann_sae[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_sae_helios))
        .dropna(subset=index_des_capacités_sanitaires)
        .drop(["annee"], axis=1)
        .set_index(index_des_capacités_sanitaires)
    )

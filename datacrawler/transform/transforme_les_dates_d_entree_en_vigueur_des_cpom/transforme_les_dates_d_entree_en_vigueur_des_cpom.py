from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_dates_d_entree_en_vigueur_des_cpom,
    équivalences_diamant_ann_ms_tdp_et_cpom_helios,
)


def transforme_les_dates_d_entree_en_vigueur_des_cpom(données_ann_ms_tdp_et: pd.DataFrame, numéros_finess_connus: pd.DataFrame, logger: Logger) -> pd.DataFrame:

    est_dans_finess = données_ann_ms_tdp_et["Finess"].isin(numéros_finess_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} dates d'entrée en vigueur des CPOM sont liées à un ET trouvé en base dans le fichier diamant ANN_MS_TDP_ET")

    return (
        données_ann_ms_tdp_et[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_ms_tdp_et_cpom_helios))
        .sort_values(by=["annee"], ascending=False)
        .drop(["annee"], axis=1)
        .drop_duplicates(subset=index_des_dates_d_entree_en_vigueur_des_cpom, keep="first")
        .set_index(index_des_dates_d_entree_en_vigueur_des_cpom)
    )

from datetime import datetime
from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_dates_d_entrée_en_vigueur_des_cpom,
    équivalences_diamant_ann_ms_tdp_et_cpom_helios,
)


def formate_la_date_d_entree_en_vigueur_des_cpom(donnees_des_dates_des_cpom: pd.DataFrame) -> pd.DataFrame:
    def formate_la_date(date_du_cpom: str) -> str:
        return datetime.strptime(date_du_cpom, "%d/%m/%Y").strftime("%Y-%m-%d")

    dates_formatees_des_entres_des_cpom = donnees_des_dates_des_cpom.copy()
    dates_formatees_des_entres_des_cpom["date_d_entree_en_vigueur"] = donnees_des_dates_des_cpom["date_d_entree_en_vigueur"].map(
        formate_la_date, na_action="ignore"
    )
    return dates_formatees_des_entres_des_cpom


def transforme_les_dates_d_entree_en_vigueur_des_cpom(donnees_ann_ms_tdp_et: pd.DataFrame, numeros_finess_connus: pd.DataFrame, logger: Logger) -> pd.DataFrame:
    est_dans_finess = donnees_ann_ms_tdp_et["Finess"].isin(numeros_finess_connus["nofinesset"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} dates d'entrée en vigueur des CPOM sont liées à un ET trouvé en base dans le fichier diamant ANN_MS_TDP_ET")

    dates_d_entree_en_vigueur_des_cpom = (
        donnees_ann_ms_tdp_et[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_ms_tdp_et_cpom_helios))
        .dropna(subset=["date_d_entree_en_vigueur"])
        .sort_values(by=["annee"], ascending=False)
        .drop(["annee"], axis=1)
        .drop_duplicates(subset=index_des_dates_d_entrée_en_vigueur_des_cpom, keep="first")
    )
    return formate_la_date_d_entree_en_vigueur_des_cpom(dates_d_entree_en_vigueur_des_cpom).set_index(index_des_dates_d_entrée_en_vigueur_des_cpom)

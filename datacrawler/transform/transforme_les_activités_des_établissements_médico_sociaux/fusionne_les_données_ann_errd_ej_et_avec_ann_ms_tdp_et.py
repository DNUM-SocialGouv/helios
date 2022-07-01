import pandas as pd


def fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et(
    données_ann_errd_ej_et: pd.DataFrame, données_ann_ms_tdp_et: pd.DataFrame
) -> pd.DataFrame:
    return données_ann_errd_ej_et.join(données_ann_ms_tdp_et, how="outer")

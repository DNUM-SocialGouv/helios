import pandas as pd


def fusionne_les_données_men_pmsi_annuel_avec_les_données_ann_rpu(données_men_pmsi_annuel: pd.DataFrame, données_ann_rpu: pd.DataFrame) -> pd.DataFrame:
    return données_men_pmsi_annuel.join(données_ann_rpu, how="outer")

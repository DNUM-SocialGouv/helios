import pandas as pd


def agrège_les_capacités_dans_les_entites_juridiques(capacites_sanitaires: pd.DataFrame) -> pd.DataFrame:
    return capacites_sanitaires.drop(columns=["numero_finess_etablissement_territorial"]).groupby(["annee", "numero_finess_entite_juridique"]).sum(min_count=1)

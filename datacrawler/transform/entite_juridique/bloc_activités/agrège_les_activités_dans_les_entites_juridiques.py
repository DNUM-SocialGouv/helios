import pandas as pd


def agrège_les_activités_dans_les_entites_juridiques(sanitaires: pd.DataFrame):
    return (
        sanitaires.drop(columns=["numero_finess_etablissement_territorial"])
        .groupby(["annee", "numero_finess_entite_juridique"], as_index=False)
        .sum(min_count=1)
    )

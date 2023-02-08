import pandas as pd


def agrège_les_activités_dans_les_entites_juridiques(sanitaires: pd.DataFrame) -> pd.DataFrame:
    return (
        sanitaires.drop(columns=["numero_finess_etablissement_territorial"])
        .groupby(["annee", "numero_finess_entite_juridique"])
        .sum(min_count=1)
        .rename(columns={"nombre_passages_urgences": "nombre_passage_urgence"})
    )

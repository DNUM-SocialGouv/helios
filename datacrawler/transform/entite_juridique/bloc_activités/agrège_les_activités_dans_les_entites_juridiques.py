import pandas as pd


def agrège_les_activités_dans_les_entites_juridiques(sanitaires):
    return (
        sanitaires.drop(columns=["numero_finess_etablissement_territorial"])
        .groupby("annee", as_index=False)
        .agg({"numero_finess_entite_juridique": "first", "nombre_sejours_partiels_medecine": "sum"})
    )

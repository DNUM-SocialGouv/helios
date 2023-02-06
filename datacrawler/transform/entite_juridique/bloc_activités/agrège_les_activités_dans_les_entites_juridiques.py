import pandas as pd


def agrège_les_activités_dans_les_entites_juridiques(sanitaires: pd.DataFrame):
    return (
        sanitaires.drop(columns=["numero_finess_etablissement_territorial"])
        .groupby("annee", as_index=False)
        .agg({"numero_finess_entite_juridique": "first",
              "nombre_sejours_partiels_medecine": "sum",
              "nombre_passages_urgences": "sum",
              "nombre_sejours_partiels_obstetrique": "sum",
              "nombre_sejours_partiels_chirurgie": "sum",
              "nombre_sejours_complets_medecine": "sum",
              "nombre_sejours_complets_chirurgie": "sum",
              "nombre_sejours_complets_obstetrique": "sum",
              "nombre_journees_completes_ssr": "sum",
              "nombre_journees_partiels_ssr": "sum",
              "nombre_journees_complete_psy": "sum",
              "nombre_journées_partielles_psy": "sum"})
    )

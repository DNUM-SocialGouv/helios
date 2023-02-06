import pandas as pd


def agrège_les_activités_dans_les_entites_juridiques(sanitaires: pd.DataFrame):
    return (
        sanitaires.drop(columns=["numero_finess_etablissement_territorial"])
        .groupby("annee", as_index=False)
        .agg({"numero_finess_entite_juridique": "first",
              "nombre_sejours_partiels_medecine": lambda x: x.sum(skipna=False),
              "nombre_passages_urgences": lambda x: x.sum(skipna=False),
              "nombre_sejours_partiels_obstetrique": lambda x: x.sum(skipna=False),
              "nombre_sejours_partiels_chirurgie": lambda x: x.sum(skipna=False),
              "nombre_sejours_complets_medecine": lambda x: x.sum(skipna=False),
              "nombre_sejours_complets_chirurgie": lambda x: x.sum(skipna=False),
              "nombre_sejours_complets_obstetrique": lambda x: x.sum(skipna=False),
              "nombre_journees_completes_ssr": lambda x: x.sum(skipna=False),
              "nombre_journees_partiels_ssr": lambda x: x.sum(skipna=False),
              "nombre_journees_complete_psy": lambda x: x.sum(skipna=False),
              "nombre_journées_partielles_psy": lambda x: x.sum(skipna=False)})
    )

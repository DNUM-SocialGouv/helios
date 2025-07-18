import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_a_garder_categories_finess,
    index_des_categories,
    equivalences_finess_cs1500106_helios,
)

def categoriser(categorie: str) -> str:
    if categorie == "SAN":
        return "Sanitaire"
    return "Médico-social"


def transforme_les_categories(
    donnees_categories_finess: pd.DataFrame
) -> pd.DataFrame:
    donnees_categories_finess["domaine"] = donnees_categories_finess["domaine"].apply(categoriser)
    return (
        donnees_categories_finess[colonnes_a_garder_categories_finess]
        .rename(columns=equivalences_finess_cs1500106_helios)
        .dropna(subset=index_des_categories)
        .drop_duplicates(subset=index_des_categories)
        .set_index(index_des_categories)
    )

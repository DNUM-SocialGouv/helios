import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    equivalences_json_finess_et_helios,
    index_des_etablissements_territorriaux,
)
from datacrawler.transform.transform_les_etablissements_territoriaux.transform_les_etablissements_territoriaux import (
    categoriser,
    classifier,
    normalize_and_uppercase,
)


def associe_le_domaine_depuis_la_categorie_parent(categorie: str, categories_entite_geographique_exercice: dict[str, dict[str, str]]) -> str:
    if pd.isna(categorie):
        return categoriser("")

    code_categorie = str(categorie).strip()
    return categoriser(categories_entite_geographique_exercice.get(code_categorie, {}).get("domaine", ""))


def associe_le_libelle_depuis_la_categorie(categorie: str, categories_entite_geographique_exercice: dict[str, dict[str, str]]) -> str:
    if pd.isna(categorie):
        return ""

    code_categorie = str(categorie).strip()
    return categories_entite_geographique_exercice.get(code_categorie, {}).get("libelle", "")


def associe_le_libelle_court_depuis_la_categorie(categorie: str, categories_entite_geographique_exercice: dict[str, dict[str, str]]) -> str:
    if pd.isna(categorie):
        return ""

    code_categorie = str(categorie).strip()
    return categories_entite_geographique_exercice.get(code_categorie, {}).get("libelle_court", "")


def transforme_le_json_des_etablissements_territoriaux(
    etablissements_territoriaux: pd.DataFrame,
    categories_entite_geographique_exercice: dict[str, dict[str, str]],
    referentiel_departement_region: pd.DataFrame,
    modes_fixation_tarifaire: dict[str, str],
) -> pd.DataFrame:
    etablissements_territoriaux = etablissements_territoriaux.copy()
    etablissements_territoriaux["classification"] = etablissements_territoriaux["categetab"].apply(classifier)
    etablissements_territoriaux["domaine"] = etablissements_territoriaux["categetab"].apply(
        lambda categorie: associe_le_domaine_depuis_la_categorie_parent(categorie, categories_entite_geographique_exercice)
    )
    etablissements_territoriaux["rslongue"] = etablissements_territoriaux["rslongue"].where(
        etablissements_territoriaux["rslongue"].notna() & (etablissements_territoriaux["rslongue"] != ""),
        etablissements_territoriaux["rs"],
    )

    referentiel = referentiel_departement_region.rename(
        columns={
            "ref_code_cog": "cogCommune",
            "ref_libelle_commune": "libcommune",
            "ref_libelle_dep": "libdepartement",
        }
    )
    etablissements_territoriaux = pd.merge(etablissements_territoriaux, referentiel, on="cogCommune", how="left")
    etablissements_territoriaux["libcommune"] = etablissements_territoriaux["libcommune"].apply(normalize_and_uppercase)
    etablissements_territoriaux["libdepartement"] = etablissements_territoriaux["libdepartement"].apply(normalize_and_uppercase)
    etablissements_territoriaux["libcategetab"] = etablissements_territoriaux["categetab"].apply(
        lambda categorie: associe_le_libelle_depuis_la_categorie(categorie, categories_entite_geographique_exercice)
    )
    etablissements_territoriaux["libcourtcategetab"] = etablissements_territoriaux["categetab"].apply(
        lambda categorie: associe_le_libelle_court_depuis_la_categorie(categorie, categories_entite_geographique_exercice)
    )
    etablissements_territoriaux["libmft"] = etablissements_territoriaux["codemft"].map(modes_fixation_tarifaire).fillna("")

    return (
        etablissements_territoriaux
        .rename(columns=equivalences_json_finess_et_helios)
        .drop(columns=["cogCommune", "datefermeture", "etatObjet", "idEge", "ref_code_dep"], errors="ignore")
        .dropna(subset=index_des_etablissements_territorriaux)
        .drop_duplicates(subset=index_des_etablissements_territorriaux)
        .set_index(index_des_etablissements_territorriaux)
    )

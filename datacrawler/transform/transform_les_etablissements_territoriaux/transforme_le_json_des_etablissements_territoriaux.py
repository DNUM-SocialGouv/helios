import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    equivalences_json_finess_et_helios,
    index_des_etablissements_territorriaux,
)
from datacrawler.transform.transform_les_etablissements_territoriaux.transform_les_etablissements_territoriaux import (
    classifier,
    normalize_and_uppercase,
)


def transforme_le_json_des_etablissements_territoriaux(
    etablissements_territoriaux: pd.DataFrame,
    referentiel_departement_region: pd.DataFrame,
) -> pd.DataFrame:
    etablissements_territoriaux = etablissements_territoriaux.copy()
    etablissements_territoriaux["classification"] = etablissements_territoriaux["categetab"].apply(classifier)
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
    etablissements_territoriaux["libcategetab"] = ""
    etablissements_territoriaux["libcourtcategetab"] = ""
    etablissements_territoriaux["libmft"] = ""

    return (
        etablissements_territoriaux
        .rename(columns=equivalences_json_finess_et_helios)
        .drop(columns=["cogCommune", "datefermeture", "etatObjet", "ref_code_dep"], errors="ignore")
        .dropna(subset=index_des_etablissements_territorriaux)
        .drop_duplicates(subset=index_des_etablissements_territorriaux)
        .set_index(index_des_etablissements_territorriaux)
    )

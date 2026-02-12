from functools import reduce
import pandas as pd

from datacrawler.transform.equivalences_has_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    equivalences_qualite_has_helios_base,
    index_qualite_has,
)

def _filtrer_qualite_has(
    qualite_has: pd.DataFrame,
    numeros_finess: pd.DataFrame
) -> pd.DataFrame:

    mask_finess = qualite_has["finess"].isin(
        numeros_finess["numero_finess_etablissement_territorial"]
    )

    keys = [
        "score_all_rea_ajust_dp",
        "score_all_ajust_dp_ca",
        "mco_dpa_pcd_2018-pcd_resultat",
        "mco_dpa_pcd_2018-pcd_classe",
        "certification_ref_2021_decision",
        "certification_ref_2021_date_decision",
    ]

    mask_key = qualite_has["key"].isin(keys)

    return qualite_has[mask_finess & mask_key]

def _garder_derniere_annee(df: pd.DataFrame) -> pd.DataFrame:
    idx = (
        df.groupby(["finess", "key"])["annee"]
        .apply(lambda s: s.idxmax())
        .values
    )

    return (
        df.loc[idx]
        .sort_values(["finess", "key"])
        .reset_index(drop=True)
    )

def transform_les_donnees_qualite_has(
    qualite_has: pd.DataFrame, numeros_finess_des_etablissements_connus: pd.DataFrame
) -> pd.DataFrame:
    qualite_has_filtre = _filtrer_qualite_has(
        qualite_has, numeros_finess_des_etablissements_connus
    )
    val_num = "value_float"
    val_int = "value_integer"
    val_date = "value_date"
    val_str = "value_string"

    qualite_has_latest = _garder_derniere_annee(qualite_has_filtre)
    # pivot par type d'indicateur
    qualite_has_latest_num = (
    qualite_has_latest
    .dropna(subset=[val_num])
    .pivot(index="finess", columns="key", values=val_num)
    )
    qualite_has_latest_int = (
    qualite_has_latest
    .dropna(subset=[val_int])
    .pivot(index="finess", columns="key", values=val_int)
    )
    qualite_has_latest_str = (
    qualite_has_latest
    .dropna(subset=[val_str])
    .pivot(index="finess", columns="key", values=val_str)
    )
    qualite_has_latest_date = (
    qualite_has_latest
    .dropna(subset=[val_date])
    .pivot(index="finess", columns="key", values=val_date)
    )
    dfs = [qualite_has_latest_num, qualite_has_latest_int, qualite_has_latest_str, qualite_has_latest_date]
    dfs = [d for d in dfs if not d.empty]

    qualite_data = reduce(
        lambda left, right: left.join(right, how="outer"),
        dfs
    ).reset_index()

    qualite_has_transforme = (qualite_data
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_qualite_has_helios_base))
        .dropna(subset=index_qualite_has)
        .drop_duplicates(subset=index_qualite_has))

    return qualite_has_transforme.set_index(index_qualite_has)

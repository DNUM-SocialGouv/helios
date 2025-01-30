import pandas as pd

from logging import Logger
from datacrawler import filtre_les_données_sur_les_n_dernières_années
from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    équivalences_diamant_quo_san_finance_buget_finance_helios,
    index_du_bloc_budget_et_finances_entite_juridique,
    index_du_bloc_budget_et_finances_etablissement_territorial,
)

NOMBRE_D_ANNEES_BUDGET_FINANCE = 5


def transform_les_donnees_budget_finance_entite_juridique(
    données_quo_san_finance: pd.DataFrame, numéros_finess_des_entites_juridiques_connues: pd.DataFrame
) -> pd.DataFrame:
    est_dans_finess = données_quo_san_finance["Finess EJ"].isin(numéros_finess_des_entites_juridiques_connues["numero_finess_entite_juridique"])
    données_dernieres_5_annees = filtre_les_données_sur_les_n_dernières_années(données_quo_san_finance, NOMBRE_D_ANNEES_BUDGET_FINANCE)
    return (
        données_dernieres_5_annees[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_quo_san_finance_buget_finance_helios))
        .drop_duplicates(subset=index_du_bloc_budget_et_finances_entite_juridique)
        .set_index(index_du_bloc_budget_et_finances_entite_juridique)
    )


def transform_les_donnees_budget_finance_etablissement_territorial(
    données_quo_san_finance: pd.DataFrame, numéros_finess_des_etablissements_territoriaux_connus: pd.DataFrame
) -> pd.DataFrame:
    est_dans_finess = données_quo_san_finance["Finess ET"].isin(
        numéros_finess_des_etablissements_territoriaux_connus["numero_finess_etablissement_territorial"]
    )
    données_dernieres_5_annees = filtre_les_données_sur_les_n_dernières_années(données_quo_san_finance, NOMBRE_D_ANNEES_BUDGET_FINANCE)
    return (
        données_dernieres_5_annees[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_quo_san_finance_buget_finance_helios))
        .drop_duplicates(subset=index_du_bloc_budget_et_finances_etablissement_territorial)
        .set_index(index_du_bloc_budget_et_finances_etablissement_territorial)
    )


def extrais_les_donnees_entites_juridiques(data):
    # Créer un DataFrame pandas à partir des données en excluant la première ligne (l'en-tête)
    df = pd.DataFrame(data)

    # Vérifier si la colonne spécifiée existe dans les données
    if "numero_finess_etablissement_territorial" not in df.columns:
        print("La colonne 'numero_finess_etablissement_territorial' n'existe pas dans les données.")
        return None

    # Filtrer les lignes où la colonne spécifiée est vide ou ""
    df_filtre = df.loc[df["numero_finess_etablissement_territorial"].isna() | (df["numero_finess_etablissement_territorial"] == "")]

    # Supprimer la colonne spécifiée
    df_filtre.drop(columns=["numero_finess_etablissement_territorial"], inplace=True)

    return df_filtre


def extrais_les_donnees_etablissements_territoriaux_sanitaires(data):
    # Créer un DataFrame pandas à partir des données en excluant la première ligne (l'en-tête)
    df = pd.DataFrame(data)

    # Assurer que les champs d'ancien index deviennent des colonnes
    df.reset_index(inplace=True)

    # Vérifier si la colonne spécifiée existe dans les données
    if "numero_finess_etablissement_territorial" not in df.columns:
        print("La colonne 'numero_finess_etablissement_territorial' n'existe pas dans les données.")
        return None

    # Vérifier si les colonnes spécifiées existent dans les données
    if "numero_finess_etablissement_territorial" not in df.columns:
        print("Les colonnes 'annee' ou 'numero_finess_etablissement_territorial' n'existent pas dans les données.")
        return None

    # Filtrer les lignes où la colonne spécifiée n'est pas vide ou ""
    df_filtre = df.loc[df["numero_finess_etablissement_territorial"].notna() & (df["numero_finess_etablissement_territorial"] != "")]

    # Définir l'index sur les champs "annee" et "numero_finess_etablissement_territorial"
    df_filtre.set_index(["annee", "numero_finess_etablissement_territorial"], inplace=True)
    # Supprimer la colonne spécifiée
    df_filtre.drop(columns=["numero_finess_entite_juridique"], inplace=True)

    return df_filtre

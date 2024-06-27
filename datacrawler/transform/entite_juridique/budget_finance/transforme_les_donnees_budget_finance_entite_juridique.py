import pandas as pd

from logging import Logger
from datacrawler import filtre_les_données_sur_les_n_dernières_années
from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    équivalences_diamant_quo_san_finance_buget_finance_helios,
    index_du_bloc_budget_et_finances_entite_juridique,
    index_du_bloc_budget_et_finances_etablissement_territorial
)

NOMBRE_D_ANNEES_BUDGET_FINANCE = 5

def filtre_les_données_sur_finess_et(donnees_brutes: pd.DataFrame) -> pd.DataFrame:
    donnees_filtrees = donnees_brutes[donnees_brutes["Finess ET"].isna()]
    donnees_filtrees.drop(columns=["Finess ET"], inplace=True)
    return donnees_filtrees

def transform_les_donnees_budget_finance_entite_juridique(
    données_quo_san_finance: pd.DataFrame, numéros_finess_des_entites_juridiques_connues: pd.DataFrame
) -> pd.DataFrame:
    est_dans_finess = données_quo_san_finance["Finess EJ"].isin(numéros_finess_des_entites_juridiques_connues["numero_finess_entite_juridique"])
    donnees_filtrees = filtre_les_données_sur_finess_et(données_quo_san_finance)
    données_dernieres_5_annees = filtre_les_données_sur_les_n_dernières_années(donnees_filtrees, NOMBRE_D_ANNEES_BUDGET_FINANCE)
    return (
        données_dernieres_5_annees[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_quo_san_finance_buget_finance_helios))
        .drop_duplicates(subset=index_du_bloc_budget_et_finances_entite_juridique)
        .set_index(index_du_bloc_budget_et_finances_entite_juridique)
    )

def transform_les_donnees_budget_finance_etablissement_territorial(
    données_quo_san_finance: pd.DataFrame, numéros_finess_des_etablissements_territoriaux_connus: pd.DataFrame
) -> pd.DataFrame:
    est_dans_finess = données_quo_san_finance["Finess ET"].isin(numéros_finess_des_etablissements_territoriaux_connus["numero_finess_etablissement_territorial"])
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
    
   
    df.drop(columns=["numero_finess_etablissement_territorial"], inplace=True)
    
    return df


def extrais_les_donnees_etablissements_territoriaux_sanitaires(data):
    # Créer un DataFrame pandas à partir des données en excluant la première ligne (l'en-tête)
    df = pd.DataFrame(data)


    # Supprimer la colonne spécifiée
    df.drop(columns=["numero_finess_entite_juridique"], inplace=True)

    return df
import pandas as pd

from datacrawler import filtre_les_données_sur_les_n_dernières_années
from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_du_bloc_ressources_humaines_ej,
    equivalences_diamant_quo_san_ressources_humaines_helios
)

NOMBRE_D_ANNEES_RESSOURCES_HUMAINE = 5


def transform_les_donnees_ressources_humaines_entite_juridique(
    donnees_quo_san_finance: pd.DataFrame, numeros_finess_des_entites_juridiques_connues: pd.DataFrame
) -> pd.DataFrame:
    est_dans_finess = donnees_quo_san_finance["Finess EJ"].isin(numeros_finess_des_entites_juridiques_connues["numero_finess_entite_juridique"])
    donnees_dernieres_5_annees = filtre_les_données_sur_les_n_dernières_années(donnees_quo_san_finance, NOMBRE_D_ANNEES_RESSOURCES_HUMAINE
)
    return (
        donnees_dernieres_5_annees[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_diamant_quo_san_ressources_humaines_helios))
        .drop_duplicates(subset=index_du_bloc_ressources_humaines_ej)
        .set_index(index_du_bloc_ressources_humaines_ej)
    )


def extrais_les_donnees_entites_juridiques(data: pd.DataFrame) -> pd.DataFrame:
    # Créer un DataFrame pandas à partir des données en excluant la première ligne (l'en-tête)
    data_frame = pd.DataFrame(data)

    # Filtrer les lignes où la colonne spécifiée est vide ou ""
    df_filtre = data_frame.loc[data_frame["numero_finess_etablissement_territorial"].isna() | (data_frame["numero_finess_etablissement_territorial"] == "")]

    # Supprimer la colonne spécifiée
    df_filtre.drop(columns=["numero_finess_etablissement_territorial"], inplace=True)

    # Garder uniquement les lignes où au moins une des 4 colonnes a une valeur non nulle / non vide
    colonnes_cibles = [
        "nombre_etp_pm",
        "nombre_etp_pnm",
        "depenses_interim_pm",
        "jours_absenteisme_pm",
    ]
    df_filtre = df_filtre.loc[df_filtre[colonnes_cibles].notna().any(axis=1)]

    return df_filtre

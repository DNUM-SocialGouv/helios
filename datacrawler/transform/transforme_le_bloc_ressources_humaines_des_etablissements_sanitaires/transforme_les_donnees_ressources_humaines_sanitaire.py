import pandas as pd

from datacrawler import filtre_les_données_sur_les_n_dernières_années
from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_du_bloc_ressources_humaines_etsan,
    equivalences_diamant_quo_san_ressources_humaines_helios,
)

NOMBRE_D_ANNEES_RESSOURCES_HUMAINE = 5


def transforme_les_donnees_ressources_humaines(
    donnees_quo_san_finance: pd.DataFrame, numeros_finess_des_entites_etablissement_sanitaires_connus: pd.DataFrame
) -> pd.DataFrame:
    est_dans_finess = donnees_quo_san_finance["Finess ET"].isin(
        numeros_finess_des_entites_etablissement_sanitaires_connus["numero_finess_etablissement_territorial"]
    )

    donnees_dernieres_5_annees = filtre_les_données_sur_les_n_dernières_années(donnees_quo_san_finance, NOMBRE_D_ANNEES_RESSOURCES_HUMAINE)
    return (
        donnees_dernieres_5_annees[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_diamant_quo_san_ressources_humaines_helios))
        .drop_duplicates(subset=index_du_bloc_ressources_humaines_etsan)
        .set_index(index_du_bloc_ressources_humaines_etsan)
    )


def extrais_les_donnees(data: pd.DataFrame) -> pd.DataFrame:
    data_frame = pd.DataFrame(data)

    # Filtrer uniquement les lignes où l'index numero_finess_etablissement_territorial est renseigné
    mask = data_frame.index.get_level_values("numero_finess_etablissement_territorial").notna() & (
        data_frame.index.get_level_values("numero_finess_etablissement_territorial") != ""
    )
    df_filtre = data_frame.loc[mask]

    # Supprimer la colonne si elle existe
    if "numero_finess_entite_juridique" in df_filtre.columns:
        df_filtre = df_filtre.drop(columns=["numero_finess_entite_juridique"])

    # Garder uniquement les lignes où au moins une des colonnes cibles est renseignée
    colonnes_cibles = [
        "nombre_etp_pm",
        "nombre_etp_pnm",
        "depenses_interim_pm",
        "jours_absenteisme_pm",
        "jours_absenteisme_pnm",
    ]
    colonnes_existantes = [c for c in colonnes_cibles if c in df_filtre.columns]
    if colonnes_existantes:  # éviter erreur si aucune colonne trouvée
        df_filtre = df_filtre.loc[df_filtre[colonnes_existantes].notna().any(axis=1)]

    return df_filtre

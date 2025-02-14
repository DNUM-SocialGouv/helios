import os
from datetime import datetime
import pandas as pd
from sqlalchemy.engine import create_engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base

def filter_profession_groupe_data(donnees: pd.DataFrame, base_de_donnees) -> pd.DataFrame:
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_donnees)
    numéros_finess_liste = numéros_finess_des_établissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    # Année actuelle pour le filtre
    annee_actuelle = datetime.now().year
    year_regex = r"((20[012]\d{1}|19\d{2}))"

    # Filtrer les données
    donnees_filtrées = donnees[
        (donnees["numero_finess"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["annee"] >= annee_actuelle - 10) &
        (donnees["numero_finess"].astype(str).isin(numéros_finess_liste))
    ]

    return donnees_filtrées

if __name__ == "__main__":
    SOURCE = 'VigieRh'
    # Paramètres pour les données de profession_groupe
    TABLE_PROFESSION_GROUPE = "vigierh_profession_groupe"
    COLUMN_MAPPING_PROFESSION_GROUPE = {
        'finess_et': 'numero_finess',
        'year': 'annee',
        'month': 'mois',
        'profession2_code': 'profession_code',
        'effectif': 'effectif',
        'ind_qual_effectif_code':'indic_qualite_effectif_code',
        'ind_redr_effectif_code':'indic_redressement_effectif_code',
        'ind_masq_effectif_code':'indic_masque_secret_effectif_code',
    }
    PREFIX_FICHIER_PROFESSION_GROUPE = "vigierh_anneemois_profession2"

    # Paramètres pour les données de référence des types de ref_masque
    TABLE_REF_MASQUE = "vigierh_ref_masque"
    COLUM_MAPPING_REF_MASQUE = {
        'ind_masque_code': 'code',
        'ind_masque': 'label'
    }
    PREFIX_FICHIER_REF_MASQUE = "vigierh_ref_masque"

    # Paramètres pour les données de référence des types de vigierh_ref_profession_groupe
    TABLE_REF_PROFESSION_GROUPE = "vigierh_ref_profession_groupe"
    COLUM_MAPPING_REF_PROFESSION_GROUPE = {
        'profession2_code': 'code',
        'profession2': 'label'
    }
    PREFIX_FICHIER_REF_PROFESSION_GROUPE = "vigierh_ref_profession2"

    # Paramètres pour les données de référence des types de vigierh_ref_qualite
    TABLE_REF_QUALITE = "vigierh_ref_qualite"
    COLUM_MAPPING_REF_QUALITE = {
        'ind_qualite_code': 'code',
        'ind_qualite': 'label'
    }
    PREFIX_FICHIER_REF_QUALITE = "vigierh_ref_qualite"

    # Paramètres pour les données de référence des types de vigierh_ref_redressement
    TABLE_REF_REDRESSEMENT = "vigierh_ref_redressement"
    COLUM_MAPPING_REF_REDRESSEMENT = {
        'ind_redressement_code': 'code',
        'ind_redressement': 'label'
    }
    PREFIX_FICHIER_REF_REDRESSEMENT = "vigierh_ref_redressement"

    # Initialisations
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    chemin_local_du_fichier_profession_groupe = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_PROFESSION_GROUPE, logger_helios)
    )
    chemin_local_du_fichier_ref_masque = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_REF_MASQUE, logger_helios)
    )
    chemin_local_du_fichier_ref_profession_groupe = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_REF_PROFESSION_GROUPE, logger_helios)
    )
    chemin_local_du_fichier_ref_qualite = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_REF_QUALITE, logger_helios)
    )
    chemin_local_du_fichier_ref_redressement = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_REF_REDRESSEMENT, logger_helios)
    )

    # Traitements des données
    supprimer_donnees_existantes(TABLE_PROFESSION_GROUPE, base_de_données, SOURCE, logger_helios)
    supprimer_donnees_existantes(TABLE_REF_MASQUE, base_de_données, SOURCE, logger_helios)
    supprimer_donnees_existantes(TABLE_REF_PROFESSION_GROUPE, base_de_données, SOURCE, logger_helios)
    supprimer_donnees_existantes(TABLE_REF_QUALITE, base_de_données, SOURCE, logger_helios)
    supprimer_donnees_existantes(TABLE_REF_REDRESSEMENT, base_de_données, SOURCE, logger_helios)

    df_ref_masque = lis_le_fichier_parquet(chemin_local_du_fichier_ref_masque, COLUM_MAPPING_REF_MASQUE)
    inserer_nouvelles_donnees(TABLE_REF_MASQUE, base_de_données, SOURCE, df_ref_masque, logger_helios)

    df_ref_profession_groupe = lis_le_fichier_parquet(chemin_local_du_fichier_ref_profession_groupe, COLUM_MAPPING_REF_PROFESSION_GROUPE)
    inserer_nouvelles_donnees(TABLE_REF_PROFESSION_GROUPE, base_de_données, SOURCE, df_ref_profession_groupe, logger_helios)

    df_ref_qualite = lis_le_fichier_parquet(chemin_local_du_fichier_ref_qualite, COLUM_MAPPING_REF_QUALITE)
    inserer_nouvelles_donnees(TABLE_REF_QUALITE, base_de_données, SOURCE, df_ref_qualite, logger_helios)

    df_ref_redressement = lis_le_fichier_parquet(chemin_local_du_fichier_ref_redressement, COLUM_MAPPING_REF_REDRESSEMENT)
    inserer_nouvelles_donnees(TABLE_REF_REDRESSEMENT, base_de_données, SOURCE, df_ref_redressement, logger_helios)

    df = lis_le_fichier_parquet(chemin_local_du_fichier_profession_groupe, COLUMN_MAPPING_PROFESSION_GROUPE)
    df_filtré = filter_profession_groupe_data(df, base_de_données)
    inserer_nouvelles_donnees(TABLE_PROFESSION_GROUPE, base_de_données, SOURCE, df_filtré, logger_helios)

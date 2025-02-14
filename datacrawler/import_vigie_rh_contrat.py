import os
from datetime import datetime
import pandas as pd
from sqlalchemy.engine import create_engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base

def filter_contrat_data(donnees: pd.DataFrame, base_de_donnees) -> pd.DataFrame:
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
    # Paramètres pour les données de contrat
    TABLE_CONTRAT = "vigierh_contrat"
    COLUM_MAPPING_CONTRAT = {
        'finess_et': 'numero_finess',
        'year': 'annee',
        'month': 'mois',
        'nature_contrat_code': 'type_contrat_code',
        'effectif': 'effectif'
    }
    PREFIX_FICHIER_CONTRAT = "vigierh_anneemois_contrat_"

    # Paramètres pour les données de référence des types de contrat
    TABLE_REF = "vigierh_ref_type_contrat"
    COLUM_MAPPING_REF = {
        'nature_contrat_code': 'code',
        'nature_contrat': 'label'
    }
    PREFIX_FICHIER_REF = "vigierh_ref_nature_contrat"

    # Initialisations
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    chemin_local_du_fichier_contrat = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_CONTRAT, logger_helios)
    )
    chemin_local_du_fichier_ref = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_REF, logger_helios)
    )

    # Traitements des données
    supprimer_donnees_existantes(TABLE_CONTRAT, base_de_données, SOURCE, logger_helios)
    supprimer_donnees_existantes(TABLE_REF, base_de_données, SOURCE, logger_helios)

    df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, COLUM_MAPPING_REF)
    inserer_nouvelles_donnees(TABLE_REF, base_de_données, SOURCE, df_ref, logger_helios)

    df = lis_le_fichier_parquet(chemin_local_du_fichier_contrat, COLUM_MAPPING_CONTRAT)
    df_filtré = filter_contrat_data(df, base_de_données)
    inserer_nouvelles_donnees(TABLE_CONTRAT, base_de_données, SOURCE, df_filtré, logger_helios)

import os
import pandas as pd
from datetime import datetime
from sqlalchemy.engine import Engine, create_engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base

def filter_profession_filiere_data(donnees: pd.DataFrame, base_de_donnees) -> pd.DataFrame:
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
    source = 'VigieRh'
    # Paramètres pour les données de profession_filiere
    table_profession_filiere = "vigierh_profession_filiere"
    colum_mapping_profession_filiere = {
        'finess_et': 'numero_finess',
        'year': 'annee',
        'month': 'mois',
        'profession1_code': 'profession_code',
        'turnover': 'turnover',
        'entrees_taux':'taux_entrees',
        'sorties_taux':'taux_sorties',
        'entrees_nombre':'nombre_entrees',
        'sorties_nombre':'nombre_sorties',
        'region_turnover':'region_turnover',
        'nation_turnover':'nation_turnover',
        'groupe_turnover':'groupe_turnover',
    }
    prefix_fichier_profession_filiere = "vigierh_anneemois_profession1_"

    # Paramètres pour les données de référence des types de profession_filiere
    table_ref = "vigierh_ref_profession_filiere"
    colum_mapping_ref = {
        'profession1_code': 'code',
        'profession1': 'label'
    }
    prefix_fichier_ref = "vigierh_ref_profession1"

    # Initialisations
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    chemin_local_du_fichier_profession_filiere = os.path.join(vegie_rh_data_path, trouve_le_nom_du_fichier(fichiers, prefix_fichier_profession_filiere, logger_helios))
    chemin_local_du_fichier_ref = os.path.join(vegie_rh_data_path, trouve_le_nom_du_fichier(fichiers, prefix_fichier_ref, logger_helios))

    # Traitements des données
    supprimer_donnees_existantes(table_profession_filiere, base_de_données, source, logger_helios)
    supprimer_donnees_existantes(table_ref, base_de_données, source, logger_helios)

    df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, colum_mapping_ref)
    inserer_nouvelles_donnees(table_ref, base_de_données, source, df_ref, logger_helios)

    df = lis_le_fichier_parquet(chemin_local_du_fichier_profession_filiere, colum_mapping_profession_filiere)
    df_filtré = filter_profession_filiere_data(df, base_de_données)
    inserer_nouvelles_donnees(table_profession_filiere, base_de_données, source, df_filtré, logger_helios)

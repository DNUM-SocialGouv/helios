import os
import pandas as pd
from datetime import datetime
from sqlalchemy.engine import Engine, create_engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier

def filter_contrat_data(donnees: pd.DataFrame) -> pd.DataFrame:
    annee_actuelle = datetime.now().year
    year_regex = r"((20[012]\d{1}|19\d{2}))"

    return donnees[
        (donnees["numero_finess"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["annee"] >= annee_actuelle - 10)  # Garde seulement les 3 dernières années
    ]

if __name__ == "__main__":
    # Paramètres pour les données de contrat
    source = 'VigieRh'
    TABLE_NAME = "vigierh_contrat"
    COLUMN_MAPPING = {
        'finess_et': 'numero_finess',
        'year': 'annee',
        'month': 'mois',
        'nature_contrat_code': 'type_contrat_code',
        'effectif': 'effectif'
    }
    prefix_fichier = "vigierh_anneemois_contrat_"

    # Paramètres pour les données de référence des types de contrat
    TABLE_NAME_ref = "vigierh_ref_type_contrat"
    COLUMN_MAPPING_ref = {
        'nature_contrat_code': 'code',
        'nature_contrat': 'label'
    }
    prefix_fichier_ref = "vigierh_ref_nature_contrat"

    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    chemin_local_du_fichier_contrat = os.path.join(vegie_rh_data_path, trouve_le_nom_du_fichier(fichiers, prefix_fichier, logger_helios))
    chemin_local_du_fichier_ref = os.path.join(vegie_rh_data_path, trouve_le_nom_du_fichier(fichiers, prefix_fichier_ref, logger_helios))

    supprimer_donnees_existantes(base_de_données_helios, source, TABLE_NAME, logger_helios)
    supprimer_donnees_existantes(base_de_données_helios, source, TABLE_NAME_ref, logger_helios)

    df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, COLUMN_MAPPING_ref)
    inserer_nouvelles_donnees(base_de_données_helios, source, TABLE_NAME_ref, df_ref, logger_helios)

    df = lis_le_fichier_parquet(chemin_local_du_fichier_contrat, COLUMN_MAPPING)
    df_filtré = filter_contrat_data(df)
    inserer_nouvelles_donnees(base_de_données_helios, source, TABLE_NAME, df_filtré, logger_helios)

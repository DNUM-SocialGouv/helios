import os
import pandas as pd
from sqlalchemy.engine import Engine, create_engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet

def filter_contrat_data(donnees: pd.DataFrame) -> pd.DataFrame:
    return donnees[
        donnees["numero_finess"].astype(str).str.len() == 9
    ]

def import_vigie_rh_profession_groupe(dbEngine: Engine, logger_helios) -> None:
    # Chemin Parquet
    FILE_PATH_PARQUET = os.path.join(
        os.path.dirname(__file__),
        'exploration-des-données/vigie_rh/fichiers/parquet/vigierh_anneemois_profession2_2024_01_01.parquet'
    )

    # Paramètres
    TABLE_NAME = "vigierh_profession_groupe"
    COLUMN_MAPPING = {
        'finess_et': 'numero_finess',
        'year': 'annee',
        'month': 'mois',
        'profession2_code': 'profession_code',
        'effectif': 'effectif',
        'ind_qual_effectif_code':'indic_qualite_effectif_code',
        'ind_redr_effectif_code':'indic_redressement_effectif_code',
        'ind_masq_effectif_code':'indic_masque_secret_effectif_code',
    }

    df = lis_le_fichier_parquet(FILE_PATH_PARQUET, COLUMN_MAPPING)
    df_filtré = filter_contrat_data(df)

    supprimer_donnees_existantes(dbEngine, 'VigieRh', TABLE_NAME, logger_helios)
    inserer_nouvelles_donnees(dbEngine, 'VigieRh', TABLE_NAME, df_filtré, logger_helios)

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    import_vigie_rh_profession_groupe(base_de_données_helios, logger_helios)
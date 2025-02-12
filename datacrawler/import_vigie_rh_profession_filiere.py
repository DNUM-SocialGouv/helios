import os
import pandas as pd
from sqlalchemy.engine import Engine, create_engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet

def filter_contrat_data(donnees: pd.DataFrame) -> pd.DataFrame:
    annee_actuelle = datetime.now().year
    year_regex = r"((20[012]\d{1}|19\d{2}))"

    return donnees[
        (donnees["numero_finess"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        #(donnees["annee"] >= annee_actuelle - 2)  # Garde seulement les 3 dernières années
    ]

def import_vigie_rh_profession_filiere(dbEngine: Engine, logger_helios) -> None:
    # Chemin Parquet
    FILE_PATH_PARQUET = os.path.join(
        os.path.dirname(__file__),
        'exploration-des-données/vigie_rh/fichiers/parquet/vigierh_anneemois_profession1_2024_01_01.parquet'
    )

    # Paramètres
    TABLE_NAME = "vigierh_profession_filiere"
    COLUMN_MAPPING = {
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

    df = lis_le_fichier_parquet(FILE_PATH_PARQUET, COLUMN_MAPPING)
    df_filtré = filter_contrat_data(df)

    supprimer_donnees_existantes(dbEngine, 'VigieRh', TABLE_NAME, logger_helios)
    inserer_nouvelles_donnees(dbEngine, 'VigieRh', TABLE_NAME, df_filtré, logger_helios)

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    prefix_fichier = "vigierh_anneemois_profession1_"
    chemin_local_du_fichier_contrat = os.path.join(vegie_rh_data_path, trouve_le_nom_du_fichier(fichiers, prefix_fichier, logger_helios))

    import_vigie_rh_profession_filiere(base_de_données_helios, chemin_local_du_fichier_contrat, logger_helios)
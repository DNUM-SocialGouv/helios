import os
from datetime import datetime
import pandas as pd
from sqlalchemy.engine import create_engine
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
    SOURCE = 'VigieRh'
    # Paramètres pour les données de profession_filiere
    TABLE_PROFESSION_FILIERE = "vigierh_profession_filiere"
    COLUM_MAPPING_PROFESSION_FILIERE = {
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
    PREFIX_FICHIER_PROFESSION_FILIERE = "vigierh_anneemois_profession1_"

    # Paramètres pour les données de référence des types de profession_filiere
    TABLE_REF = "vigierh_ref_profession_filiere"
    COLUM_MAPPING_REF = {
        'profession1_code': 'code',
        'profession1': 'label'
    }
    PREFIX_FICHIER_REF = "vigierh_ref_profession1"

    # Initialisations
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    chemin_local_du_fichier_profession_filiere = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_PROFESSION_FILIERE, logger_helios)
    )
    chemin_local_du_fichier_ref = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, PREFIX_FICHIER_REF, logger_helios)
    )

    # Traitements des données
    supprimer_donnees_existantes(TABLE_PROFESSION_FILIERE, base_de_données, SOURCE, logger_helios)
    supprimer_donnees_existantes(TABLE_REF, base_de_données, SOURCE, logger_helios)

    df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, COLUM_MAPPING_REF)
    inserer_nouvelles_donnees(TABLE_REF, base_de_données, SOURCE, df_ref, logger_helios)

    df = lis_le_fichier_parquet(chemin_local_du_fichier_profession_filiere, COLUM_MAPPING_PROFESSION_FILIERE)
    df_filtré = filter_profession_filiere_data(df, base_de_données)
    inserer_nouvelles_donnees(TABLE_PROFESSION_FILIERE, base_de_données, SOURCE, df_filtré, logger_helios)

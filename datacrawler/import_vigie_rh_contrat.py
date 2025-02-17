import os
import pandas as pd
from sqlalchemy.engine import create_engine, Engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.load.vigie_rh import SOURCE, FichierSource, Table, ColumMapping

def filter_contrat_data(donnees: pd.DataFrame, base_de_donnees: Engine) -> pd.DataFrame:
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_donnees)
    numéros_finess_liste = numéros_finess_des_établissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    year_regex = r"((20[012]\d{1}|19\d{2}))"

    # Filtrer les données
    donnees_filtrées = donnees[
        (donnees["numero_finess"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["numero_finess"].astype(str).isin(numéros_finess_liste))
    ]

    return donnees_filtrées

if __name__ == "__main__":

    # Initialisations
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    chemin_local_du_fichier_contrat = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.PREFIX_FICHIER_CONTRAT.value, logger_helios)
    )
    chemin_local_du_fichier_ref = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.PREFIX_FICHIER_REF_TYPE_CONTRAT.value, logger_helios)
    )

    # Traitements des données
    df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_TYPE_CONTRAT.value)

    df = lis_le_fichier_parquet(chemin_local_du_fichier_contrat, ColumMapping.CONTRAT.value)
    df_filtré = filter_contrat_data(df, base_de_données)

    supprimer_donnees_existantes(Table.CONTRAT.value, base_de_données, SOURCE, logger_helios)
    supprimer_donnees_existantes(Table.REF_TYPE_CONTRAT.value, base_de_données, SOURCE, logger_helios)

    inserer_nouvelles_donnees(Table.REF_TYPE_CONTRAT.value, base_de_données, SOURCE, df_ref, logger_helios)
    inserer_nouvelles_donnees(Table.CONTRAT.value, base_de_données, SOURCE, df_filtré, logger_helios)

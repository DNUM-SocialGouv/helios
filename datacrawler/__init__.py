from datetime import datetime
from logging import Logger
from typing import List, Tuple

import pandas as pd
from sqlalchemy import create_engine, text, inspect, Connection

from datacrawler.load.nom_des_tables import FichierSource
from datacrawler.load.sauvegarde import mets_à_jour_la_date_de_mise_à_jour_du_fichier_source, sauvegarde

NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_MÉDICO_SOCIALES = 3
NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_SANITAIRES = 5


def écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
    nom_de_la_donnée: str,
    fournisseur: str,
    connection: Connection,
    table: str,
    données: pd.DataFrame,
    fichiers_mis_à_jour: List[Tuple[FichierSource, str]],
    logger: Logger,
) -> None:
    connection.execute(f"DELETE FROM {table};")
    logger.info(f"[{fournisseur}] Ancien-nes {nom_de_la_donnée} supprimé-es")
    sauvegarde(connection, table, données)
    for fichier, date_de_mise_à_jour in fichiers_mis_à_jour:
        mets_à_jour_la_date_de_mise_à_jour_du_fichier_source(connection, date_de_mise_à_jour, fichier)
    logger.info(f"[{fournisseur}] {données.shape[0]} {nom_de_la_donnée} sauvegardé-es")


def filtre_les_données_sur_les_n_dernières_années(données_brutes: pd.DataFrame, nombre_d_années: int) -> pd.DataFrame:
    année_n_moins_1 = datetime.now().year - 1
    année_de_départ = datetime.now().year - nombre_d_années
    return données_brutes[données_brutes["Année"].between(année_de_départ, année_n_moins_1)]


def filtre_les_données_sur_les_n_dernières_années_a_partir_annee_courante(données_brutes: pd.DataFrame, nombre_d_années: int) -> pd.DataFrame:
    année_n = datetime.now().year
    année_de_départ = datetime.now().year - nombre_d_années + 1
    return données_brutes[données_brutes["Année"].between(année_de_départ, année_n)]


def supprimer_donnees_existantes(table_name, engine, fournisseur, logger):
    try:
        with engine.begin() as conn:
            conn.execute(text(f"DELETE FROM {table_name};"))
        logger.info(f"[{fournisseur}]✅ Données supprimées avec succès de la table {table_name} !")
    except Exception as e:
        logger.info(f"[{fournisseur}]❌  Erreur lors de la suppression des données : {e}")


def inserer_nouvelles_donnees(table_name, engine, fournisseur, df, logger):
    try:
        # Vérifier si le DataFrame est vide après filtrage
        if df.empty:
            logger.info(f"[{fournisseur}]⚠️ Aucune donnée à insérer après filtrage.")
            return

        # Récupérer les colonnes de la table SQL
        with engine.begin() as conn:
            inspector = inspect(engine)
            table_columns = [col["name"] for col in inspector.get_columns(table_name)]

        # Filtrer les colonnes pour ne garder que celles qui existent dans la table
        df = df[[col for col in df.columns if col in table_columns]]

        # Insérer les nouvelles données
        df.to_sql(table_name, engine, if_exists='append', index=False, chunksize=1000, method='multi')
        logger.info(f"[{fournisseur}]✅ Données insérées avec succès dans la table {table_name} !")
    except Exception as e:
        logger.error(f"[{fournisseur}]❌ Erreur lors de l'insertion des données : {e}")

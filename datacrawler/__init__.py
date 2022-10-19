from datetime import datetime
from logging import Logger
from typing import List, Tuple

import pandas as pd
from sqlalchemy.engine import Connection

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

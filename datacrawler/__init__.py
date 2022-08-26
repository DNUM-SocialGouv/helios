from logging import Logger
from typing import List

import pandas as pd
from sqlalchemy.engine import Connection

from datacrawler.load.nom_des_tables import FichierSource
from datacrawler.load.sauvegarde import mets_à_jour_la_date_de_mise_à_jour_du_fichier_source, sauvegarde


def écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
    nom_de_la_donnée: str, connection: Connection, table: str, données: pd.DataFrame, date_de_mise_à_jour: str, fichier_source: FichierSource, logger: Logger
) -> None:
    connection.execute(f"DELETE FROM {table};")
    logger.info(f"[FINESS] Anciennes {nom_de_la_donnée} supprimées")
    sauvegarde(connection, table, données)
    mets_à_jour_la_date_de_mise_à_jour_du_fichier_source(connection, date_de_mise_à_jour, fichier_source)
    logger.info(f"[FINESS] {données.shape[0]} {nom_de_la_donnée} sauvegardées")

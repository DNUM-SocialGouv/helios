from logging import Logger
from typing import List, Tuple

import pandas as pd
from sqlalchemy.engine import Connection

from datacrawler.load.nom_des_tables import FichierSource
from datacrawler.load.sauvegarde import mets_à_jour_la_date_de_mise_à_jour_du_fichier_source, sauvegarde


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

from pandas import DataFrame
from sqlalchemy.engine import Connection

from datacrawler.load.nom_des_tables import TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES, FichierSource


def sauvegarde(base_de_données: Connection, table: str, données: DataFrame) -> None:
    données.to_sql(table, base_de_données, index=True, if_exists="append")


def mets_à_jour_la_date_de_mise_à_jour_du_fichier_source(base_de_données: Connection, date_de_mise_à_jour: str, fichier_source: FichierSource) -> None:
    base_de_données.execute(
        f"""INSERT INTO {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} (derniere_mise_a_jour, fichier)
            VALUES ('{date_de_mise_à_jour}', '{fichier_source.value}')
            ON CONFLICT (fichier) DO UPDATE
            SET derniere_mise_a_jour = '{date_de_mise_à_jour}';"""
    )

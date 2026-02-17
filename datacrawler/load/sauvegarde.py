from typing import Tuple

from pandas import DataFrame
from sqlalchemy.engine import Connection
from datacrawler.load.nom_des_tables import TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES, FichierSource


def sauvegarde(base_de_donnees: Connection, table: str, donnees: DataFrame) -> None:
    donnees.to_sql(table, base_de_donnees, index=True, if_exists="append")


def mets_a_jour_la_date_de_mise_a_jour_du_fichier_source(base_de_donnees: Connection, date_de_mise_a_jour: str, fichier_source: FichierSource) -> None:
    base_de_donnees.execute(
        f"""INSERT INTO {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} (derniere_mise_a_jour, fichier)
            VALUES ('{date_de_mise_a_jour}', '{fichier_source.value}')
            ON CONFLICT (fichier) DO UPDATE
            SET derniere_mise_a_jour = '{date_de_mise_a_jour}';"""
    )


def supprime(connection: Connection, table: str, cle_primaire: str, liste_cle: Tuple[str, ...]) -> None:
    if not liste_cle:
        return  # Skip if empty list

    placeholders = ",".join(["%s"] * len(liste_cle))
    sql = f"DELETE FROM {table} WHERE {cle_primaire} IN ({placeholders})"
    connection.execute(sql, liste_cle)


def mets_a_jour(base_de_donnees: Connection, table: str, cle_primaire: str, donnees: DataFrame) -> None:
    donnees = donnees.reset_index()
    db_columns = donnees.columns.astype(str).tolist()

    columns = ", ".join(db_columns)
    placeholders = ", ".join(["%s"] * len(db_columns))
    update_str = ", ".join([f"{col}=excluded.{col}" for col in db_columns if col != cle_primaire])

    sql = f"""INSERT INTO {table} ({columns})
            VALUES ({placeholders})
            ON CONFLICT ({cle_primaire}) DO UPDATE SET
            {update_str};"""

    donnees = donnees.fillna("")
    for _, row in donnees.iterrows():
        values = [row[col] for col in db_columns]
        base_de_donnees.execute(sql, values)

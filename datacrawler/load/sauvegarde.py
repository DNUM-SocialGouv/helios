from logging import Logger

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

def supprime(connection: Connection, table: str, cle_primaire: str, liste_cle) -> None:
    connection.execute(f"DELETE FROM {table} where {cle_primaire} IN ({liste_cle});")


def mets_a_jour(base_de_donnees: Connection, table: str, cle_primaire: str, donnees: DataFrame, column_mapping: dict ) -> None:
    # Colonnes dans le DataFrame et leurs équivalents en base
    df_columns = list(column_mapping.keys())
    db_columns = [column_mapping[col] for col in df_columns]
    cle_primaire_db = column_mapping[cle_primaire]

    columns = ", ".join(db_columns)
    placeholders = ", ".join(["?"] * len(db_columns))
    update_str = ", ".join([
        f"{col}=excluded.{col}" for df_col, col in zip(df_columns, db_columns) if df_col != cle_primaire
    ])

    sql = f"""INSERT INTO {table} ({columns})
            VALUES ('{placeholders}')
            ON CONFLICT ({cle_primaire_db}) DO UPDATE SET
            {update_str};"""

    for _, row in donnees.iterrows():
        values = [row[col] for col in df_columns]
        base_de_donnees.execute(sql, values)

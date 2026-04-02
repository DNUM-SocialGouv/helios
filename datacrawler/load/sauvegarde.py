from typing import Tuple

from pandas import DataFrame
from sqlalchemy import text
from sqlalchemy.engine import Connection
from datacrawler.load.nom_des_tables import TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES, FichierSource


def sauvegarde(base_de_donnees: Connection, table: str, donnees: DataFrame) -> None:
    donnees.to_sql(table, base_de_donnees, index=True, if_exists="append")


def mets_a_jour_la_date_de_mise_a_jour_du_fichier_source(base_de_donnees: Connection, date_de_mise_a_jour: str, fichier_source: FichierSource) -> None:
    base_de_donnees.execute(
        text(
            f"""INSERT INTO {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} (derniere_mise_a_jour, fichier)
            VALUES ('{date_de_mise_a_jour}', '{fichier_source.value}')
            ON CONFLICT (fichier) DO UPDATE
            SET derniere_mise_a_jour = '{date_de_mise_a_jour}';"""
        )
    )


def supprime(connection: Connection, table: str, cle_primaire: str, liste_cle: Tuple[str, ...]) -> None:
    if not liste_cle:
        return  # Skip if empty list

    placeholders = ", ".join([f":key{i}" for i in range(len(liste_cle))])
    sql = f"DELETE FROM {table} WHERE {cle_primaire} IN ({placeholders})"
    params = {f"key{i}": value for i, value in enumerate(liste_cle)}
    connection.execute(text(sql), params)


def mets_a_jour(base_de_donnees: Connection, table: str, cle_primaire: str, donnees: DataFrame) -> None:
    donnees = donnees.reset_index()
    db_columns = donnees.columns.astype(str).tolist()

    columns = ", ".join(db_columns)
    placeholders = ", ".join([f":{col}" for col in db_columns])
    update_str = ", ".join([f"{col}=excluded.{col}" for col in db_columns if col != cle_primaire])

    sql = f"""INSERT INTO {table} ({columns})
            VALUES ({placeholders})
            ON CONFLICT ({cle_primaire}) DO UPDATE SET
            {update_str};"""

    donnees = donnees.fillna("")
    for _, row in donnees.iterrows():
        values = {col: row[col] for col in db_columns}
        base_de_donnees.execute(text(sql), values)


def supprime_les_donnees_pour_l_annee(connection: Connection, table: str, annee: int) -> None:
    connection.execute(text(f"DELETE FROM {table} WHERE annee = :annee"), {"annee": annee})


def mets_a_jour_les_montants_engagements(
    connection: Connection,
    table: str,
    finess_col: str,
    donnees: DataFrame,
) -> None:
    if donnees.empty:
        return
    df = donnees.reset_index()
    for _, row in df.iterrows():
        connection.execute(
            text(
                f"""UPDATE {table}
                SET montant = :montant, mode_delegation = :mode_delegation
                WHERE {finess_col} = :finess
                  AND annee = :annee
                  AND enveloppe = :enveloppe
                  AND sous_enveloppe = :sous_enveloppe"""
            ),
            {
                "montant": row["montant"],
                "mode_delegation": row["mode_delegation"],
                "finess": row[finess_col],
                "annee": row["annee"],
                "enveloppe": row["enveloppe"],
                "sous_enveloppe": row["sous_enveloppe"],
            },
        )

import pandas as pd
from sqlalchemy.engine import Engine

from datacrawler.load.nom_des_tables import (
    TABLE_ACTIVITE_SANITAIRE_MENSUEL,
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES
)


def récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données: Engine, entite_juridique: bool = False) -> pd.DataFrame:
    entite_juridique_column = ", numero_finess_entite_juridique" if entite_juridique else ""
    return pd.read_sql_query(  # type: ignore
        f"SELECT numero_finess_etablissement_territorial {entite_juridique_column} FROM etablissement_territorial",
        base_de_données,
    )


def récupère_les_numéros_finess_des_entites_juridiques_de_la_base(base_de_données: Engine) -> pd.DataFrame:
    return pd.read_sql_query(  # type: ignore
        "SELECT numero_finess_entite_juridique FROM entite_juridique",
        base_de_données,
    )


def récupère_les_activités_sanitaires_de_la_base(base_de_données: Engine) -> pd.DataFrame:
    return pd.read_sql_table(
        TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
        base_de_données,
    )


def récupère_les_activités_sanitaires_mensuels_de_la_base(base_de_données: Engine) -> pd.DataFrame:
    return pd.read_sql_table(
        TABLE_ACTIVITE_SANITAIRE_MENSUEL,
        base_de_données,
    )


def récupère_les_capacités_sanitaires_de_la_base(base_de_données: Engine) -> pd.DataFrame:
    return pd.read_sql_table(
        TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
        base_de_données,
    )


def recupere_la_derniere_date_de_chargement_du_fichier(base_de_données: Engine, prefixe_fichier: str) -> pd.DataFrame:
    return pd.read_sql_query(
        "SELECT derniere_mise_a_jour FROM " + TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES + " where fichier = '" + prefixe_fichier +"'",
        base_de_données,
    )

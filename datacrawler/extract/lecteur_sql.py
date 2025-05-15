import pandas as pd
from sqlalchemy.engine import Engine

from datacrawler.load.nom_des_tables import (
    TABLE_ACTIVITE_SANITAIRE_MENSUEL,
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
)


def recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_donnees: Engine, entite_juridique: bool = False) -> pd.DataFrame:
    entite_juridique_column = ", numero_finess_entite_juridique" if entite_juridique else ""
    return pd.read_sql_query(  # type: ignore
        f"SELECT numero_finess_etablissement_territorial {entite_juridique_column} FROM etablissement_territorial",
        base_de_donnees,
    )


def recupere_les_numeros_finess_des_entites_juridiques_de_la_base(base_de_donnees: Engine) -> pd.DataFrame:
    return pd.read_sql_query(  # type: ignore
        "SELECT numero_finess_entite_juridique FROM entite_juridique",
        base_de_donnees,
    )

def recupere_le_ref_institution_region_de_la_base(base_de_donnees: Engine) -> pd.DataFrame:
    return pd.read_sql_query(  # type: ignore
        "SELECT ref_code_dep, ref_code_region FROM referentiel_departement_region",
        base_de_donnees,
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

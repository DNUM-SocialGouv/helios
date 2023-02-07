import pandas as pd
from sqlalchemy.engine import Engine

from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES


def récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données: Engine,
                                                              entite_juridique=False) -> pd.DataFrame:
    entite_juridique_column = ", numero_finess_entite_juridique" if entite_juridique else ""
    return pd.read_sql_query(  # type: ignore
        f"SELECT numero_finess_etablissement_territorial {entite_juridique_column} FROM etablissement_territorial",
        base_de_données,
    )


def récupère_les_activités_sanitaires_de_la_base(base_de_données: Engine) -> pd.DataFrame:
    return pd.read_sql_table(
        TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
        base_de_données,
    )

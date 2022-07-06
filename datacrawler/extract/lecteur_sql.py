import pandas as pd
from sqlalchemy.engine import Engine


def récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données: Engine) -> pd.DataFrame:
    return pd.read_sql_query(  # type: ignore
        "SELECT numero_finess_etablissement_territorial from etablissement_territorial",
        base_de_données,
        dtype={"numero_finess_etablissement_territorial": str},
    )

import pandas as pd
from sqlalchemy.engine import Engine


def récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données: Engine, entite_juridique=False) -> pd.DataFrame:
    entite_juridique_column = ", numero_finess_entite_juridique" if entite_juridique else ""
    return pd.read_sql_query(  # type: ignore
        f"SELECT numero_finess_etablissement_territorial {entite_juridique_column} FROM etablissement_territorial",
        base_de_données,
    )

import pandas as pd
from sqlalchemy.engine import Engine


def récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données: Engine) -> pd.DataFrame:
    return pd.read_sql_table("Établissementterritorialidentité", base_de_données, columns=["numérofinessÉtablissementterritorial"])

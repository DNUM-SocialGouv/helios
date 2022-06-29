import pandas as pd
from sqlalchemy.engine import Engine


def trouve_les_finess_des_établissements_en_base(base_de_données: Engine) -> pd.DataFrame:
    return pd.read_sql_table('Établissementterritorialidentité', base_de_données, columns=['numérofinessÉtablissementterritorial'])
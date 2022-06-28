from pandas import DataFrame
from sqlalchemy.engine import Engine

from datacrawler.load.activités_des_établissements_médico_sociaux import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX


def sauvegarde_les_activités_des_établissements_médico_sociales(base_de_données: Engine, données: DataFrame):
    données.to_sql(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données, index=True, if_exists="append")

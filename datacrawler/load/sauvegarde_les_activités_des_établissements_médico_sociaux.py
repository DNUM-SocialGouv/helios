from pandas import DataFrame
from sqlalchemy.engine import Engine, Connection

from datacrawler.load.activités_des_établissements_médico_sociaux import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX


def sauvegarde_les_activités_des_établissements_médico_sociaux(base_de_données: Engine | Connection, données: DataFrame):
    données.to_sql(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données, index=True, if_exists="append")

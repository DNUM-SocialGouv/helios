from pandas import DataFrame
from sqlalchemy.engine import Connection

from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX


def sauvegarde_les_activités_des_établissements_médico_sociaux(base_de_données: Connection, données: DataFrame) -> None:
    données.to_sql(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données, index=True, if_exists="append")

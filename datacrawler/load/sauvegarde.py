from pandas import DataFrame
from sqlalchemy.engine import Connection


def sauvegarde(base_de_données: Connection, table: str, données: DataFrame) -> None:
    données.to_sql(table, base_de_données, index=True, if_exists="append")

import pandas as pd
from sqlalchemy.engine import Engine

from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES
from datacrawler.transform.entite_juridique.bloc_activités.agrège_les_activités_dans_les_entites_juridiques import (
    agrège_les_activités_dans_les_entites_juridiques,
)


def agrège_les_activités_sanitaire_des_entités_juridiques(base_de_données: Engine):
    activités_sanitaires = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données, index_col="index")
    finess = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)
    activités_avec_entitie_juridique = pd.merge(activités_sanitaires, finess, on="numero_finess_etablissement_territorial")

    agrégation_activités = agrège_les_activités_dans_les_entites_juridiques(activités_avec_entitie_juridique)

    with base_de_données.begin() as connection:
        agrégation_activités.to_sql(TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES, connection, if_exists="replace")

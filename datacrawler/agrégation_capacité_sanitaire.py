from logging import Logger
import pandas as pd
from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base, récupère_les_capacités_sanitaires_de_la_base
from datacrawler.load.nom_des_tables import TABLES_DES_CAPACITÉS_DES_ENTITES_JURIDIQUES
from datacrawler.transform.entite_juridique.bloc_autorisations_capacités.agrège_les_capacités_dans_les_entites_juridiques import (
    agrège_les_capacités_dans_les_entites_juridiques,
)


def agrège_les_capacités_sanitaire_des_entités_juridiques(base_de_données: Engine, logger: Logger) -> None:
    capacités_sanitaire = récupère_les_capacités_sanitaires_de_la_base(base_de_données)
    finess = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données, entite_juridique=True)
    capacités_avec_entités_juridiques = pd.merge(capacités_sanitaire, finess, on="numero_finess_etablissement_territorial")

    agrégation_capacités = agrège_les_capacités_dans_les_entites_juridiques(capacités_avec_entités_juridiques)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            nom_de_la_donnée="agrégations des capacités sanitaire sur les entités juridiques",
            fournisseur="DIAMANT",
            connection=connection,
            table=TABLES_DES_CAPACITÉS_DES_ENTITES_JURIDIQUES,
            données=agrégation_capacités,
            logger=logger,
            fichiers_mis_à_jour=[],
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    agrège_les_capacités_sanitaire_des_entités_juridiques(base_de_données_helios, logger_helios)

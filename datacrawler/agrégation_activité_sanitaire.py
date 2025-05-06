from logging import Logger
import pandas as pd
from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base, récupère_les_activités_sanitaires_de_la_base
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES
from datacrawler.transform.entite_juridique.bloc_activités.agrège_les_activités_dans_les_entites_juridiques import (
    agrège_les_activités_dans_les_entites_juridiques,
)


def agrege_les_activites_sanitaire_des_entites_juridiques(base_de_donnees: Engine, logger: Logger) -> None:
    donnees = {
        'activites_sanitaires' : récupère_les_activités_sanitaires_de_la_base(base_de_donnees),
        'finess' : récupère_les_numéros_finess_des_établissements_de_la_base(base_de_donnees, entite_juridique=True)  
    }
    activites_avec_entites_juridiques = pd.merge(donnees['activites_sanitaires'], donnees['finess'], on="numero_finess_etablissement_territorial")

    agregation_activites = agrège_les_activités_dans_les_entites_juridiques(activites_avec_entites_juridiques)

    with base_de_donnees.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            nom_de_la_donnée="agrégations des activités sanitaire sur les entités juridiques",
            fournisseur="DIAMANT",
            connection=connection,
            table=TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES,
            données=agregation_activites,
            logger=logger,
            fichiers_mis_à_jour=[],
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    agrege_les_activites_sanitaire_des_entites_juridiques(base_de_donnees_helios, logger_helios)

from logging import Logger
from typing import List

from sqlalchemy.engine import Engine, create_engine
import pandas as pd

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.load.nom_des_tables import TABLE_QUALITE_HAS


def import_qualite_has(chemin_donnees_qualite_has: str, base_de_données: Engine, logger: Logger) -> None:
    valeurs_qualite_has = pd.read_csv(
    chemin_donnees_qualite_has,
    low_memory=False,
    )
    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_données)
    finess_not_in_has = numeros_finess_des_etablissements_connus[
    ~numeros_finess_des_etablissements_connus[
        "numero_finess_etablissement_territorial"
    ].isin(valeurs_qualite_has["finess"])
]
    index_qualite_has: List[str] = ["numero_finess_etablissement_territorial"]

    finess_not_in_has.set_index(index_qualite_has, inplace=True)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs qualité HAS",
            "HAS",
            connection,
            TABLE_QUALITE_HAS,
            finess_not_in_has,
            [],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    chemin_donnees_has = variables_d_environnement["HAS_DATA_PATH"]

    import_qualite_has(chemin_donnees_has, base_de_donnees_helios, logger_helios)

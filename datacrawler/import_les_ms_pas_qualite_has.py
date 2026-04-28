from logging import Logger
from typing import List

from sqlalchemy.engine import Engine, create_engine
import pandas as pd

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.load.nom_des_tables import TABLE_QUALITE_HAS_MS


def import_pas_qualite_has_ms(chemin_donnees_qualite_has: str, base_de_données: Engine, logger: Logger) -> None:
    no_data_has_ms = pd.read_parquet(
    chemin_donnees_qualite_has,
    columns=["finess_geo"])
    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_données)
    print(f"Nombre d'établissements territoriaux médico-sociaux connus : {len(numeros_finess_des_etablissements_connus)}")
    finess_not_in_has = numeros_finess_des_etablissements_connus[
    ~numeros_finess_des_etablissements_connus[
        "numero_finess_etablissement_territorial"
    ].isin(no_data_has_ms["finess_geo"])
]
    index_qualite_has: List[str] = ["numero_finess_etablissement_territorial"]

    finess_not_in_has.set_index(index_qualite_has, inplace=True)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs qualité HAS médico-social",
            "HAS",
            connection,
            TABLE_QUALITE_HAS_MS,
            finess_not_in_has,
            [],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    chemin_donnees_has = variables_d_environnement["MS_NO_HAS_DATA_PATH"]

    import_pas_qualite_has_ms(chemin_donnees_has, base_de_donnees_helios, logger_helios)

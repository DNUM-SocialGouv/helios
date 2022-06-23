import sys

import pandas as pd
from sqlalchemy import create_engine

from common import charge_un_fichier_xml, configure_logger


def construis_la_table_des_entités_juridiques(
    entités_juridiques_finess: pd.DataFrame,
) -> pd.DataFrame:
    return (
        entités_juridiques_finess[
            [
                "nofiness",
                "rs",
                "ligneacheminement",
                "numvoie",
                "typvoie",
                "voie",
                "libstatutjuridique",
                "telephone",
            ]
        ]
        .rename(
            columns={
                "nofiness": "numérofinessentitéjuridique",
                "rs": "raisonsociale",
                "ligneacheminement": "adresseacheminement",
                "numvoie": "adressenumérovoie",
                "typvoie": "adressetypevoie",
                "voie": "adressevoie",
                "libstatutjuridique": "libelléstatutjuridique",
                "telephone": "téléphone",
            }
        )
        .assign(
            telephone=lambda x: x["telephone"].str.replace('"', ""),
            numvoie=lambda x: x["numvoie"].str.replace('"', ""),
        )
        .dropna(subset=["numérofinessentitéjuridique"])
        .set_index("numérofinessentitéjuridique")
    )


def conserve_les_entités_juridiques_ouvertes(
    entités_juridiques: pd.DataFrame,
) -> pd.DataFrame:
    return entités_juridiques[entités_juridiques["datefermeture"].isna()]


def sauvegarde_les_entités_juridiques(entités_juridiques: pd.DataFrame):
    engine = create_engine("postgresql://helios:h3li0s@localhost:5433/helios")
    with engine.begin():
        engine.execute("DELETE FROM EntitéJuridique")
        entités_juridiques.to_sql(
            "EntitéJuridique", con=engine, if_exists="append", index=True
        )


def main():
    fichier = sys.argv[1]
    logger = configure_logger()
    entités_juridiques_finess = charge_un_fichier_xml(fichier, ".//structureej")
    logger.warn(entités_juridiques_finess.shape[0])

    entités_juridiques_ouvertes_finess = conserve_les_entités_juridiques_ouvertes(
        entités_juridiques_finess
    )
    logger.warn(entités_juridiques_ouvertes_finess.shape[0])

    entités_juridiques = construis_la_table_des_entités_juridiques(
        entités_juridiques_ouvertes_finess
    )
    logger.warn(entités_juridiques.shape[0])

    sauvegarde_les_entités_juridiques(entités_juridiques)


if __name__ == "__main__":
    main()

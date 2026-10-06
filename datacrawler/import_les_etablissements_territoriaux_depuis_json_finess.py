import os
from logging import Logger

import pandas as pd
from sqlalchemy.engine import Engine, create_engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_json_finess import (
    extrais_la_date_du_nom_de_fichier_finess_json,
    lis_les_etablissements_territoriaux_json_finess,
)
from datacrawler.extract.lecteur_sql import (
    recupere_le_referentiel_departement_region_de_la_base,
    recupere_les_numeros_finess_des_entites_juridiques_de_la_base,
    recupere_les_numeros_finess_des_etablissements_de_la_base,
)
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import (
    CLE_PRIMAIRE_TABLE_ETABLISSEMENTS_TERRITORIAUX,
    FichierSource,
    TABLE_ETABLISSEMENTS_TERRITORIAUX,
)
from datacrawler.load.sauvegarde import mets_a_jour, mets_a_jour_la_date_de_mise_a_jour_du_fichier_source, supprime
from datacrawler.transform.transform_les_etablissements_territoriaux.transform_les_etablissements_territoriaux import (
    extrais_les_etablissements_territoriaux_recemment_fermes,
)
from datacrawler.transform.transform_les_etablissements_territoriaux.transforme_le_json_des_etablissements_territoriaux import (
    transforme_le_json_des_etablissements_territoriaux,
)

REPERTOIRE_JSON_FINESS = "json"
PREFIXE_FICHIER_STRUCTURES_FINESS = "finess-structures-journalier"


def conserve_les_etablissements_territoriaux_ouverts_depuis_json(
    etablissements_territoriaux_flux_finess: pd.DataFrame,
    entites_juridiques_sauvegardees: pd.DataFrame,
) -> pd.DataFrame:
    return etablissements_territoriaux_flux_finess[
        (etablissements_territoriaux_flux_finess["datefermeture"].isna())
        & (etablissements_territoriaux_flux_finess["nofinessej"].isin(entites_juridiques_sauvegardees["numero_finess_entite_juridique"]))
    ]


def import_etablissements_territoriaux_depuis_json_finess(
    chemin_local_du_fichier_structures: str,
    base_de_donnees: Engine,
    logger: Logger,
) -> None:
    etablissements_territoriaux_flux_finess = lis_les_etablissements_territoriaux_json_finess(logger, chemin_local_du_fichier_structures)
    logger.info(f"[FINESS] {etablissements_territoriaux_flux_finess.shape[0]} établissements territoriaux récupérés depuis FINESS.")
    entites_juridiques_sauvegardees = recupere_les_numeros_finess_des_entites_juridiques_de_la_base(base_de_donnees)
    etablissements_territoriaux_ouverts = conserve_les_etablissements_territoriaux_ouverts_depuis_json(
        etablissements_territoriaux_flux_finess,
        entites_juridiques_sauvegardees,
    )
    logger.info(f"[FINESS] {etablissements_territoriaux_ouverts.shape[0]} établissements territoriaux sont ouverts.")
    etablissements_territoriaux_a_supprimer = extrais_les_etablissements_territoriaux_recemment_fermes(
        etablissements_territoriaux_ouverts,
        recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_donnees),
    )
    logger.info(f"[FINESS] {len(etablissements_territoriaux_a_supprimer)} établissements territoriaux sont fermés.")
    referentiel_departement_region = recupere_le_referentiel_departement_region_de_la_base(base_de_donnees)
    etablissements_territoriaux_transformes = transforme_le_json_des_etablissements_territoriaux(
        etablissements_territoriaux_ouverts,
        referentiel_departement_region,
    )
    date_du_fichier = extrais_la_date_du_nom_de_fichier_finess_json(chemin_local_du_fichier_structures)
    logger.info(f"[FINESS] Date de mise à jour du fichier FINESS structures : {date_du_fichier}")
    with base_de_donnees.begin() as connection:
        supprime(connection, TABLE_ETABLISSEMENTS_TERRITORIAUX, CLE_PRIMAIRE_TABLE_ETABLISSEMENTS_TERRITORIAUX, etablissements_territoriaux_a_supprimer)
        logger.info(f"Supprime {len(etablissements_territoriaux_a_supprimer)} établissements territoriaux.")
        mets_a_jour(connection, TABLE_ETABLISSEMENTS_TERRITORIAUX, CLE_PRIMAIRE_TABLE_ETABLISSEMENTS_TERRITORIAUX, etablissements_territoriaux_transformes)
        logger.info(f"Sauvegarde {etablissements_territoriaux_transformes.shape[0]} établissements territoriaux.")
        mets_a_jour_la_date_de_mise_a_jour_du_fichier_source(connection, date_du_fichier, FichierSource.FINESS_CS1400101)


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    repertoire_des_fichiers = os.path.join(
        variables_d_environnement["FINESS_SFTP_LOCAL_PATH"],
        "finess",
        REPERTOIRE_JSON_FINESS,
    )
    fichiers = os.listdir(repertoire_des_fichiers)
    chemin_structures_finess = os.path.join(
        repertoire_des_fichiers,
        trouve_le_nom_du_fichier(fichiers, PREFIXE_FICHIER_STRUCTURES_FINESS, logger_helios),
    )
    import_etablissements_territoriaux_depuis_json_finess(chemin_structures_finess, base_de_donnees_helios, logger_helios)

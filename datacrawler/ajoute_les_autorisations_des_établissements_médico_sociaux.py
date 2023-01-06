import os
from logging import Logger

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_finess
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.lecteur_xml import lis_le_fichier_xml
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, FichierSource
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_médico_sociaux import (
    transforme_les_autorisations_des_établissements_médico_sociaux,
)
from datacrawler.transform.équivalences_finess_helios import XPATH_FINESS_CS1400105, type_des_colonnes_finess_cs1400105


def ajoute_les_autorisations_des_établissements_médico_sociaux(chemin_du_fichier: str, base_de_données: Engine, logger: Logger) -> None:
    logger.info("[FINESS] Récupère les autorisations des établissements médico-sociaux")
    données_des_autorisations = lis_le_fichier_xml(
        chemin_du_fichier,
        XPATH_FINESS_CS1400105,
        type_des_colonnes_finess_cs1400105,
    )
    logger.info(f"[FINESS] {données_des_autorisations.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier}")
    date_du_fichier_des_autorisations = extrais_la_date_du_nom_de_fichier_finess(chemin_du_fichier)

    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    autorisations_des_établissements_médico_sociaux = transforme_les_autorisations_des_établissements_médico_sociaux(
        données_des_autorisations,
        numéros_finess_des_établissements_connus,
        logger,
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "autorisations médico-sociales",
            "FINESS",
            connection,
            TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
            autorisations_des_établissements_médico_sociaux,
            [(FichierSource.FINESS_CS1400105, date_du_fichier_des_autorisations)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    répertoire_des_fichiers = os.path.join(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"], "finess", "enrichi")
    fichiers = os.listdir(répertoire_des_fichiers)
    chemin_local_du_fichier_des_autorisations = os.path.join(répertoire_des_fichiers, trouve_le_nom_du_fichier(fichiers, "finess_cs1400105", logger_helios))
    logger_helios.info(f"[FINESS] Cherche les autorisations pour les ET médico-sociaux dans le fichier {chemin_local_du_fichier_des_autorisations}")
    ajoute_les_autorisations_des_établissements_médico_sociaux(chemin_local_du_fichier_des_autorisations, base_de_données_helios, logger_helios)

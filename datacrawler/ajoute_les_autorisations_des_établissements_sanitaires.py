import os
from logging import Logger
from typing import List

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract import FichierDeDonnées
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_finess
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.lecteur_xml import lis_le_fichier_xml
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import (
    TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
    FichierSource,
)
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires import transforme_les_autorisations_des_établissements_sanitaires
from datacrawler.transform.équivalences_finess_helios import (
    XPATH_FINESS_CS1400103,
    XPATH_FINESS_CS1400104,
    XPATH_FINESS_CS1600101,
    XPATH_FINESS_CS1600102,
    balises_à_échapper_finess_cs1400103,
    balises_à_échapper_finess_cs1400104,
    balises_à_échapper_finess_cs1600101,
    balises_à_échapper_finess_cs1600102,
)


def ajoute_les_autorisations_des_établissements_sanitaires(
    chemin_du_fichier_finess_cs1400103: str,
    chemin_du_fichier_finess_cs1400104: str,
    chemin_du_fichier_finess_cs1600101: str,
    chemin_du_fichier_finess_cs1600102: str,
    base_de_données: Engine,
    logger: Logger,
) -> None:
    logger.info("[FINESS] Récupère les autorisations des établissements sanitaires")
    données_des_autorisations = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_finess_cs1400103, XPATH_FINESS_CS1400103, balises_à_échapper_finess_cs1400103
    )
    logger.info(f"[FINESS] {données_des_autorisations.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_finess_cs1400103}.")

    logger.info("[FINESS] Récupère les équipements matériels lourds des établissements sanitaires")
    données_des_équipements_matériels_lourds = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_finess_cs1400104,
        XPATH_FINESS_CS1400104,
        balises_à_échapper_finess_cs1400104,
    )
    logger.info(f"[FINESS] {données_des_équipements_matériels_lourds.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_finess_cs1400104}.")

    logger.info("[FINESS] Récupère les autres activités des établissements sanitaires")
    données_des_autres_activités = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_finess_cs1600101,
        XPATH_FINESS_CS1600101,
        balises_à_échapper_finess_cs1600101,
    )
    logger.info(f"[FINESS] {données_des_autres_activités.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_finess_cs1600101}.")

    logger.info("[FINESS] Récupère les reconnaissances contractuelles des établissements sanitaires")
    données_des_reconnaissances_contractuelles = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_finess_cs1600102,
        XPATH_FINESS_CS1600102,
        balises_à_échapper_finess_cs1600102,
    )
    logger.info(f"[FINESS] {données_des_reconnaissances_contractuelles.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_finess_cs1600102}.")

    (
        autorisations_des_établissements_sanitaires,
        équipements_matériels_lourds_des_établissements_sanitaires,
        autres_activités_des_établissements_sanitaires,
        reconnaissances_contractuelles_des_établissements_sanitaires,
    ) = transforme_les_autorisations_des_établissements_sanitaires(
        données_des_autorisations.données,
        données_des_équipements_matériels_lourds.données,
        données_des_autres_activités.données,
        données_des_reconnaissances_contractuelles.données,
        récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données),
        logger,
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "autorisations sanitaires",
            "FINESS",
            connection,
            TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
            autorisations_des_établissements_sanitaires,
            [(FichierSource.FINESS_CS1400103, données_des_autorisations.dateDeMiseÀJour)],
            logger,
        )
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "équipements matériels lourds",
            "FINESS",
            connection,
            TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
            équipements_matériels_lourds_des_établissements_sanitaires,
            [(FichierSource.FINESS_CS1400104, données_des_équipements_matériels_lourds.dateDeMiseÀJour)],
            logger,
        )
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "autres activités sanitaires",
            "FINESS",
            connection,
            TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
            autres_activités_des_établissements_sanitaires,
            [(FichierSource.FINESS_CS1600101, données_des_autres_activités.dateDeMiseÀJour)],
            logger,
        )
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "reconnaissances contractuelles",
            "FINESS",
            connection,
            TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
            reconnaissances_contractuelles_des_établissements_sanitaires,
            [(FichierSource.FINESS_CS1600102, données_des_reconnaissances_contractuelles.dateDeMiseÀJour)],
            logger,
        )


def lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(chemin_du_fichier: str, xpath: str, balises_à_échapper: List[str]) -> FichierDeDonnées:
    données_des_autorisations = lis_le_fichier_xml(
        chemin_du_fichier,
        xpath,
        balises_à_échapper,
    )
    date_du_fichier_des_autorisations = extrais_la_date_du_nom_de_fichier_finess(chemin_du_fichier)
    return FichierDeDonnées(données_des_autorisations, date_du_fichier_des_autorisations)


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    répertoire_des_fichiers = os.path.join(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"], "finess", "enrichi")
    fichiers = os.listdir(répertoire_des_fichiers)
    chemin_local_du_fichier_des_autorisations = os.path.join(répertoire_des_fichiers, trouve_le_nom_du_fichier(fichiers, "finess_cs1400103", logger_helios))
    chemin_local_du_fichier_des_équipements_matériels_lourds = os.path.join(
        répertoire_des_fichiers, trouve_le_nom_du_fichier(fichiers, "finess_cs1400104", logger_helios)
    )
    chemin_local_du_fichier_des_autres_activités = os.path.join(répertoire_des_fichiers, trouve_le_nom_du_fichier(fichiers, "finess_cs1600101", logger_helios))
    chemin_local_du_fichier_des_reconnaissances_contractuelles = os.path.join(
        répertoire_des_fichiers, trouve_le_nom_du_fichier(fichiers, "finess_cs1600102", logger_helios)
    )
    logger_helios.info(
        "[FINESS] Cherche les autorisations pour les ET sanitaires dans les fichiers : %s, %s, %s, %s",
        chemin_local_du_fichier_des_autorisations,
        chemin_local_du_fichier_des_équipements_matériels_lourds,
        chemin_local_du_fichier_des_autres_activités,
        chemin_local_du_fichier_des_reconnaissances_contractuelles,
    )
    ajoute_les_autorisations_des_établissements_sanitaires(
        chemin_local_du_fichier_des_autorisations,
        chemin_local_du_fichier_des_équipements_matériels_lourds,
        chemin_local_du_fichier_des_autres_activités,
        chemin_local_du_fichier_des_reconnaissances_contractuelles,
        base_de_données_helios,
        logger_helios,
    )

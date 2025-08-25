import os
from logging import Logger
from typing import Dict

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract import FichierDeDonnées
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant, extrais_la_date_du_nom_de_fichier_finess
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.extract.lecteur_xml import lis_le_fichier_xml
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier, trouve_le_nom_du_fichier_diamant
from datacrawler.load.nom_des_tables import (
    TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
    TABLES_DES_AUTORISATIONS_AMM_DES_ETABLISSEMENTS_SANITAIRES,
    FichierSource,
)
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_capacités import (
    transforme_les_données_des_capacités,
)
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_données_des_autorisations import (
    transforme_les_données_des_autorisations,
    transforme_les_donnees_des_autorisations_amm
)
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_données_des_autres_activités import (
    transforme_les_données_des_autres_activités,
)
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_données_des_reconnaissances_contractuelles import (
    transforme_les_données_des_reconnaissances_contractuelles,
)
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_données_des_équipements_matériels_lourds import (
    transforme_les_données_des_équipements_matériels_lourds,
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_ann_sae,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_sae_helios,
)
from datacrawler.transform.équivalences_finess_helios import (
    XPATH_FINESS_CS1400103,
    XPATH_FINESS_CS1400104,
    XPATH_FINESS_CS1600101,
    XPATH_FINESS_CS1600102,
    XPATH_FINESS_AMM_ARHGOS,
    type_des_colonnes_finess_cs1400103,
    type_des_colonnes_finess_cs1400104,
    type_des_colonnes_finess_cs1600101,
    type_des_colonnes_finess_cs1600102,
    type_des_colonnes_amm_arhgos
)


def ajoute_les_autorisations_des_établissements_sanitaires(
    chemin_du_fichier_finess_cs1400103: str,
    chemin_du_fichier_finess_cs1400104: str,
    chemin_du_fichier_finess_cs1600101: str,
    chemin_du_fichier_finess_cs1600102: str,
    chemin_du_fichier_amm_arhgos: str,
    chemin_du_fichier_ann_sae: str,
    base_de_données: Engine,
    logger: Logger,
) -> None:
    numéros_finess_des_établissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_données)
    ajoute_les_autorisations(chemin_du_fichier_finess_cs1400103, numéros_finess_des_établissements_connus, base_de_données, logger)
    ajoute_les_équipements_matériels_lourds(chemin_du_fichier_finess_cs1400104, numéros_finess_des_établissements_connus, base_de_données, logger)
    ajoute_les_autres_activités(chemin_du_fichier_finess_cs1600101, numéros_finess_des_établissements_connus, base_de_données, logger)
    ajoute_les_reconnaissances_contractuelles(chemin_du_fichier_finess_cs1600102, numéros_finess_des_établissements_connus, base_de_données, logger)
    ajoute_les_capacités(chemin_du_fichier_ann_sae, numéros_finess_des_établissements_connus, base_de_données, logger)
    ajoute_les_autorisations_amm(chemin_du_fichier_amm_arhgos, numéros_finess_des_établissements_connus, base_de_données, logger)


def ajoute_les_autorisations(
    chemin_du_fichier_finess_cs1400103: str, numéros_finess_des_établissements_connus: pd.DataFrame, base_de_données: Engine, logger: Logger
) -> None:
    logger.info("[FINESS] Récupère les autorisations des établissements sanitaires")
    données_des_autorisations = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_finess_cs1400103, XPATH_FINESS_CS1400103, type_des_colonnes_finess_cs1400103
    )
    logger.info(f"[FINESS] {données_des_autorisations.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_finess_cs1400103}.")

    autorisations_des_établissements_sanitaires = transforme_les_données_des_autorisations(
        données_des_autorisations.données, numéros_finess_des_établissements_connus, logger
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


def ajoute_les_équipements_matériels_lourds(
    chemin_du_fichier_finess_cs1400104: str, numéros_finess_des_établissements_connus: pd.DataFrame, base_de_données: Engine, logger: Logger
) -> None:
    logger.info("[FINESS] Récupère les équipements matériels lourds des établissements sanitaires")
    données_des_équipements_matériels_lourds = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_finess_cs1400104,
        XPATH_FINESS_CS1400104,
        type_des_colonnes_finess_cs1400104,
    )
    logger.info(f"[FINESS] {données_des_équipements_matériels_lourds.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_finess_cs1400104}.")

    équipements_matériels_lourds_des_établissements_sanitaires = transforme_les_données_des_équipements_matériels_lourds(
        données_des_équipements_matériels_lourds.données, numéros_finess_des_établissements_connus, logger
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "équipements matériels lourds",
            "FINESS",
            connection,
            TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
            équipements_matériels_lourds_des_établissements_sanitaires,
            [(FichierSource.FINESS_CS1400104, données_des_équipements_matériels_lourds.dateDeMiseÀJour)],
            logger,
        )


def ajoute_les_autres_activités(
    chemin_du_fichier_finess_cs1600101: str, numéros_finess_des_établissements_connus: pd.DataFrame, base_de_données: Engine, logger: Logger
) -> None:
    logger.info("[FINESS] Récupère les autres activités des établissements sanitaires")
    données_des_autres_activités = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_finess_cs1600101,
        XPATH_FINESS_CS1600101,
        type_des_colonnes_finess_cs1600101,
    )
    logger.info(f"[FINESS] {données_des_autres_activités.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_finess_cs1600101}.")

    autres_activités_des_établissements_sanitaires = transforme_les_données_des_autres_activités(
        données_des_autres_activités.données, numéros_finess_des_établissements_connus, logger
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "autres activités sanitaires",
            "FINESS",
            connection,
            TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
            autres_activités_des_établissements_sanitaires,
            [(FichierSource.FINESS_CS1600101, données_des_autres_activités.dateDeMiseÀJour)],
            logger,
        )


def ajoute_les_reconnaissances_contractuelles(
    chemin_du_fichier_finess_cs1600102: str, numéros_finess_des_établissements_connus: pd.DataFrame, base_de_données: Engine, logger: Logger
) -> None:
    logger.info("[FINESS] Récupère les reconnaissances contractuelles des établissements sanitaires")
    données_des_reconnaissances_contractuelles = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_finess_cs1600102,
        XPATH_FINESS_CS1600102,
        type_des_colonnes_finess_cs1600102,
    )
    logger.info(f"[FINESS] {données_des_reconnaissances_contractuelles.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_finess_cs1600102}.")

    reconnaissances_contractuelles_des_établissements_sanitaires = transforme_les_données_des_reconnaissances_contractuelles(
        données_des_reconnaissances_contractuelles.données, numéros_finess_des_établissements_connus, logger
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "reconnaissances contractuelles",
            "FINESS",
            connection,
            TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
            reconnaissances_contractuelles_des_établissements_sanitaires,
            [(FichierSource.FINESS_CS1600102, données_des_reconnaissances_contractuelles.dateDeMiseÀJour)],
            logger,
        )


def ajoute_les_capacités(
    chemin_du_fichier_ann_sae: str, numéros_finess_des_établissements_connus: pd.DataFrame, base_de_données: Engine, logger: Logger
) -> None:
    logger.info("[DIAMANT] Récupère les capacités des établissements sanitaires")
    données_des_capacités = FichierDeDonnées(
        données=lis_le_fichier_csv(
            chemin_du_fichier_ann_sae,
            colonnes_à_lire_ann_sae,
            extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_sae_helios),
        ),
        dateDeMiseÀJour=extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_sae),
    )
    logger.info(f"[DIAMANT] {données_des_capacités.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_ann_sae}.")

    capacités_des_établissements_sanitaires = transforme_les_données_des_capacités(
        données_des_capacités.données, numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"].tolist(), logger
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "capacités",
            "DIAMANT",
            connection,
            TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
            capacités_des_établissements_sanitaires,
            [(FichierSource.DIAMANT_ANN_SAE, données_des_capacités.dateDeMiseÀJour)],
            logger,
        )
        
def ajoute_les_autorisations_amm(
    chemin_du_fichier_amm_arhgos: str, numéros_finess_des_établissements_connus: pd.DataFrame, base_de_données: Engine, logger: Logger
) -> None:
    logger.info("[FINESS] Récupère les autorisations des établissements sanitaires")
    donnees_des_autorisations = lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(
        chemin_du_fichier_amm_arhgos, XPATH_FINESS_AMM_ARHGOS, type_des_colonnes_amm_arhgos
    )
    logger.info(f"[FINESS] {donnees_des_autorisations.données.shape[0]} lignes trouvées dans le fichier {chemin_du_fichier_amm_arhgos}.")

    autorisations_amm_des_etablissements_sanitaires = transforme_les_donnees_des_autorisations_amm(
        donnees_des_autorisations.données, numéros_finess_des_établissements_connus, logger
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "autorisations amm sanitaires",
            "FINESS",
            connection,
            TABLES_DES_AUTORISATIONS_AMM_DES_ETABLISSEMENTS_SANITAIRES,
            autorisations_amm_des_etablissements_sanitaires,
            [(FichierSource.FINESS_AMM_ARGHOS, donnees_des_autorisations.dateDeMiseÀJour)],
            logger,
        )

def lis_le_fichier_xml_et_extrais_la_date_de_mise_à_jour(chemin_du_fichier: str, xpath: str, types_des_colonnes: Dict) -> FichierDeDonnées:
    données_des_autorisations = lis_le_fichier_xml(
        chemin_du_fichier,
        xpath,
        types_des_colonnes,
    )
    date_du_fichier_des_autorisations = extrais_la_date_du_nom_de_fichier_finess(chemin_du_fichier)
    return FichierDeDonnées(données_des_autorisations, date_du_fichier_des_autorisations)


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    répertoire_des_fichiers_finess = os.path.join(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"], "finess", "enrichi")
    répertoire_des_fichiers_diamant = os.path.join(variables_d_environnement["DIAMANT_DATA_PATH"])
    fichiers_finess = os.listdir(répertoire_des_fichiers_finess)
    chemin_local_du_fichier_des_autorisations = os.path.join(
        répertoire_des_fichiers_finess, trouve_le_nom_du_fichier(fichiers_finess, "finess_cs1400103", logger_helios)
    )
    chemin_local_du_fichier_des_équipements_matériels_lourds = os.path.join(
        répertoire_des_fichiers_finess, trouve_le_nom_du_fichier(fichiers_finess, "finess_cs1400104", logger_helios)
    )
    chemin_local_du_fichier_des_autres_activités = os.path.join(
        répertoire_des_fichiers_finess, trouve_le_nom_du_fichier(fichiers_finess, "finess_cs1600101", logger_helios)
    )
    chemin_local_du_fichier_des_reconnaissances_contractuelles = os.path.join(
        répertoire_des_fichiers_finess, trouve_le_nom_du_fichier(fichiers_finess, "finess_cs1600102", logger_helios)
    )
    chemin_local_du_fichier_des_autorisations_amm= os.path.join(
        répertoire_des_fichiers_finess, trouve_le_nom_du_fichier(fichiers_finess, "amm_arhgos", logger_helios)
    )
    fichiers_diamant = os.listdir(répertoire_des_fichiers_diamant)
    chemin_local_du_fichier_ann_sae = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers_diamant, "ANN_SAE", logger_helios)
    )
    logger_helios.info(
        "[FINESS] Cherche les autorisations pour les ET sanitaires dans les fichiers finess"
    )
    logger_helios.info(f"[DIAMANT] Cherche les capacités pour les ET sanitaires dans les fichiers : {chemin_local_du_fichier_ann_sae}")
    ajoute_les_autorisations_des_établissements_sanitaires(
        chemin_local_du_fichier_des_autorisations,
        chemin_local_du_fichier_des_équipements_matériels_lourds,
        chemin_local_du_fichier_des_autres_activités,
        chemin_local_du_fichier_des_reconnaissances_contractuelles,
        chemin_local_du_fichier_des_autorisations_amm,
        chemin_local_du_fichier_ann_sae,
        base_de_données_helios,
        logger_helios,
    )

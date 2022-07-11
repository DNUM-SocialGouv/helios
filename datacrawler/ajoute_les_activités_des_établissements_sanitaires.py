import os
from logging import Logger

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES
from datacrawler.load.sauvegarde import sauvegarde
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires import transforme_les_activités_des_établissements_sanitaires
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_men_pmsi_annuel,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_men_pmsi_annuel_helios,
)


def ajoute_les_activités_des_établissements_sanitaires(chemin_du_fichier_men_pmsi_annuel: str, base_de_données: Engine, logger: Logger) -> None:
    logger.info("Récupère les activités des établissements sanitaires")
    données_men_pmsi_annuel = lis_le_fichier_csv(
        chemin_du_fichier_men_pmsi_annuel,
        colonnes_à_lire_men_pmsi_annuel,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_pmsi_annuel_helios),
    )
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    activités_des_établissements_sanitaires = transforme_les_activités_des_établissements_sanitaires(
        données_men_pmsi_annuel, numéros_finess_des_établissements_connus, logger
    )

    with base_de_données.begin() as connection:
        connection.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES};")
        logger.info("Anciennes activités supprimées")
        sauvegarde(connection, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, activités_des_établissements_sanitaires)
    logger.info(f"{activités_des_établissements_sanitaires.shape[0]} activités sauvegardées")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DNUM_SFTP_LOCAL_PATH"])
    chemin_local_du_fichier_men_pmsi_annuel = os.path.join(
        variables_d_environnement["DNUM_SFTP_LOCAL_PATH"], trouve_le_nom_du_fichier(fichiers, "MEN_PMSI_ANNUEL", logger_helios)
    )
    logger_helios.info(f"Cherche les activités pour les ET sanitaires dans les fichiers {chemin_local_du_fichier_men_pmsi_annuel}")
    ajoute_les_activités_des_établissements_sanitaires(chemin_local_du_fichier_men_pmsi_annuel, base_de_données_helios, logger_helios)

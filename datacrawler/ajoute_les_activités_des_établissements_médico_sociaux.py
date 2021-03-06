import os
from logging import Logger

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.load.sauvegarde import sauvegarde
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import transforme_les_activités_des_établissements_médico_sociaux
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_ann_errd_ej_et,
    colonnes_à_lire_ann_ms_tdp_et,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_errd_ej_et_helios,
    équivalences_diamant_ann_ms_tdp_et_helios,
)


def ajoute_les_activités_des_établissements_médico_sociaux(
    chemin_du_fichier_ann_errd_ej_et: str, chemin_du_fichier_ann_ms_tdp_et: str, base_de_données: Engine, logger: Logger
) -> None:
    logger.info("Récupère les activités des établissements médico-sociaux")
    données_ann_errd_ej_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_errd_ej_et,
        colonnes_à_lire_ann_errd_ej_et,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_errd_ej_et_helios),
    )
    logger.info(f"{données_ann_errd_ej_et.shape[0]} lignes trouvées dans le fichier ANN_ERRD_EJ_ET")
    données_ann_ms_tdp_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_ms_tdp_et,
        colonnes_à_lire_ann_ms_tdp_et,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ms_tdp_et_helios),
    )
    logger.info(f"{données_ann_errd_ej_et.shape[0]} lignes trouvées dans le fichier ANN_MS_TDP_ET")

    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    activités_des_établissements_médico_sociaux = transforme_les_activités_des_établissements_médico_sociaux(
        données_ann_errd_ej_et, données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, logger
    )

    with base_de_données.begin() as connection:
        connection.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX};")
        logger.info("Anciennes activités supprimées")
        sauvegarde(connection, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, activités_des_établissements_médico_sociaux)
    logger.info(f"{activités_des_établissements_médico_sociaux.shape[0]} activités sauvegardées")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DNUM_SFTP_LOCAL_PATH"])
    chemin_local_du_fichier_ann_errd_ej_et = os.path.join(
        variables_d_environnement["DNUM_SFTP_LOCAL_PATH"], trouve_le_nom_du_fichier(fichiers, "ANN_ERRD_EJ_ET", logger_helios)
    )
    chemin_local_du_fichier_ann_ms_tdp_et = os.path.join(
        variables_d_environnement["DNUM_SFTP_LOCAL_PATH"], trouve_le_nom_du_fichier(fichiers, "ANN_MS_TDP_ET", logger_helios)
    )
    logger_helios.info(
        f"Cherche les activités pour les ET médico-sociaux dans les fichiers {chemin_local_du_fichier_ann_errd_ej_et}, {chemin_local_du_fichier_ann_ms_tdp_et}"
    )
    ajoute_les_activités_des_établissements_médico_sociaux(
        chemin_local_du_fichier_ann_errd_ej_et, chemin_local_du_fichier_ann_ms_tdp_et, base_de_données_helios, logger_helios
    )

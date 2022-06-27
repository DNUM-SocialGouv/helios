import os
from logging import Logger
from typing import Dict

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.load.activités_des_établissements_médico_sociaux import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.load.sauvegarde_les_activités_des_établissements_médico_sociaux import sauvegarde_les_activités_des_établissements_médico_sociaux
from datacrawler.transform.diamant.équivalences_diamant_helios import ColonneHelios, colonnes_à_lire_ann_errd_ej_et, équivalences_diamant_helios
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import transforme_les_activités_des_établissements_médico_sociaux


def extrais_l_equivalence_des_types_des_colonnes(équivalences: Dict[str, ColonneHelios]) -> Dict[str, type]:
    return {nom_diamant: colonne_diamant["type"] for nom_diamant, colonne_diamant in équivalences.items()}


def ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier: str, base_de_données: Engine, logger: Logger):
    logger.info("Récupère les activités des établissements médico-sociaux")
    données_ann_errd_ej_et = lis_le_fichier_csv(
        chemin_du_fichier, colonnes_à_lire_ann_errd_ej_et, extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_helios)
    )
    logger.info(f"{données_ann_errd_ej_et.shape[0]} lignes trouvées dans le fichier ANN_ERRD_EJ_ET")

    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    activités_des_établissements_médico_sociaux = transforme_les_activités_des_établissements_médico_sociaux(
        données_ann_errd_ej_et, numéros_finess_des_établissements_connus, logger
    )

    with base_de_données.begin() as connection:
        connection.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX};")
        logger.info("Anciennes activités supprimées")
        sauvegarde_les_activités_des_établissements_médico_sociaux(connection, activités_des_établissements_médico_sociaux)
    logger.info(f"{activités_des_établissements_médico_sociaux.shape[0]} activités sauvegardées")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichier_ann_errd_ej_et = [
        nom_de_fichier for nom_de_fichier in os.listdir(variables_d_environnement["DNUM_SFTP_LOCAL_PATH"]) if "ANN_ERRD_EJ_ET" in nom_de_fichier
    ][0]
    chemin_du_fichier_ann_errd_ej_et = os.path.join(variables_d_environnement["DNUM_SFTP_LOCAL_PATH"], fichier_ann_errd_ej_et)
    logger_helios.info(f"Cherche les activités pour les ET médico-sociaux dans le fichier {chemin_du_fichier_ann_errd_ej_et}")
    ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier_ann_errd_ej_et, base_de_données_helios, logger_helios)

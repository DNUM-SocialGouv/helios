import os
from logging import Logger

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import (
    colonnes_à_lire_men_pmsi_annuel,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_men_pmsi_annuel_helios,
)


def ajoute_les_activités_des_établissements_sanitaires(chemin_du_fichier_men_pmsi_annuel: str, base_de_données: Engine, logger: Logger) -> None:
    logger.info("Récupère les activités des établissements médico-sociaux")
    données_ann_errd_ej_et = lis_le_fichier_csv(
        chemin_du_fichier_men_pmsi_annuel,
        colonnes_à_lire_men_pmsi_annuel,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_pmsi_annuel_helios),
    )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DNUM_SFTP_LOCAL_PATH"])
    chemin_du_fichier_ann_errd_ej_et = os.path.join(
        variables_d_environnement["DNUM_SFTP_LOCAL_PATH"], trouve_le_nom_du_fichier(fichiers, "ANN_ERRD_EJ_ET", logger_helios)
    )
    chemin_du_fichier_ann_ms_tdp_et = os.path.join(
        variables_d_environnement["DNUM_SFTP_LOCAL_PATH"], trouve_le_nom_du_fichier(fichiers, "ANN_MS_TDP_ET", logger_helios)
    )
    logger_helios.info(
        f"Cherche les activités pour les ET médico-sociaux dans les fichiers {chemin_du_fichier_ann_errd_ej_et}, {chemin_du_fichier_ann_ms_tdp_et}"
    )
    ajoute_les_activités_des_établissements_sanitaires(chemin_du_fichier_ann_errd_ej_et, chemin_du_fichier_ann_ms_tdp_et, base_de_données_helios, logger_helios)

import os
from logging import Logger

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLES_DES_CPOM, FichierSource
from datacrawler.transform.transforme_les_dates_d_entree_en_vigueur_des_cpom.transforme_les_dates_d_entree_en_vigueur_des_cpom import (
    transforme_les_dates_d_entrée_en_vigueur_des_cpom,
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_ann_ms_tdp_et_cpom,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_ms_tdp_et_cpom_helios,
)


def ajoute_le_cpom_des_établissements_médico_sociaux(
    chemin_du_fichier_ann_ms_tdp_et: str,
    base_de_données: Engine,
    logger: Logger,
) -> None:
    logger.info("[DIAMANT] Récupère les dates d'entrée en vigueur du CPOM des établissements médico-sociaux")
    données_ann_ms_tdp_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_ms_tdp_et,
        colonnes_à_lire_ann_ms_tdp_et_cpom,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ms_tdp_et_cpom_helios),
    )
    logger.info(f"[DIAMANT] {données_ann_ms_tdp_et.shape[0]} lignes trouvées dans le fichier ANN_MS_TDP_ET")
    date_du_fichier_ann_ms_tdp_et = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_ms_tdp_et)

    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    dates_d_entrée_en_vigueur_du_cpom_des_établissements_médico_sociaux = transforme_les_dates_d_entrée_en_vigueur_des_cpom(
        données_ann_ms_tdp_et,
        numéros_finess_des_établissements_connus,
        logger,
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "dates d'entrée en vigueur du CPOM",
            "DIAMANT",
            connection,
            TABLES_DES_CPOM,
            dates_d_entrée_en_vigueur_du_cpom_des_établissements_médico_sociaux,
            [(FichierSource.DIAMANT_ANN_MS_TDP_ET, date_du_fichier_ann_ms_tdp_et)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DNUM_SFTP_LOCAL_PATH"])
    chemin_local_du_fichier_ann_ms_tdp_et = os.path.join(
        variables_d_environnement["DNUM_SFTP_LOCAL_PATH"], trouve_le_nom_du_fichier(fichiers, "ANN_MS_TDP_ET", logger_helios)
    )
    logger_helios.info(
        f"""[DIAMANT] Cherche les dates d'entrée en vigueur du CPOM pour les ET médico sociaux dans le fichier
    {chemin_local_du_fichier_ann_ms_tdp_et}"""
    )
    ajoute_le_cpom_des_établissements_médico_sociaux(chemin_local_du_fichier_ann_ms_tdp_et, base_de_données_helios, logger_helios)

import os
from datetime import datetime
from logging import Logger

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_diamant
from datacrawler.load.nom_des_tables import TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL, FichierSource
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_données_budgétaires_et_financières import (
    transforme_les_données_budgétaires_et_financières,
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_bloc_budget_et_finances_ann_ca_ej_et,
    colonnes_à_lire_bloc_budget_et_finances_ann_errd_ej,
    colonnes_à_lire_bloc_budget_et_finances_ann_errd_ej_et,
    colonnes_à_lire_bloc_budget_et_finances_per_errd_eprd,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_ca_ej_et_bloc_budget_et_finances_helios,
    équivalences_diamant_ann_errd_ej_bloc_budget_et_finances_helios,
    équivalences_diamant_ann_errd_ej_et_bloc_budget_et_finances_helios,
    équivalences_diamant_per_errd_eprd_bloc_budget_et_finances_helios,
)


def filtre_sur_les_trois_dernières_années(données_brutes: pd.DataFrame) -> pd.DataFrame:
    année_n_moins_1 = datetime.now().year - 1
    année_n_moins_3 = datetime.now().year - 3
    return données_brutes[données_brutes["Année"].between(année_n_moins_3, année_n_moins_1)]


def ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
    chemin_du_fichier_ann_ca_ej_et: str,
    chemin_du_fichier_ann_errd_ej_et: str,
    chemin_du_fichier_ann_errd_ej: str,
    chemin_du_fichier_per_errd_eprd: str,
    base_de_données: Engine,
    logger: Logger,
) -> None:
    logger.info("[DIAMANT] Récupère les indicateurs budget et finances des établissements médico-sociaux sous cadre ERRD")
    données_ann_errd_ej_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_errd_ej_et,
        colonnes_à_lire_bloc_budget_et_finances_ann_errd_ej_et,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_errd_ej_et_bloc_budget_et_finances_helios),
    )
    logger.info(f"[DIAMANT] {données_ann_errd_ej_et.shape[0]} lignes trouvées dans le fichier ANN_ERRD_EJ_ET")
    date_du_fichier_ann_errd_ej_et = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_errd_ej_et)

    données_per_errd_eprd = lis_le_fichier_csv(
        chemin_du_fichier_per_errd_eprd,
        colonnes_à_lire_bloc_budget_et_finances_per_errd_eprd,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_per_errd_eprd_bloc_budget_et_finances_helios),
    )
    logger.info(f"[DIAMANT] {données_per_errd_eprd.shape[0]} lignes trouvées dans le fichier ANN_PER_ERRD_EPRD")

    données_ann_errd_ej = lis_le_fichier_csv(
        chemin_du_fichier_ann_errd_ej,
        colonnes_à_lire_bloc_budget_et_finances_ann_errd_ej,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_errd_ej_bloc_budget_et_finances_helios),
    )
    logger.info(f"[DIAMANT] {données_ann_errd_ej.shape[0]} lignes trouvées dans le fichier ANN_ERRD_EJ")
    date_du_fichier_ann_errd_ej = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_errd_ej)

    logger.info("[DIAMANT] Récupère les indicateurs budget et finances des établissements médico-sociaux sous cadre CA")
    données_ann_ca_ej_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_ca_ej_et,
        colonnes_à_lire_bloc_budget_et_finances_ann_ca_ej_et,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ca_ej_et_bloc_budget_et_finances_helios),
    )
    logger.info(f"[DIAMANT] {données_ann_ca_ej_et.shape[0]} lignes trouvées dans le fichier ANN_CA_EJ_ET")
    date_du_fichier_ann_ca_ej_et = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_ca_ej_et)

    budget_et_finances_des_établissements_médico_sociaux = transforme_les_données_budgétaires_et_financières(
        filtre_sur_les_trois_dernières_années(données_ann_ca_ej_et),
        filtre_sur_les_trois_dernières_années(données_ann_errd_ej_et),
        filtre_sur_les_trois_dernières_années(données_ann_errd_ej),
        filtre_sur_les_trois_dernières_années(données_per_errd_eprd),
        récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données),
        logger,
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs budget et finances des établissements médico-sociaux",
            "DIAMANT",
            connection,
            TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
            budget_et_finances_des_établissements_médico_sociaux,
            [
                (FichierSource.DIAMANT_ANN_ERRD_EJ_ET, date_du_fichier_ann_errd_ej_et),
                (FichierSource.DIAMANT_ANN_CA_EJ_ET, date_du_fichier_ann_ca_ej_et),
                (FichierSource.DIAMANT_ANN_ERRD_EJ, date_du_fichier_ann_errd_ej),
            ],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DIAMANT_DATA_PATH"])
    chemin_local_du_fichier_ann_ca_ej_et = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_CA_EJ_ET", logger_helios)
    )
    chemin_local_du_fichier_ann_errd_ej_et = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_ERRD_EJ_ET", logger_helios)
    )
    chemin_local_du_fichier_ann_errd_ej = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_ERRD_EJ", logger_helios)
    )
    chemin_local_du_fichier_ann_per_errd_eprd = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_PER_ERRD_EPRD", logger_helios)
    )
    logger_helios.info(
        f"""[DIAMANT] Cherche les indicateurs budget et finances pour les ET médico sociaux dans les fichiers
    {chemin_local_du_fichier_ann_errd_ej_et}, {chemin_local_du_fichier_ann_ca_ej_et}"""
    )
    ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
        chemin_local_du_fichier_ann_ca_ej_et,
        chemin_local_du_fichier_ann_errd_ej_et,
        chemin_local_du_fichier_ann_errd_ej,
        chemin_local_du_fichier_ann_per_errd_eprd,
        base_de_données_helios,
        logger_helios,
    )

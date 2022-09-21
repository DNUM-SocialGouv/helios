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
from datacrawler.load.nom_des_tables import TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL, FichierSource
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux \
    .transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux import (
        transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux,
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_bloc_budget_et_finances_ann_errd_ej_et,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_errd_ej_et_bloc_budget_et_finances_helios,
)


def ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(chemin_du_fichier_ann_errd_ej_et: str, base_de_données: Engine, logger: Logger) -> None:
    logger.info("[DIAMANT] Récupère les indicateurs budget et finances des établissements médico-sociaux")
    données_ann_errd_ej_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_errd_ej_et,
        colonnes_à_lire_bloc_budget_et_finances_ann_errd_ej_et,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_errd_ej_et_bloc_budget_et_finances_helios),
    )
    logger.info(f"[DIAMANT] {données_ann_errd_ej_et.shape[0]} lignes trouvées dans le fichier ANN_ERRD_EJ_ET")
    date_du_fichier_ann_errd_ej_et = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_errd_ej_et)

    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    budget_et_finances_des_établissements_médico_sociaux = transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
        données_ann_errd_ej_et,
        numéros_finess_des_établissements_connus,
        logger,
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs budget et finances des établissements médico-sociaux",
            "DIAMANT",
            connection,
            TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
            budget_et_finances_des_établissements_médico_sociaux,
            [(FichierSource.DIAMANT_ANN_ERRD_EJ_ET, date_du_fichier_ann_errd_ej_et)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DNUM_SFTP_LOCAL_PATH"])
    chemin_local_du_fichier_ann_errd_ej_et = os.path.join(
        variables_d_environnement["DNUM_SFTP_LOCAL_PATH"], trouve_le_nom_du_fichier(fichiers, "ANN_ERRD_EJ_ET", logger_helios)
    )
    logger_helios.info(
        f"""[DIAMANT] Cherche les indicateurs budget et finances pour les ET médico sociaux dans le fichier
    {chemin_local_du_fichier_ann_errd_ej_et}"""
    )
    ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(chemin_local_du_fichier_ann_errd_ej_et, base_de_données_helios, logger_helios)

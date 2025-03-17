import os
from logging import Logger

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler import (
    NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_MÉDICO_SOCIALES,
    filtre_les_données_sur_les_n_dernières_années,
    écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour,
)
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_diamant
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, FichierSource
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import transforme_les_activites_des_etablissements_medico_sociaux
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_ann_ms_tdp_et,
    colonnes_a_lire_bloc_activites_ann_ca_ej_et,
    colonnes_à_lire_bloc_activités_ann_errd_ej_et,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_errd_ej_et_bloc_activités_helios,
    équivalences_diamant_ann_ms_tdp_et_helios,
    equivalences_diamant_ann_ca_ej_et_bloc_activites_helios
)


def ajoute_les_activites_des_etablissements_medico_sociaux(
    chemin_du_fichier_ann_errd_ej_et: str, chemin_du_fichier_ann_ca_ej_et: str, chemin_du_fichier_ann_ms_tdp_et: str, base_de_donnees: Engine, logger: Logger
) -> None:
    logger.info("[DIAMANT] Récupère les activités des établissements médico-sociaux")
    donnees_ann_errd_ej_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_errd_ej_et,
        colonnes_à_lire_bloc_activités_ann_errd_ej_et,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_errd_ej_et_bloc_activités_helios),
    )
    logger.info(f"[DIAMANT] {donnees_ann_errd_ej_et.shape[0]} lignes trouvées dans le fichier ANN_ERRD_EJ_ET")
    donnees_ann_errd_ej_et_filtrees = filtre_les_données_sur_les_n_dernières_années(
        donnees_ann_errd_ej_et, NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_MÉDICO_SOCIALES
    )
    date_du_fichier_ann_errd_ej_et = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_errd_ej_et)

    donnees_ann_ca_ej_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_ca_ej_et,
        colonnes_a_lire_bloc_activites_ann_ca_ej_et,
        extrais_l_equivalence_des_types_des_colonnes(equivalences_diamant_ann_ca_ej_et_bloc_activites_helios),
    )
    logger.info(f"[DIAMANT] {donnees_ann_ca_ej_et.shape[0]} lignes trouvées dans le fichier ANN_CA_EJ_ET")
    donnees_ann_ca_ej_et_filtrees = filtre_les_données_sur_les_n_dernières_années(
        donnees_ann_ca_ej_et, NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_MÉDICO_SOCIALES
    )
    date_du_fichier_ann_ca_ej_et = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_ca_ej_et)
    donnees_ann_ms_tdp_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_ms_tdp_et,
        colonnes_à_lire_ann_ms_tdp_et,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ms_tdp_et_helios),
    )
    logger.info(f"[DIAMANT] {donnees_ann_ms_tdp_et.shape[0]} lignes trouvées dans le fichier ANN_MS_TDP_ET")
    donnees_ann_ms_tdp_et_filtrees = filtre_les_données_sur_les_n_dernières_années(
        donnees_ann_ms_tdp_et, NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_MÉDICO_SOCIALES
    )
    date_du_fichier_ann_ms_tdp_et = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_ms_tdp_et)

    numeros_finess_des_etablissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_donnees)

    activites_des_etablissements_medico_sociaux = transforme_les_activites_des_etablissements_medico_sociaux(
        donnees_ann_errd_ej_et_filtrees,
        donnees_ann_ca_ej_et_filtrees,
        donnees_ann_ms_tdp_et_filtrees,
        numeros_finess_des_etablissements_connus,
        logger,
    )

    with base_de_donnees.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "activités médico-sociales",
            "DIAMANT",
            connection,
            TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
            activites_des_etablissements_medico_sociaux,
            [(FichierSource.DIAMANT_ANN_ERRD_EJ_ET, date_du_fichier_ann_errd_ej_et),
             (FichierSource.DIAMANT_ANN_CA_EJ_ET, date_du_fichier_ann_ca_ej_et),
             (FichierSource.DIAMANT_ANN_MS_TDP_ET, date_du_fichier_ann_ms_tdp_et)
            ],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DIAMANT_DATA_PATH"])
    chemin_local_du_fichier_ann_errd_ej_et = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_ERRD_EJ_ET", logger_helios)
    )
    chemin_local_du_fichier_ann_ca_ej_et = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_CA_EJ_ET", logger_helios)
    )
    chemin_local_du_fichier_ann_ms_tdp_et = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_MS_TDP_ET", logger_helios)
    )
    logger_helios.info(
        f"""[DIAMANT] Cherche les activités pour les ET médico-sociaux dans les fichiers
        {chemin_local_du_fichier_ann_errd_ej_et}, {chemin_local_du_fichier_ann_ca_ej_et}, {chemin_local_du_fichier_ann_ms_tdp_et}"""
    )
    ajoute_les_activites_des_etablissements_medico_sociaux(
        chemin_local_du_fichier_ann_errd_ej_et,
        chemin_local_du_fichier_ann_ca_ej_et,
        chemin_local_du_fichier_ann_ms_tdp_et,
        base_de_donnees_helios, logger_helios
    )

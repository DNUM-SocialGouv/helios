import os
from logging import Logger

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler import (
    NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_SANITAIRES,
    filtre_les_données_sur_les_n_dernières_années,
    écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour,
)
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_diamant
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, FichierSource
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires import transforme_les_activites_des_etablissements_sanitaires
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_ann_rpu,
    colonnes_à_lire_men_pmsi_annuel,
    colonnes_à_lire_ann_sae_activite,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_rpu_helios,
    équivalences_diamant_men_pmsi_annuel_helios,
    equivalences_diamant_ann_sae_activite_helios
)


def ajoute_les_activites_des_etablissements_sanitaires(
    chemin_du_fichier_men_pmsi_annuel: str, chemin_du_fichier_ann_rpu: str, chemin_du_fichier_ann_sae: str, base_de_donnees: Engine, logger: Logger
) -> None:
    logger.info("[DIAMANT] Récupère les activités des établissements sanitaires")
    donnees_men_pmsi_annuel = lis_le_fichier_csv(
        chemin_du_fichier_men_pmsi_annuel,
        colonnes_à_lire_men_pmsi_annuel,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_pmsi_annuel_helios),
    )
    logger.info(f"[DIAMANT] {donnees_men_pmsi_annuel.shape[0]} lignes trouvées dans le fichier MEN_PMSI_ANNUEL")
    donnees_men_pmsi_annuel_filtre_sur_les_5_dernieres_annees = filtre_les_données_sur_les_n_dernières_années(
        donnees_men_pmsi_annuel, NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_SANITAIRES
    )

    donnees_ann_rpu = lis_le_fichier_csv(
        chemin_du_fichier_ann_rpu,
        colonnes_à_lire_ann_rpu,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_rpu_helios),
    )
    logger.info(f"[DIAMANT] {donnees_ann_rpu.shape[0]} lignes trouvées dans le fichier ANN_RPU")
    donnees_ann_rpu_filtre_sur_les_5_dernieres_annees = filtre_les_données_sur_les_n_dernières_années(
        donnees_ann_rpu, NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_SANITAIRES
    )
    donnees_ann_sae_activite = lis_le_fichier_csv(
        chemin_du_fichier_ann_sae,
        colonnes_à_lire_ann_sae_activite,
        extrais_l_equivalence_des_types_des_colonnes(equivalences_diamant_ann_sae_activite_helios),
    )
    logger.info(f"[DIAMANT] {donnees_ann_sae_activite.shape[0]} lignes trouvées dans le fichier ANN_SAE")
    donnees_ann_sae_activite_filtre_sur_les_5_dernieres_annees = filtre_les_données_sur_les_n_dernières_années(
        donnees_ann_sae_activite, NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_SANITAIRES
    )
    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_donnees)

    activites_des_etablissements_sanitaires = transforme_les_activites_des_etablissements_sanitaires(
        donnees_men_pmsi_annuel_filtre_sur_les_5_dernieres_annees,
        donnees_ann_rpu_filtre_sur_les_5_dernieres_annees,
        donnees_ann_sae_activite_filtre_sur_les_5_dernieres_annees,
        numeros_finess_des_etablissements_connus,
        logger,
    )
    dates_mise_a_jour_fichiers = {
        'date_du_fichier_ann_sae' : extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_sae),
        'date_du_fichier_ann_rpu' : extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_rpu),
        'date_du_fichier_men_pmsi_annuel' : extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_men_pmsi_annuel)
    }

    with base_de_donnees.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "activités sanitaires",
            "DIAMANT",
            connection,
            TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
            activites_des_etablissements_sanitaires,
            [(FichierSource.DIAMANT_MEN_PMSI_ANNUEL, dates_mise_a_jour_fichiers['date_du_fichier_men_pmsi_annuel']),
             (FichierSource.DIAMANT_ANN_RPU, dates_mise_a_jour_fichiers['date_du_fichier_ann_rpu']),
             (FichierSource.DIAMANT_ANN_SAE, dates_mise_a_jour_fichiers['date_du_fichier_ann_sae'])
             ],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DIAMANT_DATA_PATH"])
    chemin_local_du_fichier_men_pmsi_annuel = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "MEN_PMSI_ANNUEL", logger_helios)
    )
    chemin_local_du_fichier_ann_rpu = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_RPU", logger_helios)
    )
    chemin_local_du_fichier_ann_sae = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_SAE", logger_helios)
    )
    logger_helios.info(f"[DIAMANT] Cherche les activités pour les ET sanitaires dans les fichiers {chemin_local_du_fichier_men_pmsi_annuel}")
    ajoute_les_activites_des_etablissements_sanitaires(
        chemin_local_du_fichier_men_pmsi_annuel,
        chemin_local_du_fichier_ann_rpu,
        chemin_local_du_fichier_ann_sae,
        base_de_donnees_helios,
        logger_helios
    )

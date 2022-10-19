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
from datacrawler.load.nom_des_tables import TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL, FichierSource
from datacrawler.transform.transforme_le_bloc_ressources_humaines_des_établissements_médico_sociaux.transforme_les_données_des_ressources_humaines import (
    transforme_les_données_des_ressources_humaines,
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_bloc_ressources_humaines_ann_ms_tdp_et,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios,
)


def ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux(
    chemin_du_fichier_ann_ms_tdp_et: str,
    base_de_données: Engine,
    logger: Logger,
) -> None:
    logger.info("[DIAMANT] Récupère les données ressources humaines des établissements médico-sociaux")
    données_ann_ms_tdp_et = lis_le_fichier_csv(
        chemin_du_fichier_ann_ms_tdp_et,
        colonnes_à_lire_bloc_ressources_humaines_ann_ms_tdp_et,
        extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios),
    )
    logger.info(f"[DIAMANT] {données_ann_ms_tdp_et.shape[0]} lignes trouvées dans le fichier ANN_MS_TDP_ET")
    date_du_fichier_ann_ms_tdp_et = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_ann_ms_tdp_et)

    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    taux_d_absenteismes_des_établissements_médico_sociaux = transforme_les_données_des_ressources_humaines(
        filtre_les_données_sur_les_n_dernières_années(données_ann_ms_tdp_et, NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_MÉDICO_SOCIALES),
        numéros_finess_des_établissements_connus,
        logger,
    )

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "données du bloc ressources humaines",
            "DIAMANT",
            connection,
            TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL,
            taux_d_absenteismes_des_établissements_médico_sociaux,
            [(FichierSource.DIAMANT_ANN_MS_TDP_ET, date_du_fichier_ann_ms_tdp_et)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    fichiers = os.listdir(variables_d_environnement["DIAMANT_DATA_PATH"])
    chemin_local_du_fichier_ann_ms_tdp_et = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "ANN_MS_TDP_ET", logger_helios)
    )
    logger_helios.info(
        f"""[DIAMANT] Cherche les données des ressources humaines pour les ET médico sociaux dans le fichier {chemin_local_du_fichier_ann_ms_tdp_et}"""
    )
    ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux(chemin_local_du_fichier_ann_ms_tdp_et, base_de_données_helios, logger_helios)

import os
from logging import Logger
from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.load.nom_des_tables import TABLE_REF_CATEGORIES
from datacrawler.extract.lecteur_xml import lis_le_fichier_xml_en_stream
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.transform.équivalences_finess_helios import (
    XML_TAG_FINESS_CS1500106,
    type_des_colonnes_categories_finess,
    colonnes_a_garder_categories_finess,
    )
from datacrawler.transform.transforme_les_categories.transforme_les_categories import transforme_les_categories


def import_ref_categories(chemin_du_fichier: str, base_de_donnees: Engine, logger: Logger) -> None:
    logger.info("[FINESS] Récupère les catégories finess")
    categies_finess = lis_le_fichier_xml_en_stream(
        logger,
        chemin_du_fichier,
        XML_TAG_FINESS_CS1500106,
        colonnes_a_garder_categories_finess,
        type_des_colonnes_categories_finess,
    )
    categories_transformees = transforme_les_categories(categies_finess)

    with base_de_donnees.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            nom_de_la_donnée="catégories finess",
            fournisseur="FINESS",
            connection=connection,
            table=TABLE_REF_CATEGORIES,
            données=categories_transformees,
            logger=logger,
            fichiers_mis_à_jour=[],
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    répertoire_des_fichiers = os.path.join(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"], "finess", "nomenclature")
    fichiers = os.listdir(répertoire_des_fichiers)
    chemin_local_du_fichier_des_categories = os.path.join(répertoire_des_fichiers, trouve_le_nom_du_fichier(fichiers, "finess_cs1500106", logger_helios))

    import_ref_categories(chemin_local_du_fichier_des_categories, base_de_donnees_helios, logger_helios)

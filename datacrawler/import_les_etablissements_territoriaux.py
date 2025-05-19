import os

from logging import Logger

from sqlalchemy.engine import Engine, create_engine
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_finess
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_xml import lis_le_fichier_xml
from datacrawler.transform.équivalences_finess_helios import XPATH_FINESS_CS1400102, XPATH_FINESS_CS1500106, type_des_colonnes_finess_cs1400102, type_des_colonnes_finess_cs1500106
from datacrawler.extract.lecteur_sql import (
    recupere_les_numeros_finess_des_etablissements_de_la_base,
    recupere_les_numeros_finess_des_entites_juridiques_de_la_base,
    recupere_le_ref_institution_region_de_la_base
)
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.sauvegarde import mets_a_jour_la_date_de_mise_a_jour_du_fichier_source, supprime, mets_a_jour
from datacrawler.load.nom_des_tables import TABLE_ETABLISSEMENTS_TERRITORIAUX, CLE_PRIMAIRE_TABLE_ETABLISSEMENTS_TERRITORIAUX
from datacrawler.transform.entite_juridique.bloc_identite.transforme_les_donnees_entite_juridique import(
    associe_le_code_region,
)
from datacrawler.transform.transform_les_etablissements_territoriaux.transform_les_etablissements_territoriaux import(
    associe_le_domaine,
    associe_la_classification,
    conserve_les_etablissements_territoriaux_ouverts,
    extrais_les_etablissements_territoriaux_recemment_fermes,
    transform_les_etablissements_territoriaux
)
from datacrawler.load.nom_des_tables import FichierSource


def import_etablissements_territoriaux(chemin_local_du_fichier_et: str,
                                       chemin_local_du_fichier_categorie: str,
                                       base_de_donnees: Engine,
                                       logger: Logger) -> None:
    etablissements_territoriaux_flux_finess = lis_le_fichier_xml(
        chemin_local_du_fichier_et,
        XPATH_FINESS_CS1400102,
        type_des_colonnes_finess_cs1400102,
    )
    logger.info(f"[FINESS] {etablissements_territoriaux_flux_finess.shape[0]} établissements territoriaux récupérés depuis FINESS.")
    etablissements_territoriaux_ouverts = conserve_les_etablissements_territoriaux_ouverts(etablissements_territoriaux_flux_finess,
                                            recupere_les_numeros_finess_des_entites_juridiques_de_la_base(base_de_donnees))
    logger.info(f"[FINESS] {etablissements_territoriaux_ouverts.shape[0]} établissements territoriaux sont ouverts.")
    etablissements_territoriaux_a_supprimer = extrais_les_etablissements_territoriaux_recemment_fermes(etablissements_territoriaux_ouverts,
                                                            recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_donnees))
    logger.info(f"[FINESS] {len(etablissements_territoriaux_a_supprimer)} établissements territoriaux sont fermés.")
    categories = lis_le_fichier_xml(
        chemin_local_du_fichier_categorie,
        XPATH_FINESS_CS1500106,
        type_des_colonnes_finess_cs1500106,
    )
    etablissements_territoriaux_categorises = associe_le_domaine(etablissements_territoriaux_ouverts, categories)
    etablissements_territoriaux_classifies = associe_la_classification(etablissements_territoriaux_categorises)
    referentiel_dep_region = recupere_le_ref_institution_region_de_la_base(base_de_donnees)
    etablissements_territoriaux_avec_code_region = associe_le_code_region(etablissements_territoriaux_classifies, referentiel_dep_region)
    etablissements_territoriaux_transformes = transform_les_etablissements_territoriaux(etablissements_territoriaux_avec_code_region)
    date_du_fichier_et = extrais_la_date_du_nom_de_fichier_finess(chemin_local_du_fichier_et)
    logger.info(f"[FINESS] Date de mise à jour des fichiers FINESS des établissements territoriaux  : {date_du_fichier_et}")
    with base_de_donnees.begin() as connection:
        supprime(connection, TABLE_ETABLISSEMENTS_TERRITORIAUX, CLE_PRIMAIRE_TABLE_ETABLISSEMENTS_TERRITORIAUX, etablissements_territoriaux_a_supprimer)
        logger.info(f"Supprime {len(etablissements_territoriaux_a_supprimer)} établissements territoriaux.")
        mets_a_jour(connection, TABLE_ETABLISSEMENTS_TERRITORIAUX, CLE_PRIMAIRE_TABLE_ETABLISSEMENTS_TERRITORIAUX, etablissements_territoriaux_transformes)
        logger.info(f"Sauvegarde {etablissements_territoriaux_transformes.shape[0]} établissements territoriaux.")
        mets_a_jour_la_date_de_mise_a_jour_du_fichier_source(connection, date_du_fichier_et, FichierSource.FINESS_CS1400101)

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    repertoire_des_fichiers = os.path.join(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"], "finess", "simple")
    repertoire_des_fichiers_nomenclature = os.path.join(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"], "finess", "nomenclature")
    fichiers = os.listdir(repertoire_des_fichiers)
    fichiers_nomenclature = os.listdir(repertoire_des_fichiers_nomenclature)
    chemin_local_du_fichier_cs1400102 = os.path.join(repertoire_des_fichiers, trouve_le_nom_du_fichier(fichiers, "finess_cs1400102", logger_helios))
    chemin_local_du_fichier_cs1500106 = os.path.join(repertoire_des_fichiers_nomenclature,
                                                     trouve_le_nom_du_fichier(fichiers_nomenclature, "finess_cs1500106_stock_", logger_helios)
                                                     )
    import_etablissements_territoriaux(chemin_local_du_fichier_cs1400102, chemin_local_du_fichier_cs1500106, base_de_donnees_helios, logger_helios)

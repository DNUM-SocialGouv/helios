import os
from logging import Logger

from sqlalchemy.engine import Engine, create_engine
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_finess
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_xml import lis_le_fichier_xml
from datacrawler.transform.équivalences_finess_helios import XPATH_FINESS_CS1400101, type_des_colonnes_finess_cs1400105
from datacrawler.extract.lecteur_sql import (
    recupere_les_numeros_finess_des_entites_juridiques_de_la_base,
)
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.sauvegarde import mets_a_jour_la_date_de_mise_a_jour_du_fichier_source, supprime, mets_a_jour
from datacrawler.load.nom_des_tables import TABLE_ENTITES_JURIDIQUES, CLE_PRIMAIRE_TABLE_ENTITES_JURIDIQUES
from datacrawler.transform.entite_juridique.bloc_identite.transforme_les_donnees_entite_juridique import(
    conserve_les_entites_juridiques_ouvertes,
    extrais_les_entites_juridiques_recemment_fermees
)


def import_entites_juridiques(chemin_local_du_fichier_ej: str, base_de_donnees: Engine, logger: Logger) -> None:
    entites_juridiques_flux_finess = lis_le_fichier_xml(
        chemin_local_du_fichier_ej,
        XPATH_FINESS_CS1400101,
        type_des_colonnes_finess_cs1400105,
    )
    logger.info(f"[FINESS] {entites_juridiques_flux_finess.shape[0]} entités juridiques récupérées depuis FINESS.")
    entites_juridiques_ouvertes = conserve_les_entites_juridiques_ouvertes(entites_juridiques_flux_finess)
    logger.info(f"[FINESS] {entites_juridiques_ouvertes.shape[0]} entités juridiques sont ouvertes.")
    entite_juridiques_sauvegardees = recupere_les_numeros_finess_des_entites_juridiques_de_la_base(base_de_donnees)
    logger.info(f"[entites_juridiques_ouvertes] {entites_juridiques_ouvertes}")
    entites_juridiques_a_supprimer = extrais_les_entites_juridiques_recemment_fermees(entites_juridiques_ouvertes, entite_juridiques_sauvegardees)
    entites_juridique_categorisees = associeLaCategorisation(entites_juridiques_ouvertes)
    date_du_fichier_ej = extrais_la_date_du_nom_de_fichier_finess(chemin_local_du_fichier_ej)
    logger.info(f"[FINESS] Date de mise à jour des fichiers FINESS des entités juridiques : {date_du_fichier_ej}")
    with base_de_donnees.begin() as connection:
        supprime(connection, TABLE_ENTITES_JURIDIQUES, CLE_PRIMAIRE_TABLE_ENTITES_JURIDIQUES, entites_juridiques_a_supprimer)
        logger.info(f"Supprime {entites_juridiques_a_supprimer.shape[0]} entités juridiques.")
        mets_a_jour(connection, TABLE_ENTITES_JURIDIQUES, CLE_PRIMAIRE_TABLE_ENTITES_JURIDIQUES, entites_juridique_categorisees , column_mapping)
        logger.info(f"Sauvegarde {entites_juridique_categorisees.shape[0]} entités juridiques.")
        mets_a_jour_la_date_de_mise_a_jour_du_fichier_source(connection, date_du_fichier_ej, 'CS1400101')

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    repertoire_des_fichiers = os.path.join(variables_d_environnement["FINESS_SFTP_LOCAL_PATH"], "finess", "simple")
    fichiers = os.listdir(repertoire_des_fichiers)
    chemin_local_du_fichier_cs1400101 = os.path.join(repertoire_des_fichiers, trouve_le_nom_du_fichier(fichiers, "finess_cs1400101", logger_helios))
    logger_helios.info(f"[FINESS] Cherche les entités juridiques dans le fichier {chemin_local_du_fichier_cs1400101}")
    import_entites_juridiques(chemin_local_du_fichier_cs1400101, base_de_donnees_helios, logger_helios)

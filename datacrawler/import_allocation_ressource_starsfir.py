import os
from logging import Logger
import sys

from sqlalchemy.engine import Engine, create_engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import (
    extrais_l_annee_du_nom_de_fichier_engagements_starsfir,
    extrais_la_date_du_nom_de_fichier_engagements_starsfir,
)
from datacrawler.extract.lecteur_csv import lis_le_fichier_engagements_starsfir_csv
from datacrawler.extract.lecteur_sql import (
    recupere_les_numeros_finess_des_entites_juridiques_de_la_base,
    recupere_les_numeros_finess_des_etablissements_de_la_base,
)
from datacrawler.load.nom_des_tables import TABLE_RESSOURCE_ALLOCATION_EJ, TABLE_RESSOURCE_ALLOCATION_ET, FichierSource
from datacrawler.load.sauvegarde import (
    mets_a_jour_la_date_de_mise_a_jour_du_fichier_source,
    sauvegarde,
    supprime_les_donnees_pour_l_annee,
)
from datacrawler.transform.transforme_les_donnees_allocation_ressource.transforme_les_donnees_allocation_ressource import (
    transforme_les_donnees_engagements_ej,
    transforme_les_donnees_engagements_et,
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_a_lire_allocation_ressource_engagements,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_engagements_starsfir_allocation_ressource_ej_helios,
)


def import_engagements_allocation_ressource(
    fichier: str,
    hapi_data_path: str,
    base_de_données: Engine,
    logger: Logger,
) -> None:
    chemin = os.path.join(hapi_data_path, fichier)
    annee_fichier = extrais_l_annee_du_nom_de_fichier_engagements_starsfir(chemin)

    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_engagements_starsfir_allocation_ressource_ej_helios)
    donnees = lis_le_fichier_engagements_starsfir_csv(chemin, colonnes_a_lire_allocation_ressource_engagements, types_des_colonnes)

    finess_ej = recupere_les_numeros_finess_des_entites_juridiques_de_la_base(base_de_données)
    finess_et = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_données)

    donnees_ej = transforme_les_donnees_engagements_ej(donnees, finess_ej, logger)
    donnees_et = transforme_les_donnees_engagements_et(donnees, finess_et, logger)

    # On sépare les données de l'année courante (pour lesquelles on fera une suppression+insertion) des années précédentes (pour mise à jour)
    donnees_ej_annee_courante = donnees_ej[donnees_ej.index.get_level_values("annee") == annee_fichier]
    # donnees_ej_annees_precedentes = donnees_ej[donnees_ej.index.get_level_values("annee") != annee_fichier]
    donnees_et_annee_courante = donnees_et[donnees_et.index.get_level_values("annee") == annee_fichier]
    # donnees_et_annees_precedentes = donnees_et[donnees_et.index.get_level_values("annee") != annee_fichier]

    with base_de_données.begin() as connection:
        # Pour l’année en cours on est sur un annule et remplace complet
        supprime_les_donnees_pour_l_annee(connection, TABLE_RESSOURCE_ALLOCATION_EJ, annee_fichier)
        supprime_les_donnees_pour_l_annee(connection, TABLE_RESSOURCE_ALLOCATION_ET, annee_fichier)
        sauvegarde(connection, TABLE_RESSOURCE_ALLOCATION_EJ, donnees_ej_annee_courante)
        sauvegarde(connection, TABLE_RESSOURCE_ALLOCATION_ET, donnees_et_annee_courante)
        logger.info(f"[STARSFIR ENGAGEMENTS] Année courante {annee_fichier}: suppression+insertion EJ/ET effectuée")

        # Pour les années précédentes, on met à jour uniquement les montants des engagements uniquement
        # La démarche de distinction entre les nouvelles et les anciennes données n’étant pas fixée, on met en pause
        # mets_a_jour_les_montants_engagements(connection, TABLE_RESSOURCE_ALLOCATION_EJ, "numero_finess_entite_juridique", donnees_ej_annees_precedentes)
        # mets_a_jour_les_montants_engagements(
        #     connection, TABLE_RESSOURCE_ALLOCATION_ET, "numero_finess_etablissement_territorial", donnees_et_annees_precedentes
        # )
        # logger.info("[STARSFIR ENGAGEMENTS] Années précédentes: mise à jour effectuée")

        mets_a_jour_la_date_de_mise_a_jour_du_fichier_source(
            connection, extrais_la_date_du_nom_de_fichier_engagements_starsfir(chemin), FichierSource.DIAMANT_MEN_HAPI
        )

    logger.info(f"[STARSFIR ENGAGEMENTS] Import terminé: {donnees_ej.shape[0]} EJ, {donnees_et.shape[0]} ET")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    hapi_data_dir = variables_d_environnement["HAPI_DATA_PATH"]
    fichiers = os.listdir(hapi_data_dir)
    # Find the most recent engagements file
    fichiers_engagements = [f for f in fichiers if "engagements_exporter" in f]
    if not fichiers_engagements:
        logger_helios.warning(f"Aucun fichier engagements trouvé dans {hapi_data_dir}")
        sys.exit(0)
    fichier_le_plus_recent = sorted(fichiers_engagements, reverse=True)[0]

    logger_helios.info("Traitement du fichier engagements le plus récent : %s", fichier_le_plus_recent)
    import_engagements_allocation_ressource(fichier_le_plus_recent, hapi_data_dir, base_de_données_helios, logger_helios)

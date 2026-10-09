import os
from logging import Logger
from typing import Any

import requests
from sqlalchemy.engine import Engine, create_engine

from datacrawler.constantes import (
    CODES_DE_CATEGORISATION_DES_STATUTS_JURIDIQUES,
    FINESS_STATUTS_JURIDIQUES_CODESYSTEM_URL,
    PREFIXE_FICHIER_STRUCTURES_FINESS,
    REPERTOIRE_JSON_FINESS,
)
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_json_finess import (
    extrais_la_date_du_nom_de_fichier_finess_json,
    lis_les_entites_juridiques_json_finess,
)
from datacrawler.extract.lecteur_sql import (
    recupere_le_referentiel_departement_region_de_la_base,
    recupere_les_numeros_finess_des_entites_juridiques_de_la_base,
)
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import CLE_PRIMAIRE_TABLE_ENTITES_JURIDIQUES, FichierSource, TABLE_ENTITES_JURIDIQUES
from datacrawler.load.sauvegarde import mets_a_jour, mets_a_jour_la_date_de_mise_a_jour_du_fichier_source, supprime
from datacrawler.transform.entite_juridique.bloc_identite.transforme_les_donnees_entite_juridique import (
    conserve_les_entites_juridiques_ouvertes,
    extrais_les_entites_juridiques_recemment_fermees,
    transforme_le_json_des_entites_juridiques,
)


def _récupère_les_statuts_juridiques(finess_statuts_juridiques_codesystem_url: str) -> dict[str, dict[str, str]]:
    response = requests.get(
        finess_statuts_juridiques_codesystem_url,
        headers={"Accept": "application/fhir+json"},
        timeout=30,
    )
    response.raise_for_status()
    codesystem = response.json()
    concepts = [concept for concept in codesystem.get("concept", []) if _est_un_statut_juridique_valide(concept)]
    concepts_par_code = {str(concept["code"]): concept for concept in concepts}
    return {
        str(concept.get("code")): {
            "libelle": str(concept.get("display")),
            "categorisation": _détermine_la_categorisation_du_statut_juridique(str(concept.get("code")), concepts_par_code),
        }
        for concept in concepts
    }


def _est_un_statut_juridique_valide(concept: Any) -> bool:
    return isinstance(concept, dict) and concept.get("code") is not None and concept.get("display") is not None


def _détermine_la_categorisation_du_statut_juridique(code: str, concepts_par_code: dict[str, dict[str, Any]]) -> str:
    code_parent: str | None = code
    codes_vus: set[str] = set()

    while code_parent and code_parent not in codes_vus:
        categorisation = CODES_DE_CATEGORISATION_DES_STATUTS_JURIDIQUES.get(code_parent)
        if categorisation is not None:
            return categorisation

        codes_vus.add(code_parent)
        code_parent = _extrais_le_code_parent_du_statut_juridique(concepts_par_code.get(code_parent))

    return ""


def _extrais_le_code_parent_du_statut_juridique(concept: dict[str, Any] | None) -> str | None:
    if concept is None:
        return None

    for propriete in concept.get("property", []):
        if isinstance(propriete, dict) and propriete.get("code") == "parent" and propriete.get("valueCode") is not None:
            return str(propriete.get("valueCode"))

    return None

def import_entites_juridiques_depuis_json_finess(
    chemin_local_du_fichier_structures: str,
    base_de_donnees: Engine,
    finess_statuts_juridiques_codesystem_url: str,
    logger: Logger,
) -> None:
    entites_juridiques_flux_finess = lis_les_entites_juridiques_json_finess(logger, chemin_local_du_fichier_structures)
    logger.info(f"[FINESS] {entites_juridiques_flux_finess.shape[0]} entités juridiques récupérées depuis FINESS.")
    entites_juridiques_ouvertes = conserve_les_entites_juridiques_ouvertes(entites_juridiques_flux_finess)
    logger.info(f"[FINESS] {entites_juridiques_ouvertes.shape[0]} entités juridiques sont ouvertes.")
    entite_juridiques_sauvegardees = recupere_les_numeros_finess_des_entites_juridiques_de_la_base(base_de_donnees)
    entites_juridiques_a_supprimer = extrais_les_entites_juridiques_recemment_fermees(
        entites_juridiques_ouvertes,
        entite_juridiques_sauvegardees,
    )
    logger.info(f"[FINESS] {len(entites_juridiques_a_supprimer)} entités juridiques sont fermées.")
    statuts_juridiques = _récupère_les_statuts_juridiques(finess_statuts_juridiques_codesystem_url)
    logger.info(f"[FINESS] {len(statuts_juridiques)} statuts juridiques récupérés depuis FINESS.")
    referentiel_departement_region = recupere_le_referentiel_departement_region_de_la_base(base_de_donnees)
    entites_juridique_transformees = transforme_le_json_des_entites_juridiques(
        entites_juridiques_ouvertes,
        statuts_juridiques,
        referentiel_departement_region,
    )
    date_du_fichier = extrais_la_date_du_nom_de_fichier_finess_json(chemin_local_du_fichier_structures)
    logger.info(f"[FINESS] Date de mise à jour du fichier FINESS structures : {date_du_fichier}")
    with base_de_donnees.begin() as connection:
        supprime(connection, TABLE_ENTITES_JURIDIQUES, CLE_PRIMAIRE_TABLE_ENTITES_JURIDIQUES, entites_juridiques_a_supprimer)
        logger.info(f"Supprime {len(entites_juridiques_a_supprimer)} entités juridiques.")
        mets_a_jour(connection, TABLE_ENTITES_JURIDIQUES, CLE_PRIMAIRE_TABLE_ENTITES_JURIDIQUES, entites_juridique_transformees)
        logger.info(f"Sauvegarde {entites_juridique_transformees.shape[0]} entités juridiques.")
        mets_a_jour_la_date_de_mise_a_jour_du_fichier_source(connection, date_du_fichier, FichierSource.FINESS_STRUCTURE)

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    repertoire_des_fichiers = os.path.join(
        variables_d_environnement["FINESS_SFTP_LOCAL_PATH"],
        "finess",
        REPERTOIRE_JSON_FINESS,
    )
    fichiers = os.listdir(repertoire_des_fichiers)
    chemin_structures_finess = os.path.join(
        repertoire_des_fichiers,
        trouve_le_nom_du_fichier(fichiers, PREFIXE_FICHIER_STRUCTURES_FINESS, logger_helios),
    )
    import_entites_juridiques_depuis_json_finess(
        chemin_structures_finess,
        base_de_donnees_helios,
        FINESS_STATUTS_JURIDIQUES_CODESYSTEM_URL,
        logger_helios,
    )

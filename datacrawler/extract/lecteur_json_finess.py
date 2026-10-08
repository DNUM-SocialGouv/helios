import json
import re
import time
from logging import Logger
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd


def lis_les_entites_juridiques_json_finess(logger: Logger, chemin_du_fichier: str) -> pd.DataFrame:
    logger.info(f"[JSON] Lecture du fichier [{chemin_du_fichier}]")
    start = time.perf_counter()
    donnees = _charge_le_flux_json(chemin_du_fichier)
    entites_juridiques = [
        _transforme_une_entite_juridique(pmej)
        for pmej in donnees.get("pmej", [])
    ]
    logger.info(f"[JSON] Fin de lecture du fichier en {time.perf_counter() - start}s")
    return pd.DataFrame(entites_juridiques)


def lis_les_etablissements_territoriaux_json_finess(logger: Logger, chemin_du_fichier: str) -> pd.DataFrame:
    logger.info(f"[JSON] Lecture du fichier [{chemin_du_fichier}]")
    start = time.perf_counter()
    donnees = _charge_le_flux_json(chemin_du_fichier)
    etablissements_territoriaux = [
        _transforme_un_etablissement_territorial(pmej, ege)
        for pmej in donnees.get("pmej", [])
        for ege in pmej.get("ege", [])
    ]
    logger.info(f"[JSON] Fin de lecture du fichier en {time.perf_counter() - start}s")
    return pd.DataFrame(etablissements_territoriaux)

def extrais_la_date_du_nom_de_fichier_finess_json(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).name
    date_extraite = re.search(r"(\d{8})(?:\.json)?(?:\.gz)?$", nom_du_fichier)
    if date_extraite is not None:
        return date_extraite.group(1)

    date_extraite_du_contenu = _extrais_la_date_du_contenu_json_finess(chemin_du_ficher)
    if date_extraite_du_contenu is None:
        raise ValueError("Le fichier FINESS JSON ne contient pas de date valide.")
    return date_extraite_du_contenu


def _extrais_la_date_du_contenu_json_finess(chemin_du_ficher: str) -> str | None:
    with open(chemin_du_ficher, encoding="utf-8") as fichier:
        debut_du_fichier = fichier.read(4096)
    return _extrais_la_date_du_debut_du_flux_json_finess(debut_du_fichier)

def _extrais_la_date_du_debut_du_flux_json_finess(debut_du_fichier: str) -> str | None:
    date_extraite = re.search(r'"generatedAt"\s*:\s*"(\d{4})-(\d{2})-(\d{2})', debut_du_fichier)
    if date_extraite is None:
        return None
    return "".join(date_extraite.groups())


def _charge_le_flux_json(chemin_du_fichier: str) -> Dict[str, Any]:
    with open(chemin_du_fichier, encoding="utf-8") as fichier:
        return json.load(fichier)

def _transforme_une_entite_juridique(pmej: Dict[str, Any]) -> Dict[str, Any]:
    informations_generales = pmej.get("informationsGeneralesPMEJ", {})
    adresse = _premiere_adresse(pmej.get("adresse", []))
    contact = _premier_contact(pmej.get("contact", []))

    return {
        "cogCommune": adresse.get("cogCommune"),
        "dateCreation": informations_generales.get("dateCreation"),
        "datefermeture": informations_generales.get("dateFermeture"),
        "ligneacheminement": adresse.get("ligneAcheminement"),
        "nofiness": informations_generales.get("numFinessPm"),
        "numvoie": adresse.get("numeroVoie"),
        "denominationPm": informations_generales.get("denominationPm"),
        "denominationLonguePmSmsse": informations_generales.get("denominationLonguePmSmsse"),
        "siren": informations_generales.get("siren"),
        "statutJuridique": informations_generales.get("statutJuridique"),
        "telephone": contact.get("telephone"),
        "typvoie": adresse.get("typeVoie"),
        "voie": adresse.get("libelleVoie"),
    }


def _transforme_un_etablissement_territorial(pmej: Dict[str, Any], ege: Dict[str, Any]) -> Dict[str, Any]:
    informations_generales_pmej = pmej.get("informationsGeneralesPMEJ", {})
    informations_generales_ege = ege.get("informationsGeneralesEGE", {})
    adresse = _premiere_adresse(ege.get("adresse", []))
    contact = _premier_contact(ege.get("contact", []))
    id_ege = informations_generales_ege.get("egeId")
    roles_ege = ege.get("roleEge", [])

    return {
        "categetab": ege.get("categorieentiteGeographiqueExercice"),
        "cogCommune": adresse.get("cogCommune"),
        "codemft": ege.get("modefixationtarifaire"),
        "courriel": contact.get("courriel"),
        "datefermeture": informations_generales_ege.get("dateFermeture"),
        "dateouv": informations_generales_ege.get("dateOuverture"),
        "etatObjet": ege.get("etatObjet"),
        "idEge": id_ege,
        "ligneacheminement": adresse.get("ligneAcheminement"),
        "nofinessej": informations_generales_pmej.get("numFinessPm"),
        "nofinesset": informations_generales_ege.get("numFinessEge"),
        "nofinessppal": _détermine_le_numero_finess_etablissement_principal(id_ege, roles_ege, pmej.get("ege", [])),
        "numvoie": adresse.get("numeroVoie"),
        "rs": informations_generales_ege.get("nomEgeCourt"),
        "rslongue": informations_generales_ege.get("nomEgeLong"),
        "siret": informations_generales_ege.get("siret"),
        "telephone": contact.get("telephone"),
        "typeet": _détermine_le_type_etablissement(id_ege, roles_ege),
        "typvoie": adresse.get("typeVoie"),
        "voie": adresse.get("libelleVoie"),
    }


def _détermine_le_type_etablissement(id_ege: str | None, roles_ege: List[Dict[str, Any]]) -> str:
    if id_ege is None:
        return ""

    if any(role.get("idEgePorteuse") == id_ege for role in roles_ege):
        return "P"

    if any(role.get("idEgeNonPorteuse") == id_ege for role in roles_ege):
        return "S"

    return ""


def _détermine_le_numero_finess_etablissement_principal(
    id_ege: str | None,
    roles_ege: List[Dict[str, Any]],
    etablissements_geographiques_exercice: List[Dict[str, Any]],
) -> str:
    if id_ege is None:
        return ""

    id_ege_porteuse = next(
        (role.get("idEgePorteuse") for role in roles_ege if role.get("idEgeNonPorteuse") == id_ege),
        None,
    )
    if id_ege_porteuse is None:
        return ""

    ege_porteuse = next(
        (ege for ege in etablissements_geographiques_exercice if ege.get("informationsGeneralesEGE", {}).get("egeId") == id_ege_porteuse),
        {},
    )
    return ege_porteuse.get("informationsGeneralesEGE", {}).get("numFinessEge", "") or ""

def _premiere_adresse(adresses: List[Dict[str, Any]]) -> Dict[str, Any]:
    return next(iter(adresses), {})


def _premier_contact(contacts: List[Dict[str, Any]]) -> Dict[str, Any]:
    contact = next(iter(contacts), {})
    return contact.get("telecom", {}) or {}

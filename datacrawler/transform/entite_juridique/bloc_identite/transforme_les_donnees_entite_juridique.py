from typing import Mapping, Tuple
import unicodedata
import re
import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    index_des_entitees_juridiques,
    equivalences_json_finess_helios,
)


def normalize_and_uppercase(value: str) -> str:
    """Normaliser et mettre en majuscules selon les règles: NFD, suppression accents, tirets/apostrophes remplacés par espaces"""
    if pd.isna(value) or not isinstance(value, str):
        return value
    if not value.strip():
        return value
    # Normalize to NFD (decomposed form)
    normalized = unicodedata.normalize('NFD', value)
    # Remove diacritics
    normalized = ''.join(c for c in normalized if unicodedata.category(c) != 'Mn')
    # Replace hyphens and apostrophes with spaces
    normalized = re.sub(r"[\-']", " ", normalized)
    # Convert to uppercase
    return normalized.upper()

def conserve_les_entites_juridiques_ouvertes(
    entites_juridiques_flux_finess: pd.DataFrame
) -> pd.DataFrame:
    return entites_juridiques_flux_finess[(entites_juridiques_flux_finess["datefermeture"].isna()) ]

def extrais_les_entites_juridiques_recemment_fermees(
    entites_juridiques_ouvertes: pd.DataFrame,
    entite_juridiques_sauvegardees: pd.DataFrame
    ) -> Tuple[str, ...]:
    nouveaux = entites_juridiques_ouvertes['nofiness']
    sauvegardes = entite_juridiques_sauvegardees['numero_finess_entite_juridique']
    # Filtrer les objets à supprimer
    objets_a_supprimer = entite_juridiques_sauvegardees[~sauvegardes.isin(nouveaux)]
    return tuple(objets_a_supprimer['numero_finess_entite_juridique'])

def associe_le_territoire_des_entites_juridiques_json(entites_juridiques: pd.DataFrame, referentiel: pd.DataFrame) -> pd.DataFrame:
    referentiel_par_commune = referentiel.rename(
        columns={
            'ref_code_cog': 'cogCommune',
            'ref_libelle_commune': 'commune',
            'ref_libelle_dep': 'departement',
            'ref_code_region': 'code_region',
        }
    )
    fusion = pd.merge(
        entites_juridiques,
        referentiel_par_commune[['cogCommune', 'commune', 'departement', 'code_region']],
        on='cogCommune',
        how='left',
    )
    fusion['commune'] = fusion['commune'].apply(normalize_and_uppercase)
    fusion['departement'] = fusion['departement'].apply(normalize_and_uppercase)
    return fusion

def associe_les_informations_du_statut_juridique(
    entites_juridiques: pd.DataFrame,
    statuts_juridiques: Mapping[str, Mapping[str, str]],
) -> pd.DataFrame:
    entites_juridiques = entites_juridiques.copy()
    entites_juridiques["categorisation"] = entites_juridiques["statutJuridique"].map(
        lambda code: statuts_juridiques.get(code, {}).get("categorisation", "")
    )
    entites_juridiques["statutJuridique"] = entites_juridiques["statutJuridique"].map(
        lambda code: statuts_juridiques.get(code, {}).get("libelle", code)
    )
    return entites_juridiques


def transforme_le_json_des_entites_juridiques(
    entites_juridiques: pd.DataFrame,
    statuts_juridiques: Mapping[str, Mapping[str, str]],
    referentiel: pd.DataFrame,
) -> pd.DataFrame:
    entites_juridiques = associe_les_informations_du_statut_juridique(entites_juridiques, statuts_juridiques)
    entites_juridiques = associe_le_territoire_des_entites_juridiques_json(entites_juridiques, referentiel)
    entites_juridiques['denominationLonguePmSmsse'] = entites_juridiques['denominationLonguePmSmsse'].where(
        entites_juridiques['denominationLonguePmSmsse'].notna() & (entites_juridiques['denominationLonguePmSmsse'] != ''), entites_juridiques['denominationPm'])
    return (
        entites_juridiques
        .rename(columns=equivalences_json_finess_helios)
        .drop(columns=['datefermeture', 'cogCommune'], errors='ignore')
        .dropna(subset=index_des_entitees_juridiques)
        .drop_duplicates(subset=index_des_entitees_juridiques)
        .set_index(index_des_entitees_juridiques)
    )

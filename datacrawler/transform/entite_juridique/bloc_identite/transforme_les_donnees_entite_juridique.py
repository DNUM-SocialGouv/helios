from typing import Tuple
import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_a_garder_finess_cs1400101,
    colonnes_a_garder_finess_cs1400107,
    equivalences_finess_cs1400101_helios,
    index_des_entitees_juridiques
)


CATEGORISATION = {
    "1000": "public",
    "2100": "prive_non_lucratif",
    "2200": "prive_lucratif",
    "3000": "personne_morale_droit_etranger",
    "UNKNOWN": ""
}

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

def categoriser(statut_niv1, statut_niv2):
    if statut_niv1 == "1000":
        return CATEGORISATION["1000"]
    if statut_niv1 == "3000":
        return CATEGORISATION["3000"]
    if statut_niv2 == "2100":
        return CATEGORISATION["2100"]
    if statut_niv2 == "2200":
        return CATEGORISATION["2200"]
    return CATEGORISATION["UNKNOWN"]

def associe_la_categorisation(entites_juridiques_ouvertes: pd.DataFrame, categories:pd.DataFrame) -> pd.DataFrame:
    entites_juridiques_filtrees = entites_juridiques_ouvertes[colonnes_a_garder_finess_cs1400101]
    categories_filtrees = categories[colonnes_a_garder_finess_cs1400107]
    categories_filtrees = categories_filtrees.rename(columns={'code': 'statutjuridique'})
    categories_filtrees = categories_filtrees.rename(columns={'codeagr1': 'statutJuridiqueNiv1'})
    categories_filtrees = categories_filtrees.rename(columns={'codeagr2': 'statutJuridiqueNiv2'})
    fusion = pd.merge(entites_juridiques_filtrees, categories_filtrees, on='statutjuridique', how='left')
    fusion['categorisation'] = fusion.apply(
        lambda row: categoriser(row.get('statutJuridiqueNiv1', ''), row.get('statutJuridiqueNiv2', '')),
        axis=1
    )
    return fusion
def get_outre_mer_departement(departement_code: str) -> str:
    # Dictionary to map department codes
    mapping = {
        '9A': '971',
        '9B': '972',
        '9C': '973',
        '9D': '974',
        '9F': '976'
    }
    # Return the mapped value or the original code
    return mapping.get(departement_code, departement_code)

def associe_le_code_region(entites_juridiques: pd.DataFrame, referentiel: pd.DataFrame) -> pd.DataFrame:
    entites_juridiques['departement'] = entites_juridiques['departement'].apply(get_outre_mer_departement)
    referentiel = referentiel.rename(columns={'ref_code_dep': 'departement'})
    fusion = pd.merge(entites_juridiques, referentiel, on='departement', how='left')
    return fusion

def transform_les_entites_juridiques(entites_juridiques: pd.DataFrame) -> pd.DataFrame:
    entites_juridiques['rslongue'] = entites_juridiques['rslongue'].where(
        entites_juridiques['rslongue'].notna() & (entites_juridiques['rslongue'] != ''), entites_juridiques['rs'])
    entites_juridiques_filtrees = entites_juridiques.drop(
        columns=['statutjuridique','statutJuridiqueNiv2', 'statutJuridiqueNiv1', 'departement', 'datefermeture'])
    return (
        entites_juridiques_filtrees
        .rename(columns=equivalences_finess_cs1400101_helios)
        .dropna(subset=index_des_entitees_juridiques)
        .drop_duplicates(subset=index_des_entitees_juridiques)
        .set_index(index_des_entitees_juridiques)
    )

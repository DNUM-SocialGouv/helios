from typing import Tuple

import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_a_garder_finess_cs1500106,
    colonnes_a_garder_finess_cs1400102,
    equivalences_finess_cs1400102_helios,
    index_des_etablissements_territorriaux
)


def categoriser(categorie: str) -> str:
    if categorie == "SAN":
        return "Sanitaire"
    return "Médico-social"

def associe_le_domaine(etablissements_territoriaux_ouverts: pd.DataFrame, categories:pd.DataFrame) -> pd.DataFrame:
    categories_filtrees = categories[colonnes_a_garder_finess_cs1500106]
    categories_filtrees = categories_filtrees.rename(columns={'code': 'categetab'})
    fusion = pd.merge(etablissements_territoriaux_ouverts, categories_filtrees, on='categetab', how='left')
    fusion["domaine"] = fusion["domaine"].apply(categoriser)
    return fusion

def conserve_les_etablissements_territoriaux_ouverts(
    etablissements_territoriaux_flux_finess: pd.DataFrame,
    entites_juridiques_sauvegardees: pd.DataFrame
) -> pd.DataFrame:
    return etablissements_territoriaux_flux_finess[(etablissements_territoriaux_flux_finess["datefermeture"].isna()) &
                                ( etablissements_territoriaux_flux_finess["indcaduc"] != 'O') &
                                (etablissements_territoriaux_flux_finess["nofinessej"].isin(entites_juridiques_sauvegardees["numero_finess_entite_juridique"]))]

def extrais_les_etablissements_territoriaux_recemment_fermes(
    etablissements_territoriaux_ouverts: pd.DataFrame,
    etablissements_territoriaux_sauvegardes: pd.DataFrame
    ) -> Tuple[str, ...]:
    nouveaux = etablissements_territoriaux_ouverts['nofinesset']
    sauvegardes = etablissements_territoriaux_sauvegardes['numero_finess_etablissement_territorial']
    # Filtrer les objets à supprimer
    objets_a_supprimer = etablissements_territoriaux_sauvegardes[~sauvegardes.isin(nouveaux)]
    return tuple(objets_a_supprimer['numero_finess_etablissement_territorial'])

def transform_les_etablissements_territoriaux(etablissements_territoriaux: pd.DataFrame) -> pd.DataFrame:
    etablissements_territoriaux['rslongue'] = etablissements_territoriaux['rslongue'].where(
        etablissements_territoriaux['rslongue'].notna() & (etablissements_territoriaux['rslongue'] != ''), etablissements_territoriaux['rs'])
    etablissements_territoriaux_filtres = etablissements_territoriaux[colonnes_a_garder_finess_cs1400102]
    return (
        etablissements_territoriaux_filtres
        .rename(columns=equivalences_finess_cs1400102_helios)
        .dropna(subset=index_des_etablissements_territorriaux)
        .drop_duplicates(subset=index_des_etablissements_territorriaux)
        .set_index(index_des_etablissements_territorriaux)
    )

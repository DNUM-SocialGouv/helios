import pandas as pd
from datacrawler.transform.équivalences_finess_helios import colonnes_a_garder_finess_cs1400101, colonnes_a_garder_finess_cs1400107

CATEGORISATION = {
    "1000": "Public",
    "2100": "Privé non lucratif",
    "2200": "Privé lucratif",
    "3000": "Personne morale de droit étranger",
    "UNKNOWN": ""
}

def conserve_les_entites_juridiques_ouvertes(
    entites_juridiques_flux_finess: pd.DataFrame
) -> pd.DataFrame:
    return entites_juridiques_flux_finess[(entites_juridiques_flux_finess["datefermeture"].isna()) ]

def extrais_les_entites_juridiques_recemment_fermees(
    entites_juridiques_ouvertes: pd.DataFrame,
    entite_juridiques_sauvegardees: pd.DataFrame
    ) -> pd.DataFrame:
    nouveaux = entites_juridiques_ouvertes['nofiness']
    sauvegardes = entite_juridiques_sauvegardees['numero_finess_entite_juridique']
    # Filtrer les objets à supprimer
    objets_a_supprimer = entite_juridiques_sauvegardees[~sauvegardes.isin(nouveaux)]
    return objets_a_supprimer.reset_index(drop=True)

def categoriser(statut_niv1, statut_niv2):
    if statut_niv1 == "1000":
        return CATEGORISATION["1000"]
    elif statut_niv1 == "3000":
        return CATEGORISATION["3000"]
    elif statut_niv2 == "2100":
        return CATEGORISATION["2100"]
    elif statut_niv2 == "2200":
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

def transform_les_entites_juridiques(entites_juridiques: pd.DataFrame) -> pd.DataFrame:
    entites_juridiques_filtrees = entites_juridiques.drop(columns=['statutJuridiqueNiv2', 'statutJuridiqueNiv1'])
    return entites_juridiques_filtrees

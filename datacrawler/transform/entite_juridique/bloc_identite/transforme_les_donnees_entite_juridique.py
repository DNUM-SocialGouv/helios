import pandas as pd

def conserve_les_entites_juridiques_ouvertes(
    entites_juridiques_flux_finess: pd.DataFrame
) -> pd.DataFrame:
    return entites_juridiques_flux_finess[(entites_juridiques_flux_finess["datefermeture"].isna()) ]

def extrais_les_entites_juridiques_recemment_fermees(
    entites_juridiques_ouvertes: pd.DataFrame,
    entite_juridiques_sauvegardees: pd.DataFrame
    ) -> pd.DataFrame:
    nouveaux = entites_juridiques_ouvertes[col_name]
    sauvegardes = entite_juridiques_sauvegardees[col_name]  
    # Filtrer les objets à supprimer
    objets_a_supprimer = entite_juridiques_sauvegardees[~sauvegardes.isin(nouveaux)]
    return objets_a_supprimer.reset_index(drop=True)

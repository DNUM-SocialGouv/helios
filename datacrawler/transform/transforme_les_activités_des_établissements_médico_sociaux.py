import logging
from typing import Callable, Dict, List

import pandas as pd

from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.transform.diamant.équivalences_diamant_helios import (
    ColonneHelios,
    colonnes_à_lire_ann_errd_ej_et,
    index_des_activités_médico_sociales,
    équivalences_diamant_helios,
)


def extrais_l_equivalence_des_types_des_colonnes(équivalences: Dict[str, ColonneHelios]) -> Dict[str, type]:
    return {nom_diamant: colonne_diamant["type"] for nom_diamant, colonne_diamant in équivalences.items()}


def extrais_l_equivalence_des_noms_des_colonnes(équivalences: Dict[str, ColonneHelios]) -> Dict[str, str]:
    return {nom_diamant: colonne_diamant["nom"] for nom_diamant, colonne_diamant in équivalences.items()}


def transforme_les_activités_des_établissements_médico_sociaux(
    chemin_du_fichier: str,
    récupère_les_numéros_finess_des_établissements: Callable,
    lis_le_csv: Callable[[str, List[str], Dict[str, type]], pd.DataFrame] = lis_le_fichier_csv,
) -> pd.DataFrame:
    logger = logging.getLogger('Helios')
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_helios)

    contenu = lis_le_csv(chemin_du_fichier, colonnes_à_lire_ann_errd_ej_et, types_des_colonnes)
    logger.info(f'Données diamant ayant {contenu.shape[0]} lignes et {contenu.shape[1]} colonnes')
    logger.info(contenu['Finess'])

    établissements_connus = récupère_les_numéros_finess_des_établissements()
    logger.info(f'{établissements_connus.shape[0]} établissements connus')
    logger.info(f'{établissements_connus}')

    est_dans_finess = contenu["Finess"].isin(établissements_connus["numérofinessÉtablissementterritorial"])
    logger.info(f'{est_dans_finess.sum()} établissements dans FINESS')
    return (
        contenu[est_dans_finess].rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_helios))
        .dropna(subset=index_des_activités_médico_sociales)
        .drop_duplicates(subset=index_des_activités_médico_sociales)
        .set_index(index_des_activités_médico_sociales)
    )

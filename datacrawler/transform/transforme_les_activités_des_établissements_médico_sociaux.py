from typing import Callable, Dict

import pandas as pd

from datacrawler.extract.lecteur_sql import trouve_les_finess_des_établissements_en_base
from datacrawler.transform.diamant.équivalences_diamant_helios import (
    ColonneHelios,
    colonnes_à_lire_ann_errd_ej_et,
    index_des_activités_médico_sociales,
    équivalences_diamant_helios,
)
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv


def extrais_l_equivalence_des_types_des_colonnes(équivalences: Dict[str, ColonneHelios]):
    return {nom_diamant: colonne_diamant["type"] for nom_diamant, colonne_diamant in équivalences.items()}


def extrais_l_equivalence_des_noms_des_colonnes(équivalences: Dict[str, ColonneHelios]):
    return {nom_diamant: colonne_diamant["nom"] for nom_diamant, colonne_diamant in équivalences.items()}


def transforme_les_activités_des_établissements_médico_sociaux(
        chemin_du_fichier: str,
        lis_le_csv: Callable = lis_le_fichier_csv,
        trouve_les_finess_des_établissements: Callable = trouve_les_finess_des_établissements_en_base
) -> pd.DataFrame:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_helios)

    contenu = lis_le_csv(chemin_du_fichier, colonnes_à_lire_ann_errd_ej_et, types_des_colonnes)

    établissements_existants = trouve_les_finess_des_établissements()

    est_dans_finess = contenu['Finess'].isin(établissements_existants['numérofinessÉtablissementterritorial'])
    return (
        contenu[est_dans_finess]
            .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_helios))
            .dropna(subset=index_des_activités_médico_sociales)
            .drop_duplicates(subset=index_des_activités_médico_sociales)
            .set_index(index_des_activités_médico_sociales)
    )

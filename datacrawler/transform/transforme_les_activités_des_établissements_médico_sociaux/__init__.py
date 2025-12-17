from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_de_taux_d_occupation import (
    transforme_les_donnees_ann_errd_ej_et,
    transforme_les_donnees_ann_ca_ej_et
)
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_du_tableau_de_bord_de_la_performance import (
    transforme_les_donnees_ann_ms_tdp_et,
)
from datacrawler.transform.équivalences_diamant_helios import (
    index_des_activités
)

def transforme_les_activites_des_etablissements_medico_sociaux(
    donnees_ann_errd_ej_et: pd.DataFrame,
    donnees_ann_ca_ej_et: pd.DataFrame,
    donnees_ann_ms_tdp_et: pd.DataFrame,
    numeros_finess_des_etablissements_connus: pd.DataFrame,
    logger: Logger
) -> pd.DataFrame:
    les_donnees_occupations = pd.merge(transforme_les_donnees_ann_ca_ej_et(donnees_ann_ca_ej_et, numeros_finess_des_etablissements_connus, logger),
    transforme_les_donnees_ann_errd_ej_et(donnees_ann_errd_ej_et, numeros_finess_des_etablissements_connus, logger),
    on=['annee', 'numero_finess_etablissement_territorial'],
    how='outer',
    validate="many_to_many",
    )
    les_donnees_occupations["taux_occupation_externat"] = les_donnees_occupations['taux_occupation_externat_x'].fillna(
    les_donnees_occupations['taux_occupation_externat_y'])
    les_donnees_occupations["taux_occupation_semi_internat"] = les_donnees_occupations['taux_occupation_semi_internat_x'].fillna(
    les_donnees_occupations['taux_occupation_semi_internat_y'])
    les_donnees_occupations["taux_occupation_internat"] = les_donnees_occupations['taux_occupation_internat_x'].fillna(
    les_donnees_occupations['taux_occupation_internat_y'])
    les_donnees_occupations["taux_occupation_autre"] = les_donnees_occupations['taux_occupation_autre_x'].fillna(
    les_donnees_occupations['taux_occupation_autre_y'])
    les_donnees_occupations["taux_occupation_global"] = les_donnees_occupations['taux_occupation_global_x'].fillna(
    les_donnees_occupations['taux_occupation_global_y'])
    les_donnees_occupations = les_donnees_occupations.drop(columns=['taux_occupation_externat_x', 'taux_occupation_externat_y',
    'taux_occupation_autre_x','taux_occupation_autre_y',
    'taux_occupation_semi_internat_x','taux_occupation_semi_internat_y',
    'taux_occupation_internat_x','taux_occupation_internat_y',
    'taux_occupation_global_x','taux_occupation_global_y'])
    les_donnees_occupations_filtrees = les_donnees_occupations.dropna(
    subset=index_des_activités).drop_duplicates(subset=index_des_activités).set_index(index_des_activités)
    return les_donnees_occupations_filtrees.join(
        transforme_les_donnees_ann_ms_tdp_et(donnees_ann_ms_tdp_et, numeros_finess_des_etablissements_connus, logger), how="outer", on=None)

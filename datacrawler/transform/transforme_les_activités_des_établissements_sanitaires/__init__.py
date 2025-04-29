from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_du_nombre_de_passages_aux_urgences import (
    transforme_les_données_ann_rpu,
)
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_du_nombre_de_journées_et_séjours import (
    transforme_les_données_men_pmsi_annuel,
)

from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_donnees_du_nombre_de_journees_usld import (
    transforme_les_donnees_usld,
)


def transforme_les_activites_des_etablissements_sanitaires(
    donnees_men_pmsi_annuel: pd.DataFrame, 
    donnees_ann_rpu: pd.DataFrame, 
    donnees_ann_sae_activite: pd.DataFrame, 
    numeros_finess_des_etablissements_connus: pd.DataFrame,
    logger: Logger
) -> pd.DataFrame:
    return transforme_les_données_men_pmsi_annuel(donnees_men_pmsi_annuel, numeros_finess_des_etablissements_connus, logger).join(
        transforme_les_données_ann_rpu(donnees_ann_rpu, numeros_finess_des_etablissements_connus, logger), how="outer"
    ).join(
        transforme_les_donnees_usld(donnees_ann_sae_activite, numeros_finess_des_etablissements_connus, logger), how="outer"
    )

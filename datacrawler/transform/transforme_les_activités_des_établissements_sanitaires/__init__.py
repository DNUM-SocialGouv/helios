from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_ann_rpu import transforme_les_données_ann_rpu
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_men_pmsi_annuel import (
    transforme_les_données_men_pmsi_annuel,
)


def transforme_les_activités_des_établissements_sanitaires(
    données_men_pmsi_annuel: pd.DataFrame, données_ann_rpu: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    return fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et(
        transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_ann_rpu(données_ann_rpu, numéros_finess_des_établissements_connus, logger),
    )

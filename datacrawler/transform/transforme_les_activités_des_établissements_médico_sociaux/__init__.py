from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.fusionne_les_données_ann_errd_ej_et_avec_ann_ms_tdp_et import (
    fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et,
)
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_ann_errd_ej_et import (
    transforme_les_données_ann_errd_ej_et,
)
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_ann_ms_tdp_et import (
    transforme_les_données_ann_ms_tdp_et,
)


def transforme_les_activités_des_établissements_médico_sociaux(
    données_ann_errd_ej_et: pd.DataFrame, données_ann_ms_tdp_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    return fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et(
        transforme_les_données_ann_errd_ej_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_ann_ms_tdp_et(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, logger),
    )

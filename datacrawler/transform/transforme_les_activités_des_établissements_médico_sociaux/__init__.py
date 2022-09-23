from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_de_taux_d_occupation import (
    transforme_les_données_ann_errd_ej_et,
)
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_du_tableau_de_bord_de_la_performance import (
    transforme_les_données_ann_ms_tdp_et,
)


def transforme_les_activités_des_établissements_médico_sociaux(
    données_ann_errd_ej_et: pd.DataFrame, données_ann_ms_tdp_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    return transforme_les_données_ann_errd_ej_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, logger).join(
        transforme_les_données_ann_ms_tdp_et(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, logger), how="outer"
    )

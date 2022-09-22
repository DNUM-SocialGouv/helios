from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux import (
    transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux,
)
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_données_ann_ca_ej_et_budget_et_finances import (
    transforme_les_données_ann_ca_ej_et_budget_finances,
)
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_budget_et_finances


def transforme(données_ann_errd_ej_et: pd.DataFrame, données_ann_ca_ej_et: pd.DataFrame, numéros_finess_connus: pd.DataFrame, logger: Logger) -> pd.DataFrame:
    indicateurs_budgétaires_des_établissements_errd = transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
        données_ann_errd_ej_et, numéros_finess_connus, logger
    )
    indicateurs_budgétaires_et_taux_des_établissements_ca = transforme_les_données_ann_ca_ej_et_budget_finances(
        données_ann_ca_ej_et, numéros_finess_connus, logger
    )
    return (
        pd.concat([indicateurs_budgétaires_des_établissements_errd, indicateurs_budgétaires_et_taux_des_établissements_ca], join="outer")
        .drop_duplicates(subset=index_du_bloc_budget_et_finances)
        .set_index(index_du_bloc_budget_et_finances)
    )

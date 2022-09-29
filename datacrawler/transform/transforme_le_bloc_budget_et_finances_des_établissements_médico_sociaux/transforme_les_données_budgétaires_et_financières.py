from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_et_fusionne_les_données_budgétaires_avec_les_taux_des_établissements_errd import (
    transforme_et_fusionne_les_données_budgétaires_errd_avec_les_taux_errd,
)
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_données_budgétaires_et_financières_des_établissements_ca import (
    transforme_les_données_budgétaires_et_financières_des_établissements_ca,
)
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_budget_et_finances


def transforme_les_données_budgétaires_et_financières(
    données_ann_errd_ej_et: pd.DataFrame,
    données_ann_ca_ej_et: pd.DataFrame,
    données_des_dépôts_errd: pd.DataFrame,
    données_ann_errd_ej: pd.DataFrame,
    numéros_finess_connus: pd.DataFrame,
    logger: Logger,
) -> pd.DataFrame:
    indicateurs_budgétaires_et_taux_des_établissements_errd = transforme_et_fusionne_les_données_budgétaires_errd_avec_les_taux_errd(
        données_ann_errd_ej_et, données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_connus, logger
    )
    indicateurs_budgétaires_et_taux_des_établissements_ca = transforme_les_données_budgétaires_et_financières_des_établissements_ca(
        données_ann_ca_ej_et, numéros_finess_connus, logger
    )
    return (
        pd.concat([indicateurs_budgétaires_et_taux_des_établissements_errd, indicateurs_budgétaires_et_taux_des_établissements_ca], join="outer")
        .drop_duplicates(subset=index_du_bloc_budget_et_finances)
        .set_index(index_du_bloc_budget_et_finances)
    )

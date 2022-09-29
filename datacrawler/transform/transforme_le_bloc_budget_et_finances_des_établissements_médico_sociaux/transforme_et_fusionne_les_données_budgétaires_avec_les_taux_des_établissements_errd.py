from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_données_dépenses_et_recettes_des_établissements_errd import (
    transforme_les_données_dépenses_et_recettes_des_établissements_errd,
)
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_taux_des_données_budgétaires_des_établissements_errd import (
    transforme_les_taux_des_données_budgétaires_des_établissements_errd,
)


def transforme_et_fusionne_les_données_budgétaires_errd_avec_les_taux_errd(
    données_ann_errd_ej_et: pd.DataFrame,
    données_des_dépôts_errd: pd.DataFrame,
    données_ann_errd_ej: pd.DataFrame,
    numéros_finess_connus: pd.DataFrame,
    logger: Logger,
) -> pd.DataFrame:
    indicateurs_budgétaires_des_établissements_errd = transforme_les_données_dépenses_et_recettes_des_établissements_errd(
        données_ann_errd_ej_et, numéros_finess_connus, logger
    )

    taux_budgétaires_des_établissements_errd = transforme_les_taux_des_données_budgétaires_des_établissements_errd(
        données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_connus, logger
    )

    return indicateurs_budgétaires_des_établissements_errd.merge(taux_budgétaires_des_établissements_errd, how="outer").assign(cadre_budgetaire="ERRD")

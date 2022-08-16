from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_les_autorisations_des_établissements_médico_sociaux.transforme_les_données_finess_cs1400105 import (
    transforme_les_données_finess_cs1400105,
)


def transforme_les_autorisations_des_établissements_médico_sociaux(
    données_finess_cs1400105: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    return transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, logger)

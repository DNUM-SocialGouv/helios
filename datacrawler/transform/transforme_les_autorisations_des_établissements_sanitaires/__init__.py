from logging import Logger
from typing import Tuple

import pandas as pd

from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_finess_cs1400103 import (
    transforme_les_données_finess_cs1400103,
)
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_finess_cs1400104 import (
    transforme_les_données_finess_cs1400104,
)
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_finess_cs1600101 import (
    transforme_les_données_finess_cs1600101,
)
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_finess_cs1600102 import (
    transforme_les_données_finess_cs1600102,
)


def transforme_les_autorisations_des_établissements_sanitaires(
    données_finess_cs1400103: pd.DataFrame,
    données_finess_cs1400104: pd.DataFrame,
    données_finess_cs1600101: pd.DataFrame,
    données_finess_cs1600102: pd.DataFrame,
    numéros_finess_des_établissements_connus: pd.DataFrame,
    logger: Logger,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    return (
        transforme_les_données_finess_cs1400103(données_finess_cs1400103, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_finess_cs1400104(données_finess_cs1400104, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_finess_cs1600101(données_finess_cs1600101, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_finess_cs1600102(données_finess_cs1600102, numéros_finess_des_établissements_connus, logger),
    )

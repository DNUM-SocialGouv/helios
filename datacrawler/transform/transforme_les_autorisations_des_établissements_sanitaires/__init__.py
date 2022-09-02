from logging import Logger
from typing import Tuple

import pandas as pd

from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_capacités import transforme_les_données_des_capacités
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_des_autorisations import (
    transforme_les_données_des_autorisations,
)
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_des_autres_activités import (
    transforme_les_données_des_autres_activités,
)
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_des_reconnaissances_contractuelles import (
    transforme_les_données_des_reconnaissances_contractuelles,
)
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_des_équipements_matériels_lourds import (
    transforme_les_données_des_équipements_matériels_lourds,
)


def transforme_les_autorisations_des_établissements_sanitaires(
    données_des_autorisations: pd.DataFrame,
    données_des_équipements_matériels_lourds: pd.DataFrame,
    données_des_autres_activités: pd.DataFrame,
    données_des_reconnaissances_contractuelles: pd.DataFrame,
    données_des_capacités: pd.DataFrame,
    numéros_finess_des_établissements_connus: pd.DataFrame,
    logger: Logger,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    return (
        transforme_les_données_des_autorisations(données_des_autorisations, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_des_équipements_matériels_lourds(données_des_équipements_matériels_lourds, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_des_autres_activités(données_des_autres_activités, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_des_reconnaissances_contractuelles(données_des_reconnaissances_contractuelles, numéros_finess_des_établissements_connus, logger),
        transforme_les_données_des_capacités(données_des_capacités, numéros_finess_des_établissements_connus, logger),
    )

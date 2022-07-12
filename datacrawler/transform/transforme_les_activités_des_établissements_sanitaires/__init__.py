from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_men_pmsi_annuel import (
    transforme_les_données_men_pmsi_annuel,
)


def transforme_les_activités_des_établissements_sanitaires(
    données_men_pmsi_annuel: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    return transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, logger)

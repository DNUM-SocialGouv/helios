from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_du_nombre_de_passages_aux_urgences import \
    transforme_les_données_ann_rpu
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_du_nombre_de_journées_et_séjours import (
    transforme_les_données_men_pmsi_annuel,
)


def transforme_les_activités_des_établissements_sanitaires(
    données_men_pmsi_annuel: pd.DataFrame, données_ann_rpu: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    return transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, logger).join(
        transforme_les_données_ann_rpu(données_ann_rpu, numéros_finess_des_établissements_connus, logger),
        how="outer"
    )

from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_à_garder_finess_cs1400105,
    index_des_autorisations_médico_sociaux,
    équivalences_finess_cs1400105_helios,
)


def extrais_les_autorisations_toujours_autorisées(données_finess_cs1400105: pd.DataFrame) -> pd.DataFrame:
    return données_finess_cs1400105[données_finess_cs1400105["indsupaut"] == "N"]


def détermine_l_installation_de_l_autorisation(autorisations: pd.DataFrame) -> pd.DataFrame:
    autorisations["est_installee"] = autorisations["est_installee"] == "N"
    return autorisations


def transforme_les_données_finess_cs1400105(
    données_finess_cs1400105: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_finess_cs1400105["nofinesset"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[FINESS] {est_dans_finess.sum()} autorisations sont liées à un ET trouvé en base dans le fichier finess_cs1400105")

    autorisations_toujours_autorisées = (
        extrais_les_autorisations_toujours_autorisées(données_finess_cs1400105[est_dans_finess])[colonnes_à_garder_finess_cs1400105]
        .rename(columns=équivalences_finess_cs1400105_helios)
        .dropna(subset=index_des_autorisations_médico_sociaux)
    )

    return détermine_l_installation_de_l_autorisation(autorisations_toujours_autorisées).set_index(index_des_autorisations_médico_sociaux)

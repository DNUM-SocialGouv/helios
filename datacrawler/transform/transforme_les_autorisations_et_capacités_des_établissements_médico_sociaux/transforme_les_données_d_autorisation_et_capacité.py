from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_finess_helios import (
    colonnes_à_garder_finess_cs1400105,
    index_des_autorisations_médico_sociaux,
    équivalences_finess_cs1400105_helios,
)


def filtrer_les_autorisations(autorisations: pd.DataFrame) -> pd.DataFrame:
    return autorisations[((autorisations["indsupinst"] == "N") | (autorisations["indsupaut"] == "N"))]


def détermine_l_installation_de_l_autorisation(autorisations: pd.DataFrame) -> pd.DataFrame:
    autorisations_avec_installation = autorisations.copy()
    autorisations_avec_installation["est_installee"] = (autorisations["est_installee"] == "N") | autorisations["est_installee"].isna()
    autorisations_avec_installation.drop(columns=["est_autorisee"], inplace=True)
    return autorisations_avec_installation


def transforme_les_données_finess_cs1400105(
    données_finess_cs1400105: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_finess_cs1400105["nofinesset"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[FINESS] {est_dans_finess.sum()} autorisations sont liées à un ET trouvé en base dans le fichier finess_cs1400105")
    autorisationsfiltree = filtrer_les_autorisations(données_finess_cs1400105)
    autorisations = (
        autorisationsfiltree[est_dans_finess]
        .sort_values(by=["indsupinst", "indsupaut"])[colonnes_à_garder_finess_cs1400105]
        .rename(columns=équivalences_finess_cs1400105_helios)
        .drop_duplicates(subset=index_des_autorisations_médico_sociaux, keep="first")
        .dropna(subset=index_des_autorisations_médico_sociaux)
    )

    return détermine_l_installation_de_l_autorisation(autorisations).set_index(index_des_autorisations_médico_sociaux)

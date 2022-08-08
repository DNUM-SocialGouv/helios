from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_activités,
    équivalences_diamant_men_pmsi_annuel_helios,
)


def transforme_les_données_men_pmsi_annuel(
    données_men_pmsi_annuel: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_men_pmsi_annuel["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} activités sont liées à un ET trouvé en base dans le fichier men_pmsi_annuel")

    return (
        données_men_pmsi_annuel[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_men_pmsi_annuel_helios))
        .dropna(subset=index_des_activités)
        .drop_duplicates(subset=index_des_activités)
        .set_index(index_des_activités)
    )

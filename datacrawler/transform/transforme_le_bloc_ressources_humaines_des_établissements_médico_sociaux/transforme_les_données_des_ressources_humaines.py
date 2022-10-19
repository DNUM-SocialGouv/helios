from logging import Logger

import pandas as pd
from numpy import NaN

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_du_bloc_ressources_humaines,
    équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios,
)


def transforme_les_données_des_ressources_humaines(
    données_ann_ms_tdp_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_ann_ms_tdp_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} lignes sont liées à un ET trouvé en base dans le fichier ann_ms_tdp_et")

    return (
        ajoute_le_nombre_d_etp_réalisés(données_ann_ms_tdp_et[est_dans_finess])
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios))
        .dropna(subset=index_du_bloc_ressources_humaines)
        .drop_duplicates(subset=index_du_bloc_ressources_humaines)
        .set_index(index_du_bloc_ressources_humaines)
    )


def ajoute_le_nombre_d_etp_réalisés(données_ressources_humaines: pd.DataFrame) -> pd.DataFrame:
    return données_ressources_humaines.assign(nombre_etp_realises=NaN)

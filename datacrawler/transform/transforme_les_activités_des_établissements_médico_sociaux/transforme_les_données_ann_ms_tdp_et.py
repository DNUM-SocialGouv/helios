from logging import Logger
from typing import Dict, cast

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_activités,
    équivalences_diamant_ann_ms_tdp_et_helios,
)


def récupère_le_taux_de_réalisation_des_établissements(données_ann_ms_tdp_et: pd.DataFrame) -> pd.DataFrame:
    def choisis_le_taux_de_réalisation_de_l_activité(ligne: Dict) -> float:
        return (
            ligne["Taux de réalisation de lactivité CAMSP et CMPP"]
            if pd.isna(ligne["Taux de réalisation de lactivité Tout ESMS (Hors services CAMSP et CMPP)"])
            else ligne["Taux de réalisation de lactivité Tout ESMS (Hors services CAMSP et CMPP)"]
        )

    taux_realisation_activite = cast(pd.Series, données_ann_ms_tdp_et.apply(choisis_le_taux_de_réalisation_de_l_activité, axis=1)).rename(
        "taux_realisation_activite"
    )

    return données_ann_ms_tdp_et.join(taux_realisation_activite).drop(
        columns=["Taux de réalisation de lactivité Tout ESMS (Hors services CAMSP et CMPP)", "Taux de réalisation de lactivité CAMSP et CMPP"]
    )


def transforme_les_données_ann_ms_tdp_et(
    données_ann_ms_tdp_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_ann_ms_tdp_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} activités sont liées à un ET trouvé en base dans le fichier ann_ms_tdp_et")

    return (
        récupère_le_taux_de_réalisation_des_établissements(données_ann_ms_tdp_et[est_dans_finess])
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_ms_tdp_et_helios))
        .dropna(subset=index_des_activités)
        .drop_duplicates(subset=index_des_activités)
        .set_index(index_des_activités)
    )

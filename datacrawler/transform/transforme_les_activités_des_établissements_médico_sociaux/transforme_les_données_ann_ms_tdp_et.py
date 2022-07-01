from logging import Logger

import pandas as pd

from datacrawler.transform.diamant.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_activités_médico_sociales,
    équivalences_diamant_ann_ms_tdp_et_helios,
)


def récupère_le_taux_de_réalisation_des_établissements(données_ann_ms_tdp_et: pd.DataFrame) -> pd.DataFrame:
    def choisis_le_taux_de_réalisation_de_l_activité(ligne) -> float:
        return (
            ligne["Taux de réalisation de lactivité CAMSP et CMPP"]
            if pd.isna(ligne["Taux de réalisation de lactivité Tout ESMS (Hors services CAMSP et CMPP)"])
            else ligne["Taux de réalisation de lactivité Tout ESMS (Hors services CAMSP et CMPP)"]
        )

    données_ann_ms_tdp_et_avec_taux_réalisation_activité = données_ann_ms_tdp_et.copy()
    données_ann_ms_tdp_et_avec_taux_réalisation_activité["taux_realisation_activite"] = données_ann_ms_tdp_et.apply(
        choisis_le_taux_de_réalisation_de_l_activité, axis=1
    )

    return données_ann_ms_tdp_et_avec_taux_réalisation_activité.drop(
        columns=["Taux de réalisation de lactivité Tout ESMS (Hors services CAMSP et CMPP)", "Taux de réalisation de lactivité CAMSP et CMPP"]
    )


def transforme_les_données_ann_ms_tdp_et(
    données_ann_ms_tdp_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_ann_ms_tdp_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"{est_dans_finess.sum()} activités liées à un ET trouvé en base dans le fichier ann_ms_tdp_et")

    return (
        récupère_le_taux_de_réalisation_des_établissements(données_ann_ms_tdp_et[est_dans_finess])
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_ms_tdp_et_helios))
        .dropna(subset=index_des_activités_médico_sociales)
        .drop_duplicates(subset=index_des_activités_médico_sociales)
        .set_index(index_des_activités_médico_sociales)
    )

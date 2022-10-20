from logging import Logger

import pandas as pd

from datacrawler.transform.transforme_le_bloc_ressources_humaines_des_établissements_médico_sociaux.transforme_le_nombre_d_etp_realises import (
    fusionne_le_nombre_d_etp_réalisés_des_établissements_errd_et_ca,
)
from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_du_bloc_ressources_humaines,
    équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios,
)


def transforme_les_données_des_ressources_humaines(
    données_ann_ms_tdp_et: pd.DataFrame,
    données_ann_errd_ej_et: pd.DataFrame,
    données_ann_ca_ej_et: pd.DataFrame,
    numéros_finess_des_établissements_connus: pd.DataFrame,
    logger: Logger,
) -> pd.DataFrame:
    nombre_d_etp_réalisés_des_établissements = fusionne_le_nombre_d_etp_réalisés_des_établissements_errd_et_ca(
        données_ann_errd_ej_et, données_ann_ca_ej_et, numéros_finess_des_établissements_connus, logger
    )
    données_des_taux_d_absentéismes = transforme_les_données_des_taux_d_absentéismes(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, logger)

    return données_des_taux_d_absentéismes.merge(nombre_d_etp_réalisés_des_établissements, how="outer").set_index(index_du_bloc_ressources_humaines)


def transforme_les_données_des_taux_d_absentéismes(
    données_ann_ms_tdp_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_ann_ms_tdp_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} lignes sont liées à un ET trouvé en base dans le fichier ann_ms_tdp_et")

    return (
        données_ann_ms_tdp_et[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios))
        .dropna(subset=index_du_bloc_ressources_humaines)
        .drop_duplicates(subset=index_du_bloc_ressources_humaines)
    )

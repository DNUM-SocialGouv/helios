from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_du_bloc_ressources_humaines,
    équivalences_diamant_ann_ca_ej_et_ressources_humaines_helios,
    équivalences_diamant_ann_errd_ej_et_ressources_humaines_helios,
)


def fusionne_le_nombre_d_etp_réalisés_des_établissements_errd_et_ca(
    données_ann_errd_ej_et: pd.DataFrame, données_ann_ca_ej_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    nombre_d_etp_réalisés_des_établissements_errd = transforme_le_nombre_d_etp_réalisés_des_établissements_errd(
        données_ann_errd_ej_et, numéros_finess_des_établissements_connus, logger
    )
    nombre_d_etp_réalisés_des_établissements_ca = transforme_le_nombre_d_etp_réalisés_des_établissements_ca(
        données_ann_ca_ej_et, numéros_finess_des_établissements_connus, logger
    )

    return pd.concat([nombre_d_etp_réalisés_des_établissements_errd, nombre_d_etp_réalisés_des_établissements_ca], join="outer").drop_duplicates(
        subset=index_du_bloc_ressources_humaines
    )


def transforme_le_nombre_d_etp_réalisés_des_établissements_errd(
    données_ann_errd_ej_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_ann_errd_ej_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} lignes sont liées à un ET trouvé en base dans le fichier ann_errd_ej_et")

    return (
        données_ann_errd_ej_et[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_errd_ej_et_ressources_humaines_helios))
        .dropna()
        .drop_duplicates(subset=index_du_bloc_ressources_humaines)
    )


def transforme_le_nombre_d_etp_réalisés_des_établissements_ca(
    données_ann_ca_ej_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_ann_ca_ej_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} lignes sont liées à un ET trouvé en base dans le fichier ann_ca_ej_et")

    return (
        données_ann_ca_ej_et[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_ca_ej_et_ressources_humaines_helios))
        .dropna()
        .drop_duplicates(subset=index_du_bloc_ressources_humaines)
    )

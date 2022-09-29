from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_du_bloc_budget_et_finances,
    équivalences_diamant_ann_errd_ej_bloc_budget_et_finances_helios,
    équivalences_diamant_per_errd_eprd_bloc_budget_et_finances_helios,
)


def transforme_les_taux_des_données_budgétaires_des_établissements_errd(
    données_des_dépôts_errd: pd.DataFrame, données_ann_errd_ej: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    données_budgétaires_par_établissement = (
        données_des_dépôts_errd.merge(données_ann_errd_ej.dropna(subset=["Id Dépôt"]), on="Id Dépôt", how="right", suffixes=("_x", ""))
        .drop(["Année_x", "Id Dépôt"], axis=1)
        .rename(
            columns=extrais_l_equivalence_des_noms_des_colonnes(
                {
                    **équivalences_diamant_ann_errd_ej_bloc_budget_et_finances_helios,
                    **équivalences_diamant_per_errd_eprd_bloc_budget_et_finances_helios,
                }
            )
        )
    )
    est_dans_finess = données_budgétaires_par_établissement["numero_finess_etablissement_territorial"].isin(
        numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"]
    )

    données_budgétaires_par_établissement_connus = données_budgétaires_par_établissement[est_dans_finess]
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} lignes budget et finances sont liées à un ET trouvé en base dans le fichier ann_errd_ej")

    données_budgétaires_complétées_par_établissement = données_budgétaires_par_établissement_connus.groupby(index_du_bloc_budget_et_finances).ffill()
    données_budgétaires_complétées_par_établissement[["numero_finess_etablissement_territorial", "annee"]] = données_budgétaires_par_établissement_connus[
        ["numero_finess_etablissement_territorial", "annee"]
    ]

    return données_budgétaires_complétées_par_établissement.drop_duplicates(index_du_bloc_budget_et_finances, keep="last")

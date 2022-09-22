from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_du_bloc_budget_et_finances,
    équivalences_diamant_ann_ca_ej_et_bloc_budget_et_finances_helios,
)


def transforme_les_données_budgétaires_et_financières_des_établissements_ca(
    données_du_fichier_ann_ca_ej_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = données_du_fichier_ann_ca_ej_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} lignes budget et finances sont liées à un ET trouvé en base dans le fichier ann_errd_ej_et")

    return (
        données_du_fichier_ann_ca_ej_et[est_dans_finess]
        .apply(ajoute_le_cadre_budgétaire, axis=1)
        .apply(choisis_le_résultat_net_comptable, axis=1)
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_ca_ej_et_bloc_budget_et_finances_helios))
        .dropna(subset=index_du_bloc_budget_et_finances)
        .drop_duplicates(subset=index_du_bloc_budget_et_finances)
    )


def choisis_le_résultat_net_comptable(ligne: pd.Series) -> pd.Series:
    ligne_modifiée = ligne.copy()
    ligne_modifiée["resultat_net_comptable"] = (
        ligne["MS Résultat net comptable CA PA"] if pd.isna(ligne["MS Résultat net comptable CA PH"]) else ligne["MS Résultat net comptable CA PH"]
    )
    return ligne_modifiée.drop(["MS Résultat net comptable CA PH", "MS Résultat net comptable CA PA"])


def ajoute_le_cadre_budgétaire(ligne: pd.Series) -> pd.Series:
    ligne_modifiée = ligne.copy()
    ligne_modifiée["cadre_budgetaire"] = "CA_PA" if pd.isna(ligne["MS Résultat net comptable CA PH"]) else "CA_PH"
    return ligne_modifiée

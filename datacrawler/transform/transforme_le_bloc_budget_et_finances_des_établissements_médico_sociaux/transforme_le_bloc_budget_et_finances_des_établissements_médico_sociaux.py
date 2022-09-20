from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import \
    équivalences_diamant_ann_errd_ej_et_bloc_budget_et_finances_helios, extrais_l_equivalence_des_noms_des_colonnes, \
    index_du_bloc_budget_et_finances


def transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
    données_ann_errd_ej_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> None:
    est_dans_finess = données_ann_errd_ej_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} lignes budget et finances sont liées à un ET trouvé en base dans le fichier ann_errd_ej_et")

    return (
        données_ann_errd_ej_et[est_dans_finess]
            .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_errd_ej_et_bloc_budget_et_finances_helios))
            .dropna(subset=index_du_bloc_budget_et_finances)
            .drop_duplicates(subset=index_du_bloc_budget_et_finances)
            .set_index(index_du_bloc_budget_et_finances)
            .apply(convertis_la_contribution_frais_de_siège_groupement_en_valuer_positive, axis=1)
    )

def convertis_la_contribution_frais_de_siège_groupement_en_valuer_positive(line: pd.Series):
    modified_line = line.copy()
    modified_line["contribution_frais_de_siege_groupement"] = - modified_line["contribution_frais_de_siege_groupement"]
    return modified_line

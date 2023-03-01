import pandas as pd

from datacrawler import filtre_les_données_sur_les_n_dernières_années, \
    NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_SANITAIRES
from datacrawler.transform.équivalences_diamant_helios import extrais_l_equivalence_des_noms_des_colonnes, \
    équivalences_diamant_quo_san_finance_buget_finance_helios, index_du_bloc_budget_et_finances_entite_juridique


def transform_les_donnees_budget_finance_entite_juridique(données_quo_san_finance: pd.DataFrame,
                                                          numéros_finess_des_établissements_connus: list) -> pd.DataFrame:
    est_dans_finess = données_quo_san_finance["Finess EJ"].isin(numéros_finess_des_établissements_connus)
    données_dernieres_5_annees = filtre_les_données_sur_les_n_dernières_années(
        données_quo_san_finance, NOMBRE_D_ANNÉES_MAX_D_ANTÉRIORITÉ_DES_DONNÉES_SANITAIRES
    )
    return (données_dernieres_5_annees[est_dans_finess]
            .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_quo_san_finance_buget_finance_helios))
            .set_index(index_du_bloc_budget_et_finances_entite_juridique)
            )


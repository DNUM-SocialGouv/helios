import pandas as pd
from freezegun import freeze_time

from datacrawler.transform.entite_juridique.budget_finance.transforme_les_donnees_budget_finance_entite_juridique import (
    transform_les_donnees_budget_finance_entite_juridique,
)
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_budget_et_finances_entite_juridique


class TestTransformeDonnesBudgetFinanceEntiteJuridque:
    @freeze_time("2023-01-01")
    def test_lire_et_renom_les_colonnes_de_quo_san_finance(self) -> None:
        # GIVEN
        quo_san_finance_dataframe = pd.DataFrame(
            {
                "Finess EJ": ["010008407"],
                "Année": [2022],
                "Dépenses Titre I Budget global": [-100.00],
                "Dépenses Titre II Budget global": [-200.00],
                "Dépenses Titre III Budget global": [-300.00],
                "Dépenses Titre IV Budget global": [-400.00],
                "Recettes Titre I Budget global": [100.00],
                "Recettes Titre II Budget global": [200.00],
                "Recettes Titre III Budget global": [300.00],
                "Recettes Titre IV Budget global": [400.00],
                "Dépenses Titre I Budget H": [-100.00],
                "Dépenses Titre II Budget H": [-200.00],
                "Dépenses Titre III Budget H": [-300.00],
                "Dépenses Titre IV Budget H": [-400.00],
                "Recettes Titre I Budget H": [100.00],
                "Recettes Titre II Budget H": [200.00],
                "Recettes Titre III Budget H": [300.00],
                "SAN Résultat net comptable": [0.01],
                "SAN Taux de CAF nette": [0.20],
                "Ratio de dépendance financière": [0.10],
            }
        )

        quo_san_finance_attendus = pd.DataFrame(
            {
                "numero_finess_entite_juridique": ["010008407"],
                "annee": [2022],
                "depenses_titre_i_global": [-100.00],
                "depenses_titre_ii_global": [-200.00],
                "depenses_titre_iii_global": [-300.00],
                "depenses_titre_iv_global": [-400.00],
                "recettes_titre_i_global": [100.00],
                "recettes_titre_ii_global": [200.00],
                "recettes_titre_iii_global": [300.00],
                "recettes_titre_iv_global": [400.00],
                "depenses_titre_i_h": [-100.00],
                "depenses_titre_ii_h": [-200.00],
                "depenses_titre_iii_h": [-300.00],
                "depenses_titre_iv_h": [-400.00],
                "recettes_titre_i_h": [100.00],
                "recettes_titre_ii_h": [200.00],
                "recettes_titre_iii_h": [300.00],
                "resultat_net_comptable_san": [0.01],
                "taux_de_caf_nette_san": [0.20],
                "ratio_dependance_financiere": [0.10],
            }
        ).set_index(index_du_bloc_budget_et_finances_entite_juridique)

        ej_connu = pd.DataFrame({"numero_finess_entite_juridique": ["010008407"]})

        # WHEN
        resultat = transform_les_donnees_budget_finance_entite_juridique(quo_san_finance_dataframe, ej_connu)

        # THEN
        pd.testing.assert_frame_equal(resultat, quo_san_finance_attendus)

    @freeze_time("2023-01-01")
    def test_prendre_la_donnee_pour_la_dernier_5_annees(self) -> None:
        # GIVEN
        quo_san_finance_dataframe = pd.DataFrame(
            {
                "Finess EJ": ["010008407", "010008407", "010008407"],
                "Année": [2022, 2018, 2017],
                "Dépenses Titre I Budget global": [-100.00, -200.00, -500.00],
                "Dépenses Titre II Budget global": [-200.00, -200.00, -500.00],
                "Dépenses Titre III Budget global": [-300.00, -200.00, -500.00],
                "Dépenses Titre IV Budget global": [-400.00, -200.00, -500.00],
                "Recettes Titre I Budget global": [100.00, 100.00, 100.00],
                "Recettes Titre II Budget global": [200.00, 100.00, 100.00],
                "Recettes Titre III Budget global": [300.00, 100.00, 100.00],
                "Recettes Titre IV Budget global": [400.00, 100.00, 100.00],
                "Dépenses Titre I Budget H": [-100.00, -200.00, -500.00],
                "Dépenses Titre II Budget H": [-200.00, -200.00, -500.00],
                "Dépenses Titre III Budget H": [-300.00, -200.00, -500.00],
                "Dépenses Titre IV Budget H": [-400.00, -200.00, -500.00],
                "Recettes Titre I Budget H": [100.00, 100.00, 100.00],
                "Recettes Titre II Budget H": [200.00, 100.00, 100.00],
                "Recettes Titre III Budget H": [300.00, 100.00, 100.00],
                "SAN Résultat net comptable": [0.01, 0.02, 0.03],
                "SAN Taux de CAF nette": [0.20, 0.10, 0.30],
                "Ratio de dépendance financière": [0.10, 0.01, 0.01],
            }
        )

        quo_san_finance_attendus = pd.DataFrame(
            {
                "numero_finess_entite_juridique": ["010008407", "010008407"],
                "annee": [2022, 2018],
                "depenses_titre_i_global": [-100.00, -200.00],
                "depenses_titre_ii_global": [-200.00, -200.00],
                "depenses_titre_iii_global": [-300.00, -200.00],
                "depenses_titre_iv_global": [-400.00, -200.00],
                "recettes_titre_i_global": [100.00, 100.00],
                "recettes_titre_ii_global": [200.00, 100.00],
                "recettes_titre_iii_global": [300.00, 100.00],
                "recettes_titre_iv_global": [400.00, 100.00],
                "depenses_titre_i_h": [-100.00, -200.00],
                "depenses_titre_ii_h": [-200.00, -200.00],
                "depenses_titre_iii_h": [-300.00, -200.00],
                "depenses_titre_iv_h": [-400.00, -200.00],
                "recettes_titre_i_h": [100.00, 100.00],
                "recettes_titre_ii_h": [200.00, 100.00],
                "recettes_titre_iii_h": [300.00, 100.00],
                "resultat_net_comptable_san": [0.01, 0.02],
                "taux_de_caf_nette_san": [0.20, 0.10],
                "ratio_dependance_financiere": [0.10, 0.01],
            }
        ).set_index(index_du_bloc_budget_et_finances_entite_juridique)

        ej_connu = pd.DataFrame({"numero_finess_entite_juridique": ["010008407"]})

        # WHEN
        resultat = transform_les_donnees_budget_finance_entite_juridique(quo_san_finance_dataframe, ej_connu)

        # THEN
        pd.testing.assert_frame_equal(resultat, quo_san_finance_attendus)

    @freeze_time("2023-01-01")
    def test_prendre_la_donnee_que_pour_les_finess_connus(self) -> None:
        # GIVEN
        quo_san_finance_dataframe = pd.DataFrame(
            {
                "Finess EJ": ["010008407", "010008407", "123456789"],
                "Année": [2022, 2018, 2017],
                "Dépenses Titre I Budget global": [-100.00, -200.00, -500.00],
                "Dépenses Titre II Budget global": [-200.00, -200.00, -500.00],
                "Dépenses Titre III Budget global": [-300.00, -200.00, -500.00],
                "Dépenses Titre IV Budget global": [-400.00, -200.00, -500.00],
                "Recettes Titre I Budget global": [100.00, 100.00, 100.00],
                "Recettes Titre II Budget global": [200.00, 100.00, 100.00],
                "Recettes Titre III Budget global": [300.00, 100.00, 100.00],
                "Recettes Titre IV Budget global": [400.00, 100.00, 100.00],
                "Dépenses Titre I Budget H": [-100.00, -200.00, -500.00],
                "Dépenses Titre II Budget H": [-200.00, -200.00, -500.00],
                "Dépenses Titre III Budget H": [-300.00, -200.00, -500.00],
                "Dépenses Titre IV Budget H": [-400.00, -200.00, -500.00],
                "Recettes Titre I Budget H": [100.00, 100.00, 100.00],
                "Recettes Titre II Budget H": [200.00, 100.00, 100.00],
                "Recettes Titre III Budget H": [300.00, 100.00, 100.00],
                "SAN Résultat net comptable": [0.01, 0.02, 0.03],
                "SAN Taux de CAF nette": [0.20, 0.10, 0.30],
                "Ratio de dépendance financière": [0.10, 0.01, 0.01],
            }
        )

        quo_san_finance_attendus = pd.DataFrame(
            {
                "numero_finess_entite_juridique": ["010008407", "010008407"],
                "annee": [2022, 2018],
                "depenses_titre_i_global": [-100.00, -200.00],
                "depenses_titre_ii_global": [-200.00, -200.00],
                "depenses_titre_iii_global": [-300.00, -200.00],
                "depenses_titre_iv_global": [-400.00, -200.00],
                "recettes_titre_i_global": [100.00, 100.00],
                "recettes_titre_ii_global": [200.00, 100.00],
                "recettes_titre_iii_global": [300.00, 100.00],
                "recettes_titre_iv_global": [400.00, 100.00],
                "depenses_titre_i_h": [-100.00, -200.00],
                "depenses_titre_ii_h": [-200.00, -200.00],
                "depenses_titre_iii_h": [-300.00, -200.00],
                "depenses_titre_iv_h": [-400.00, -200.00],
                "recettes_titre_i_h": [100.00, 100.00],
                "recettes_titre_ii_h": [200.00, 100.00],
                "recettes_titre_iii_h": [300.00, 100.00],
                "resultat_net_comptable_san": [0.01, 0.02],
                "taux_de_caf_nette_san": [0.20, 0.10],
                "ratio_dependance_financiere": [0.10, 0.01],
            }
        ).set_index(index_du_bloc_budget_et_finances_entite_juridique)

        ej_connu = pd.DataFrame({"numero_finess_entite_juridique": ["010008407"]})

        # WHEN
        resultat = transform_les_donnees_budget_finance_entite_juridique(quo_san_finance_dataframe, ej_connu)

        # THEN
        pd.testing.assert_frame_equal(resultat, quo_san_finance_attendus)

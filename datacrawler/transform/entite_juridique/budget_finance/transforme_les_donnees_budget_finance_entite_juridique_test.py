import pandas as pd
from freezegun import freeze_time

from datacrawler.transform.entite_juridique.budget_finance.transforme_les_donnees_budget_finance_entite_juridique import \
    transform_les_donnees_budget_finance_entite_juridique
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_budget_et_finances_entite_juridique


class TestTransformeDonnesBudgetFinanceEntiteJuridque:
    @freeze_time("2023-01-01")
    def test_lire_et_renom_les_colonnes_de_quo_san_finance(self) -> None:
        # GIVEN
        quo_san_finance_dataframe = pd.DataFrame({
            "Finess EJ": ["010008407"],
            "Année": [2022],
            "Dépenses Titre I Budget global": ["38315470.489920005"]
        })

        quo_san_finance_attendus = pd.DataFrame({
            "numero_finess_entite_juridique": ["010008407"],
            "annee": [2022],
            "depenses_titre_i_global": ["38315470.489920005"]
        }).set_index(index_du_bloc_budget_et_finances_entite_juridique)

        ej_connu = ["010008407"]

        # WHEN
        resultat = transform_les_donnees_budget_finance_entite_juridique(quo_san_finance_dataframe, ej_connu)

        # THEN
        pd.testing.assert_frame_equal(resultat, quo_san_finance_attendus)

    @freeze_time("2023-01-01")
    def test_prendre_la_donnee_pour_la_dernier_5_annees(self) -> None:
        # GIVEN
        quo_san_finance_dataframe = pd.DataFrame({
            "Finess EJ": ["010008407","010008407", "010008407"],
            "Année": [2022, 2018, 2017],
            "Dépenses Titre I Budget global": ["38315470.489920005", "200.00", "500.00"]
        })

        quo_san_finance_attendus = pd.DataFrame({
            "numero_finess_entite_juridique": ["010008407","010008407"],
            "annee": [2022, 2018],
            "depenses_titre_i_global": ["38315470.489920005", "200.00"]
        }).set_index(index_du_bloc_budget_et_finances_entite_juridique)

        ej_connu = ["010008407"]

        # WHEN
        resultat = transform_les_donnees_budget_finance_entite_juridique(quo_san_finance_dataframe, ej_connu)

        # THEN
        pd.testing.assert_frame_equal(resultat, quo_san_finance_attendus)

    @freeze_time("2023-01-01")
    def test_prendre_la_donnee_que_pour_les_finess_connus(self) -> None:
        # GIVEN
        quo_san_finance_dataframe = pd.DataFrame({
            "Finess EJ": ["010008407","010008407", "123456789"],
            "Année": [2022, 2018, 2017],
            "Dépenses Titre I Budget global": ["38315470.489920005", "200.00", "500.00"]
        })

        quo_san_finance_attendus = pd.DataFrame({
            "numero_finess_entite_juridique": ["010008407","010008407"],
            "annee": [2022, 2018],
            "depenses_titre_i_global": ["38315470.489920005", "200.00"]
        }).set_index(index_du_bloc_budget_et_finances_entite_juridique)

        ej_connu = ["010008407"]

        # WHEN
        resultat = transform_les_donnees_budget_finance_entite_juridique(quo_san_finance_dataframe, ej_connu)

        # THEN
        pd.testing.assert_frame_equal(resultat, quo_san_finance_attendus)
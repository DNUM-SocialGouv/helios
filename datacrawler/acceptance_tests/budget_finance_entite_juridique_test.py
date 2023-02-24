from datacrawler.ajoute_le_bloc_budget_et_finances_des_entite_juridiques import \
    ajoute_le_bloc_budget_et_finances_des_entite_juridiques
from datacrawler.test_helpers import supprime_les_données_des_tables, base_de_données_test
from datacrawler.test_helpers.config_path import get_absolute_file_path


class TestSauvegardeBudgetFinanceDesEntitesJuridiques:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_l_agrégation_des_activites_sanitaires(self) -> None:
        # GIVEN
        quo_san_finance_file_path = get_absolute_file_path("data_set/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path, base_de_données_test)

        # THEN

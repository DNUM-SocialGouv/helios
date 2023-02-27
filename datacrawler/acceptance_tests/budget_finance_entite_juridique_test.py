import pandas as pd

from datacrawler.ajoute_le_bloc_budget_et_finances_des_entite_juridiques import \
    ajoute_le_bloc_budget_et_finances_des_entite_juridiques
from datacrawler.load.nom_des_tables import TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE
from datacrawler.test_helpers import supprime_les_données_des_tables, base_de_données_test, \
    sauvegarde_une_entité_juridique_en_base
from datacrawler.test_helpers.config_path import get_absolute_file_path
from freezegun import freeze_time


class TestSauvegardeBudgetFinanceDesEntitesJuridiques:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    @freeze_time("2023-01-14")
    def test_sauvegarde_le_bloc_budget_finance_entite_juridique(self) -> None:
        # GIVEN
        quo_san_finance_file_path = get_absolute_file_path("data_set/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path, base_de_données_test)

        # THEN
        bloc_budget_finance_enregistrees = pd.read_sql_table(TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE, base_de_données_test)
        bloc_budget_finance_attendues = pd.DataFrame({
            "annee": 2022,
            "numero_finess_entite_juridique": "010008407",
            "Dépenses Titre I Budget global": "38315470.489920005"

        })

        pd.testing.assert_frame_equal(bloc_budget_finance_enregistrees, bloc_budget_finance_attendues)
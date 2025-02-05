from datetime import date

import pandas as pd
from freezegun import freeze_time

from datacrawler.ajoute_le_bloc_budget_et_finances_des_entite_juridiques import ajoute_le_bloc_budget_et_finances_des_entite_juridiques
from datacrawler.load.nom_des_tables import TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE, FichierSource, TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES
from datacrawler.test_helpers import (
    supprime_les_données_des_tables,
    base_de_données_test,
    sauvegarde_une_entité_juridique_en_base,
    sauvegarde_les_indicateurs_budget_et_finances_entite_juridique_en_base,
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    mocked_logger,
)
from datacrawler.test_helpers.config_path import get_absolute_file_path
from datacrawler.test_helpers.helios_builder import helios_quo_san_finance_budget_builder


class TestSauvegardeBudgetFinanceDesEntitesJuridiques:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    @freeze_time("2023-01-14")
    def test_sauvegarde_le_bloc_budget_finance_entite_juridique(self) -> None:
        # GIVEN
        quo_san_finance_file_path = get_absolute_file_path("data_test/entrée/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path, base_de_données_test, mocked_logger)

        # THEN
        bloc_budget_finance_enregistrees = pd.read_sql(TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE, base_de_données_test)
        bloc_budget_finance_attendues = pd.DataFrame(
            {
                "numero_finess_entite_juridique": ["010008407"],
                "annee": [2019],
                "depenses_titre_i_global": [-6388587.3598799994],
                "depenses_titre_ii_global": [-759828.06984000001],
                "depenses_titre_iii_global": [-3129326.580240001],
                "depenses_titre_iv_global": [-384180.90995999996],
                "recettes_titre_i_global": [5222760.6999600008],
                "recettes_titre_ii_global": [855732.74004000006],
                "recettes_titre_iii_global": [4011375.4700399996],
                "recettes_titre_iv_global": [218494.86995999998],
                "depenses_titre_i_h": [-2897982.9500399996],
                "depenses_titre_ii_h": [-242136.75],
                "depenses_titre_iii_h": [-888301.09020000021],
                "depenses_titre_iv_h": [-349849.98995999998],
                "recettes_titre_i_h": [1927353.7299600004],
                "recettes_titre_ii_h": [164517.59999999998],
                "recettes_titre_iii_h": [2322363.7799999998],
                "resultat_net_comptable_san": [-330217.60992000037],
                "taux_de_caf_nette_san": [-5.7600000000000012e-3],
                "ratio_dependance_financiere": [0.0],
            }
        )

        pd.testing.assert_frame_equal(bloc_budget_finance_enregistrees.sort_index(axis=1), bloc_budget_finance_attendues.sort_index(axis=1))

    @freeze_time("2023-01-14")
    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        numero_finess_existant_en_base = "590000741"

        quo_san_finance_file_path = get_absolute_file_path("data_test/entrée/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")
        sauvegarde_une_entité_juridique_en_base(numero_finess_existant_en_base, base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        sauvegarde_les_indicateurs_budget_et_finances_entite_juridique_en_base(
            pd.DataFrame(
                [
                    helios_quo_san_finance_budget_builder({"numero_finess_entite_juridique": numero_finess_existant_en_base}),
                ]
            ),
            base_de_données_test,
        )

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path, base_de_données_test, mocked_logger)

        # THEN
        bloc_budget_finance_enregistrees = pd.read_sql_query(
            f"SELECT * from {TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE} " f"WHERE numero_finess_entite_juridique = '{numero_finess_existant_en_base}'",
            base_de_données_test,
        )

        assert 0 == len(bloc_budget_finance_enregistrees)

    def test_sauvegarde_les_dates_de_mises_à_jour_de_fichier_quo_san_finance(self) -> None:
        # GIVEN
        quo_san_finance_file_path = get_absolute_file_path("data_test/entrée/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path, base_de_données_test, mocked_logger)

        # THEN
        date_du_fichier_quo_san_finance = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_QUO_SAN_FINANCE.value}'"
        )
        assert date_du_fichier_quo_san_finance.fetchone() == (date(2023, 1, 20), FichierSource.DIAMANT_QUO_SAN_FINANCE.value)

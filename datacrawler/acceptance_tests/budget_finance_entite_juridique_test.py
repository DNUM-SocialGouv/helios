from datetime import date

import pandas as pd
from freezegun import freeze_time

from datacrawler.ajoute_le_bloc_budget_et_finances_des_entite_juridiques import \
    ajoute_le_bloc_budget_et_finances_des_entite_juridiques
from datacrawler.load.nom_des_tables import TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE, FichierSource, \
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES
from datacrawler.test_helpers import supprime_les_données_des_tables, base_de_données_test, \
    sauvegarde_une_entité_juridique_en_base, sauvegarde_les_indicateurs_budget_et_finances_entite_juridique_en_base, \
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, mocked_logger
from datacrawler.test_helpers.config_path import get_absolute_file_path
from datacrawler.test_helpers.helios_builder import helios_quo_san_finance_budget_builder


class TestSauvegardeBudgetFinanceDesEntitesJuridiques:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    @freeze_time("2023-01-14")
    def test_sauvegarde_le_bloc_budget_finance_entite_juridique(self) -> None:
        # GIVEN
        quo_san_finance_file_path = get_absolute_file_path("data_set/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path, base_de_données_test,
                                                                mocked_logger)

        # THEN
        bloc_budget_finance_enregistrees = pd.read_sql(TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE,
                                                             base_de_données_test)
        bloc_budget_finance_attendues = pd.DataFrame({
            "numero_finess_entite_juridique": ["010008407", "010008407", "010008407", "010008407"],
            "annee": [2022, 2021, 2020, 2019],
            "depenses_titre_i_global": [-38315470.489920005, -8855071.9100400023, -39714875.189880006, -6388587.3598799994],
            "depenses_titre_ii_global": [-7262125.2101999987, -1702097.3504400002, -9714938.7098399997, -759828.06984000001],
            "depenses_titre_iii_global": [-6790615.4500799999, -2962020.9200400007, -8957482.4900400005, -3129326.580240001],
            "depenses_titre_iv_global": [-4168425.8000400001, -1049973.68988, -5257981.4698800007, -384180.90995999996],
            "recettes_titre_i_global": [39297655.289999999, 6782078.2599600004, 39941246.860080004, 5222760.6999600008],
            "recettes_titre_ii_global": [4285276.0098000001, 1365243.9400800001, 7469151.2101200018, 855732.74004000006],
            "recettes_titre_iii_global": [11830378.95984, 5859482.2400399987, 15572406.209999997, 4011375.4700399996],
            "recettes_titre_iv_global": [1147590.1700400002, 312202.34003999998, 175225.28976000001, 218494.86995999998],
            "depenses_titre_i_h": [-30646439.360160001, -2048552.5303200001, -32983079.770080004, -2897982.9500399996],
            "depenses_titre_ii_h": [-6752879.9099999983, -363095.84015999996, -9397192.7499599997, -242136.75],
            "depenses_titre_iii_h": [-4136149.9500000002, -1091266.33008, -5860999.4600399993, -888301.09020000021],
            "depenses_titre_iv_h": [-2960018.25, -306963.91992000001, -4707133.2999600004, -349849.98995999998],
            "recettes_titre_i_h": [33641669.91996, 1500318.9999600004, 35412455.59008, 1927353.7299600004],
            "recettes_titre_ii_h": [2968985.1598800002, 165723.65999999997, 5760820.9600800015, 164517.59999999998],
            "recettes_titre_iii_h": [7910023.6198800011, 2042000.8801200003, 11185621.609919997, 2322363.7799999998],
            "resultat_net_comptable_san": [24315.749399994413, -247544.77019999945, -487130.65967999981, -330217.60992000037],
            "taux_de_caf_nette_san": [2.1120000000000003E-2, -9.2399999999999982E-3, 0.00396, -5.7600000000000012E-3],
            "ratio_dependance_financiere": [0.44184000000000007, 0.34164, 0.72671999999999981, 0],
        })

        print(bloc_budget_finance_enregistrees.info())
        print(bloc_budget_finance_attendues.info())

        pd.testing.assert_frame_equal(bloc_budget_finance_enregistrees.sort_index(axis=1),
                                      bloc_budget_finance_attendues.sort_index(axis=1))

    @freeze_time("2023-01-14")
    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        quo_san_finance_file_path = get_absolute_file_path("data_set/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")
        sauvegarde_une_entité_juridique_en_base("590000741", base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        sauvegarde_les_indicateurs_budget_et_finances_entite_juridique_en_base(
            pd.DataFrame(
                [
                    helios_quo_san_finance_budget_builder(
                        {"numero_finess_entite_juridique": "590000741"}),
                ]
            ),
            base_de_données_test,
        )

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path, base_de_données_test,
                                                                mocked_logger)

        # THEN
        bloc_budget_finance_enregistrees = pd.read_sql_query(
            f"SELECT * from {TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE} WHERE numero_finess_entite_juridique = '590000741'",
            base_de_données_test
        )

        assert 0 == len(bloc_budget_finance_enregistrees)

    def test_sauvegarde_les_dates_de_mises_à_jour_de_fichier_quo_san_finance(self) -> None:
        # GIVEN
        quo_san_finance_file_path = get_absolute_file_path("data_set/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path, base_de_données_test,
                                                                mocked_logger)

        # THEN
        date_du_fichier_quo_san_finance = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_QUO_SAN_FINANCE.value}'"
        )
        assert date_du_fichier_quo_san_finance.fetchone() == (
        date(2023, 1, 20), FichierSource.DIAMANT_QUO_SAN_FINANCE.value)

from datetime import date
from unittest.mock import Mock, patch

import pandas as pd
import pytest
from numpy import NaN

import datacrawler
from datacrawler.ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux import ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux
from datacrawler.load.nom_des_tables import TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES, TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL, FichierSource
from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
    base_de_données_test,
    helios_ann_ca_ej_et_budget_et_finances_builder,
    helios_ann_errd_ej_et_budget_et_finances_builder,
    mocked_logger,
    sauvegarde_les_indicateurs_budget_et_finances_en_base,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)


class TestAjouteLeBudgetEtFinancesDesÉtablissementsMédicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_les_données_financières_et_les_taux_de_caf_et_vétusté(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ca_ej_et = "data_set/diamant/ANN_CA_EJ_ET_2022_09_01.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_errd = NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_errd, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_ca_ph = "010002269"
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_ca_ph, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_ca_pa = "010009066"
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_ca_pa, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_errd_ej_et,
            chemin_du_fichier_ann_ca_ej_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        budget_et_finances_attendus = pd.DataFrame(
            {
                "annee": [2018, 2019, 2020, 2021, 2020, 2019, 2018, 2020, 2019],
                "numero_finess_etablissement_territorial": [
                    numéro_finess_établissement_errd,
                    numéro_finess_établissement_errd,
                    numéro_finess_établissement_errd,
                    numéro_finess_établissement_errd,
                    numéro_finess_établissement_ca_ph,
                    numéro_finess_établissement_ca_ph,
                    numéro_finess_établissement_ca_ph,
                    numéro_finess_établissement_ca_pa,
                    numéro_finess_établissement_ca_pa,
                ],
                "contribution_frais_de_siege_groupement": [-22312.0, 0.0, 0.0, 0.0, NaN, NaN, NaN, NaN, NaN],
                "depenses_groupe_i": [
                    -105389.53,
                    -161786,
                    -85102.530010000002,
                    -85102.530010000002,
                    -16901.360000000001,
                    -16062.690000000001,
                    -16114.09,
                    NaN,
                    NaN,
                ],
                "depenses_groupe_ii": [
                    -506251.12999999995,
                    -1222576.5799999998,
                    -442475.08000000007,
                    -442475.08000000007,
                    -464929.67000000004,
                    -482402.46000000008,
                    -522700.76999999996,
                    NaN,
                    NaN,
                ],
                "depenses_groupe_iii": [
                    -88214.989999999991,
                    -8432.5499999999993,
                    -9134.2200000000012,
                    -9134.2200000000012,
                    -51421.190000000002,
                    -44491.319999999992,
                    -44619.190000000002,
                    NaN,
                    NaN,
                ],
                "recettes_groupe_i": [
                    628872.06999999995,
                    1376744.76,
                    543015.84999999998,
                    543015.84999999998,
                    595042.94999999995,
                    588568.68999999994,
                    583376.64000000001,
                    NaN,
                    NaN,
                ],
                "recettes_groupe_ii": [
                    46843.479999999996,
                    23340.290000000001,
                    9410.4599999999991,
                    9410.4599999999991,
                    17724.380000000001,
                    782.12,
                    511.08999999999997,
                    NaN,
                    NaN,
                ],
                "recettes_groupe_iii": [27174.48, 0, 12830, 12830, 16484.099999999999, 26733.739999999998, 24276.970000000001, NaN, NaN],
                "resultat_net_comptable": [
                    3034.3799999998928,
                    7289.9200000003912,
                    28544.479989999854,
                    28544.479989999854,
                    95999.209999999963,
                    73128.079999999842,
                    24730.649999999965,
                    18887.12999999999,
                    11986.649999999994,
                ],
                "cadre_budgetaire": ["ERRD", "ERRD", "ERRD", "ERRD", "CA_PH", "CA_PH", "CA_PH", "CA_PA", "CA_PA"],
                "taux_de_caf": [NaN, NaN, NaN, NaN, 0.16460754444264256, 0.11776359918113584, 0.049315762194766362, NaN, NaN],
                "taux_de_vetuste_construction": [NaN, NaN, NaN, NaN, 0.5319629026790017, 0.51376936316695354, NaN, 0.31154835988672847, NaN],
                "charges": [NaN, NaN, NaN, NaN, NaN, NaN, NaN, -177631.38999999998, -207285.97000000003],
                "produits": [NaN, NaN, NaN, NaN, NaN, NaN, NaN, 196518.51999999999, 219272.62],
            },
        )

        budget_et_finances_enregistrés = pd.read_sql(
            TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
            base_de_données_test,
        )

        pd.testing.assert_frame_equal(budget_et_finances_enregistrés.sort_index(axis=1), budget_et_finances_attendus.sort_index(axis=1))

    def test_sauvegarde_les_dates_de_mises_à_jour_des_indicateurs_budget_et_finances(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ca_ej_et = "data_set/diamant/ANN_CA_EJ_ET_2022_09_01.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_errd = NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_errd, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_ca_ph = "010002269"
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_ca_ph, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_ca_pa = "010009066"
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_ca_pa, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_errd_ej_et,
            chemin_du_fichier_ann_ca_ej_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ca_ej_et = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_CA_EJ_ET.value}'"
        )
        assert date_du_fichier_ann_ca_ej_et.fetchone() == (date(2022, 9, 1), FichierSource.DIAMANT_ANN_CA_EJ_ET.value)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ca_ej_et = "data_set/diamant/ANN_CA_EJ_ET_2022_09_01.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_errd = NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_errd, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_ca_ph = "010002269"
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_ca_ph, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_ca_pa = "010009066"
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_ca_pa, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        sauvegarde_les_indicateurs_budget_et_finances_en_base(
            pd.DataFrame(
                [
                    helios_ann_errd_ej_et_budget_et_finances_builder({"numero_finess_etablissement_territorial": numéro_finess_établissement_errd}),
                    helios_ann_ca_ej_et_budget_et_finances_builder({"numero_finess_etablissement_territorial": numéro_finess_établissement_ca_ph}),
                ]
            ),
            base_de_données_test,
        )

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_errd_ej_et,
            chemin_du_fichier_ann_ca_ej_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        budget_et_finances_attendus = pd.DataFrame(
            {
                "annee": [2018, 2019, 2020, 2021, 2020, 2019, 2018, 2020, 2019],
                "numero_finess_etablissement_territorial": [
                    numéro_finess_établissement_errd,
                    numéro_finess_établissement_errd,
                    numéro_finess_établissement_errd,
                    numéro_finess_établissement_errd,
                    numéro_finess_établissement_ca_ph,
                    numéro_finess_établissement_ca_ph,
                    numéro_finess_établissement_ca_ph,
                    numéro_finess_établissement_ca_pa,
                    numéro_finess_établissement_ca_pa,
                ],
                "contribution_frais_de_siege_groupement": [-22312.0, 0.0, 0.0, 0.0, NaN, NaN, NaN, NaN, NaN],
                "depenses_groupe_i": [
                    -105389.53,
                    -161786,
                    -85102.530010000002,
                    -85102.530010000002,
                    -16901.360000000001,
                    -16062.690000000001,
                    -16114.09,
                    NaN,
                    NaN,
                ],
                "depenses_groupe_ii": [
                    -506251.12999999995,
                    -1222576.5799999998,
                    -442475.08000000007,
                    -442475.08000000007,
                    -464929.67000000004,
                    -482402.46000000008,
                    -522700.76999999996,
                    NaN,
                    NaN,
                ],
                "depenses_groupe_iii": [
                    -88214.989999999991,
                    -8432.5499999999993,
                    -9134.2200000000012,
                    -9134.2200000000012,
                    -51421.190000000002,
                    -44491.319999999992,
                    -44619.190000000002,
                    NaN,
                    NaN,
                ],
                "recettes_groupe_i": [
                    628872.06999999995,
                    1376744.76,
                    543015.84999999998,
                    543015.84999999998,
                    595042.94999999995,
                    588568.68999999994,
                    583376.64000000001,
                    NaN,
                    NaN,
                ],
                "recettes_groupe_ii": [
                    46843.479999999996,
                    23340.290000000001,
                    9410.4599999999991,
                    9410.4599999999991,
                    17724.380000000001,
                    782.12,
                    511.08999999999997,
                    NaN,
                    NaN,
                ],
                "recettes_groupe_iii": [27174.48, 0, 12830, 12830, 16484.099999999999, 26733.739999999998, 24276.970000000001, NaN, NaN],
                "resultat_net_comptable": [
                    3034.3799999998928,
                    7289.9200000003912,
                    28544.479989999854,
                    28544.479989999854,
                    95999.209999999963,
                    73128.079999999842,
                    24730.649999999965,
                    18887.12999999999,
                    11986.649999999994,
                ],
                "cadre_budgetaire": ["ERRD", "ERRD", "ERRD", "ERRD", "CA_PH", "CA_PH", "CA_PH", "CA_PA", "CA_PA"],
                "taux_de_caf": [NaN, NaN, NaN, NaN, 0.16460754444264256, 0.11776359918113584, 0.049315762194766362, NaN, NaN],
                "taux_de_vetuste_construction": [NaN, NaN, NaN, NaN, 0.5319629026790017, 0.51376936316695354, NaN, 0.31154835988672847, NaN],
                "charges": [NaN, NaN, NaN, NaN, NaN, NaN, NaN, -177631.38999999998, -207285.97000000003],
                "produits": [NaN, NaN, NaN, NaN, NaN, NaN, NaN, 196518.51999999999, 219272.62],
            },
        )

        budget_et_finances_enregistrés = pd.read_sql(
            TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
            base_de_données_test,
        )

        pd.testing.assert_frame_equal(budget_et_finances_enregistrés.sort_index(axis=1), budget_et_finances_attendus.sort_index(axis=1))

    @patch.object(datacrawler, "sauvegarde")
    def test_revient_à_la_situation_initiale_si_l_écriture_des_indicateurs_budget_et_finances_échoue(self, mocked_sauvegarde: Mock) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ca_ej_et = "data_set/diamant/ANN_CA_EJ_ET_2022_09_01.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_errd = NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_errd, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_établissement_ca_ph = "010002269"
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_ca_ph, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        indicateurs_budget_et_finances_établissement_errd = helios_ann_errd_ej_et_budget_et_finances_builder(
            {"numero_finess_etablissement_territorial": numéro_finess_établissement_errd}
        )
        indicateurs_budget_et_finances_établissement_ca = helios_ann_ca_ej_et_budget_et_finances_builder(
            {"numero_finess_etablissement_territorial": numéro_finess_établissement_ca_ph}
        )
        sauvegarde_les_indicateurs_budget_et_finances_en_base(
            pd.DataFrame(
                [
                    indicateurs_budget_et_finances_établissement_errd,
                    indicateurs_budget_et_finances_établissement_ca,
                ]
            ),
            base_de_données_test,
        )
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("2020-01-01", FichierSource.DIAMANT_ANN_ERRD_EJ_ET, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("2020-02-02", FichierSource.DIAMANT_ANN_CA_EJ_ET, base_de_données_test)

        mocked_sauvegarde.side_effect = ValueError()

        # WHEN
        with pytest.raises(ValueError):
            ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
                chemin_du_fichier_ann_errd_ej_et,
                chemin_du_fichier_ann_ca_ej_et,
                base_de_données_test,
                mocked_logger,
            )

        budget_et_finances_enregistrés = pd.read_sql(
            TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
            base_de_données_test,
        )

        pd.testing.assert_frame_equal(
            budget_et_finances_enregistrés.sort_index(axis=1),
            pd.DataFrame(
                {
                    "numero_finess_etablissement_territorial": [numéro_finess_établissement_errd, numéro_finess_établissement_ca_ph],
                    "annee": [2018, 2020],
                    "contribution_frais_de_siege_groupement": [-300.0, NaN],
                    "depenses_groupe_i": [-100.0, -100.0],
                    "depenses_groupe_ii": [-200.0, -200.0],
                    "depenses_groupe_iii": [-300.0, -300.0],
                    "recettes_groupe_i": [150.0, 150.0],
                    "recettes_groupe_ii": [150.0, 150.0],
                    "recettes_groupe_iii": [350.0, 350.0],
                    "resultat_net_comptable": [50.0, 50.0],
                    "cadre_budgetaire": ["ERRD", "CA_PH"],
                    "taux_de_caf": [NaN, 0.16],
                    "taux_de_vetuste_construction": [NaN, 0.53],
                    "produits": [NaN, NaN],
                    "charges": [NaN, NaN],
                }
            ).sort_index(axis=1),
        )

        date_du_fichier_de_données_errd = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_de_données_errd.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_de_données_ca = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_CA_EJ_ET.value}'"""
        )
        assert date_du_fichier_de_données_ca.fetchone() == (date(2020, 2, 2), FichierSource.DIAMANT_ANN_CA_EJ_ET.value)

from datetime import date
from unittest.mock import Mock, patch

import pandas as pd
import pytest

import datacrawler
from datacrawler.ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux import ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux
from datacrawler.load.nom_des_tables import TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES, TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL, FichierSource
from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
    base_de_données_test,
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
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_errd_ej_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        budget_et_finances_attendus = pd.DataFrame(
            {
                "annee": [2018, 2019, 2020, 2021],
                "numero_finess_etablissement_territorial": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                ],
                "contribution_frais_de_siege_groupement": [-22312.0, 0.0, 0.0, 0.0],
                "depenses_groupe_i": [-105389.53, -161786, -85102.530010000002, -85102.530010000002],
                "depenses_groupe_ii": [-506251.12999999995, -1222576.5799999998, -442475.08000000007, -442475.08000000007],
                "depenses_groupe_iii": [-88214.989999999991, -8432.5499999999993, -9134.2200000000012, -9134.2200000000012],
                "recettes_groupe_i": [628872.06999999995, 1376744.76, 543015.84999999998, 543015.84999999998],
                "recettes_groupe_ii": [46843.479999999996, 23340.290000000001, 9410.4599999999991, 9410.4599999999991],
                "recettes_groupe_iii": [27174.48, 0, 12830, 12830],
                "resultat_net_comptable": [3034.3799999998928, 7289.9200000003912, 28544.479989999854, 28544.479989999854],
                "cadre_budgetaire": ["ERRD", "ERRD", "ERRD", "ERRD"],
            },
        )

        budget_et_finances_enregistrés = pd.read_sql(
            TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
            base_de_données_test,
        )

        pd.testing.assert_frame_equal(budget_et_finances_enregistrés, budget_et_finances_attendus)

    def test_sauvegarde_la_date_de_mise_à_jour_des_indicateurs_budget_et_finances(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_errd_ej_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_les_indicateurs_budget_et_finances_en_base(
            pd.DataFrame(
                [helios_ann_errd_ej_et_budget_et_finances_builder({"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL})]
            ),
            base_de_données_test,
        )

        # WHEN
        ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_errd_ej_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        budget_et_finances_attendus = pd.DataFrame(
            {
                "annee": [2018, 2019, 2020, 2021],
                "numero_finess_etablissement_territorial": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                ],
                "contribution_frais_de_siege_groupement": [-22312.0, 0.0, 0.0, 0.0],
                "depenses_groupe_i": [-105389.53, -161786, -85102.530010000002, -85102.530010000002],
                "depenses_groupe_ii": [-506251.12999999995, -1222576.5799999998, -442475.08000000007, -442475.08000000007],
                "depenses_groupe_iii": [-88214.989999999991, -8432.5499999999993, -9134.2200000000012, -9134.2200000000012],
                "recettes_groupe_i": [628872.06999999995, 1376744.76, 543015.84999999998, 543015.84999999998],
                "recettes_groupe_ii": [46843.479999999996, 23340.290000000001, 9410.4599999999991, 9410.4599999999991],
                "recettes_groupe_iii": [27174.48, 0, 12830, 12830],
                "resultat_net_comptable": [3034.3799999998928, 7289.9200000003912, 28544.479989999854, 28544.479989999854],
                "cadre_budgetaire": ["ERRD", "ERRD", "ERRD", "ERRD"],
            },
        )

        budget_et_finances_enregistrés = pd.read_sql(
            TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
            base_de_données_test,
        )

        pd.testing.assert_frame_equal(budget_et_finances_enregistrés, budget_et_finances_attendus)

    @patch.object(datacrawler, "sauvegarde")
    def test_revient_à_la_situation_initiale_si_l_écriture_des_indicateurs_budget_et_finances_échoue(self, mocked_sauvegarde: Mock) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        indicateurs_budget_et_finances_existants = pd.DataFrame(
            [helios_ann_errd_ej_et_budget_et_finances_builder({"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL})]
        )
        sauvegarde_les_indicateurs_budget_et_finances_en_base(
            indicateurs_budget_et_finances_existants,
            base_de_données_test,
        )
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("2020-01-01", FichierSource.DIAMANT_ANN_ERRD_EJ_ET, base_de_données_test)

        mocked_sauvegarde.side_effect = ValueError()

        # WHEN
        with pytest.raises(ValueError):
            ajoute_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
                chemin_du_fichier_ann_errd_ej_et,
                base_de_données_test,
                mocked_logger,
            )

        budget_et_finances_enregistrés = pd.read_sql(
            TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
            base_de_données_test,
        )

        pd.testing.assert_frame_equal(budget_et_finances_enregistrés.sort_index(axis=1), indicateurs_budget_et_finances_existants.sort_index(axis=1))

        date_du_fichier_de_données = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_de_données.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

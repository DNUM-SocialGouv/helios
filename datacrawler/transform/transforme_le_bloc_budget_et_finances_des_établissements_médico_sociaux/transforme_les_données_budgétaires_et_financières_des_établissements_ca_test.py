import pandas as pd
from numpy import NaN
from pandas import NA

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.diamant_builder import csv_ann_ca_ej_et_budget_et_finances_builder
from datacrawler.test_helpers.helios_builder import helios_ann_ca_ej_et_budget_et_finances_builder
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_données_budgétaires_et_financières_des_établissements_ca import \
    transforme_les_données_budgétaires_et_financières_des_établissements_ca


class TestTransformeLesDonnéesBudgétairesEtFinancièresDesÉtablissementsCa:
    def test_renomme_les_colonnes(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH")])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_budgétaires_et_financières_des_établissements_ca(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame([helios_ann_ca_ej_et_budget_et_finances_builder()])
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), budget_et_finances_attendu.sort_index(axis=1))

    def test_indique_le_cadre_budgétaire_pout_lequel_le_résultat_net_comptable_est_renseigné(self) -> None:
        # GIVEN
        numéro_finess_ca_ph = "987654321"
        établissement_ca_ph = csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH", {"Finess": numéro_finess_ca_ph})
        numéro_finess_ca_pa = "123456789"
        établissement_ca_pa = csv_ann_ca_ej_et_budget_et_finances_builder("CA_PA", {"Finess": numéro_finess_ca_pa})

        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [
                établissement_ca_ph,
                établissement_ca_pa,
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame({"numero_finess_etablissement_territorial": [numéro_finess_ca_ph, numéro_finess_ca_pa]})

        # WHEN
        données_transformées = transforme_les_données_budgétaires_et_financières_des_établissements_ca(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            [
                helios_ann_ca_ej_et_budget_et_finances_builder({"cadre_budgetaire": "CA_PH", "numero_finess_etablissement_territorial": numéro_finess_ca_ph}),
                helios_ann_ca_ej_et_budget_et_finances_builder(
                    {
                        "numero_finess_etablissement_territorial": numéro_finess_ca_pa,
                        "resultat_net_comptable": 100.0,
                        "charges": -200.0,
                        "produits": 300.0,
                        "recettes_groupe_i": NaN,
                        "recettes_groupe_ii": NaN,
                        "recettes_groupe_iii": NaN,
                        "depenses_groupe_i": NaN,
                        "depenses_groupe_ii": NaN,
                        "depenses_groupe_iii": NaN,
                        "cadre_budgetaire": "CA_PA",
                    }
                ),
            ],
        )
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), budget_et_finances_attendu.sort_index(axis=1))

    def test_indique_un_cadre_ca_ph_même_si_les_données_ca_pa_sont_présentes(self) -> None:
        # GIVEN
        établissement_avec_des_données_ca_ph_et_ca_pa = csv_ann_ca_ej_et_budget_et_finances_builder(
            "CA_PA + CA_PH",
            {
                "MS Résultat net comptable CA PH": 50.0,
                "MS Résultat net comptable CA PA": 50.0,
                "Charges CA PA": -600.0,
                "Produits CA PA": 650.0,
                "Recettes Groupe I CA": 150.0,
                "Recettes Groupe II CA": 150.0,
                "Recettes Groupe III CA": 350.0,
                "Dépenses Groupe I CA": -100.0,
                "Dépenses Groupe II CA": -200.0,
                "Dépenses Groupe III CA": -300.0,
            },
        )
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([établissement_avec_des_données_ca_ph_et_ca_pa])

        numéros_finess_des_établissements_connus = pd.DataFrame({"numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT]})

        # WHEN
        données_transformées = transforme_les_données_budgétaires_et_financières_des_établissements_ca(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            [
                helios_ann_ca_ej_et_budget_et_finances_builder(
                    {
                        "resultat_net_comptable": 50.0,
                        "charges": -600.0,
                        "produits": 650.0,
                        "recettes_groupe_i": 150.0,
                        "recettes_groupe_ii": 150.0,
                        "recettes_groupe_iii": 350.0,
                        "depenses_groupe_i": -100.0,
                        "depenses_groupe_ii": -200.0,
                        "depenses_groupe_iii": -300.0,
                        "cadre_budgetaire": "CA_PH",
                    }
                ),
            ],
        )
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), budget_et_finances_attendu.sort_index(axis=1))

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH", {"Finess": NA})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_budgétaires_et_financières_des_établissements_ca(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH", {"Année": NA})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_budgétaires_et_financières_des_établissements_ca(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH"), csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH")]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_budgétaires_et_financières_des_établissements_ca(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame([helios_ann_ca_ej_et_budget_et_finances_builder()])
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), budget_et_finances_attendu.sort_index(axis=1))

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH")])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "123456789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_budgétaires_et_financières_des_établissements_ca(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

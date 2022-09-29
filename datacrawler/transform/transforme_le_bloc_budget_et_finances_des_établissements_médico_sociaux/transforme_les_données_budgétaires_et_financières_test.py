import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ÉTABLISSEMENT,
    csv_ann_ca_ej_et_budget_et_finances_builder,
    csv_ann_errd_ej_builder,
    csv_ann_errd_ej_et_budget_et_finances_builder,
    csv_ann_per_errd_eprd_builder,
    mocked_logger,
)
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_données_budgétaires_et_financières import (
    transforme_les_données_budgétaires_et_financières,
)
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_budget_et_finances


class TestTransformeLesDonnéesBudgétairesEtFinancières:
    def test_fusionne_les_données_des_établissements_errd_avec_celles_des_établissements_ca(self) -> None:
        # GIVEN
        numéro_finess_errd_complet = "000000000"
        numéro_finess_errd_sans_taux = "000000001"
        numéro_finess_errd_sans_dépenses_ni_recettes = "000000002"
        numéro_finess_ca_ph = "111111111"
        numéro_finess_ca_pa = "222222222"
        données_errd_ej_et = pd.DataFrame(
            [
                csv_ann_errd_ej_et_budget_et_finances_builder({"Finess": numéro_finess_errd_complet, "Année": 2019}),
                csv_ann_errd_ej_et_budget_et_finances_builder({"Finess": numéro_finess_errd_sans_taux, "Année": 2019}),
            ]
        )
        données_ca_ej_et = pd.DataFrame(
            [
                csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH", {"Finess": numéro_finess_ca_ph}),
                csv_ann_ca_ej_et_budget_et_finances_builder("CA_PA", {"Finess": numéro_finess_ca_pa}),
            ]
        )
        dépôt = 111111
        données_des_dépôts_errd = pd.DataFrame(
            [
                csv_ann_per_errd_eprd_builder({"Id Dépôt": dépôt, "Finess": numéro_finess_errd_complet, "Année": 2019}),
                csv_ann_per_errd_eprd_builder({"Id Dépôt": dépôt, "Finess": numéro_finess_errd_sans_dépenses_ni_recettes, "Année": 2019}),
            ]
        )
        données_ann_errd_ej = pd.DataFrame(
            [
                csv_ann_errd_ej_builder({"Id Dépôt": dépôt, "Année": 2019}),
                csv_ann_errd_ej_builder({"Id Dépôt": dépôt, "Année": 2019}),
            ]
        )
        numéros_finess_connus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [
                    numéro_finess_errd_complet,
                    numéro_finess_errd_sans_taux,
                    numéro_finess_errd_sans_dépenses_ni_recettes,
                    numéro_finess_ca_ph,
                    numéro_finess_ca_pa,
                ],
            }
        )

        # WHEN
        données_fusionnées = transforme_les_données_budgétaires_et_financières(
            données_errd_ej_et, données_ca_ej_et, données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_connus, mocked_logger
        )

        # THEN
        pd.testing.assert_frame_equal(
            pd.DataFrame(
                {
                    "numero_finess_etablissement_territorial": [
                        numéro_finess_errd_complet,
                        numéro_finess_errd_sans_taux,
                        numéro_finess_errd_sans_dépenses_ni_recettes,
                        numéro_finess_ca_ph,
                        numéro_finess_ca_pa,
                    ],
                    "annee": [2019, 2019, 2019, 2020, 2020],
                    "depenses_groupe_i": [-100.0, -100.0, NaN, -100.0, NaN],
                    "depenses_groupe_ii": [-200.0, -200.0, NaN, -200.0, NaN],
                    "depenses_groupe_iii": [-300.0, -300.0, NaN, -300.0, NaN],
                    "recettes_groupe_i": [150.0, 150.0, NaN, 150.0, NaN],
                    "recettes_groupe_ii": [150.0, 150.0, NaN, 150.0, NaN],
                    "recettes_groupe_iii": [350.0, 350.0, NaN, 350.0, NaN],
                    "resultat_net_comptable": [50.0, 50.0, NaN, 50.0, 100.0],
                    "cadre_budgetaire": ["ERRD", "ERRD", "ERRD", "CA_PH", "CA_PA"],
                    "taux_de_caf": [0.071600138178413528, NaN, 0.071600138178413528, 0.16, 0.16],
                    "taux_de_vetuste_construction": [0.45555983373892417, NaN, 0.45555983373892417, 0.53, 0.53],
                    "produits": [NaN, NaN, NaN, NaN, 300.0],
                    "charges": [NaN, NaN, NaN, NaN, -200.0],
                    "contribution_frais_de_siege_groupement": [-300.0, -300.0, NaN, NaN, NaN],
                }
            )
            .set_index(index_du_bloc_budget_et_finances)
            .sort_index(axis=1),
            données_fusionnées.sort_index(axis=1),
        )

    def test_privilégie_les_données_errd_pour_un_même_couple_finess_année(self) -> None:
        # GIVEN
        données_errd_ej_et = pd.DataFrame([csv_ann_errd_ej_et_budget_et_finances_builder({"Année": 2020, "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT})])
        données_ca_ej_et = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder("CA_PH", {"Année": 2020, "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT})])
        numéros_finess_connus = pd.DataFrame([{"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT}])
        dépôt = 111111
        données_des_dépôts_errd = pd.DataFrame([csv_ann_per_errd_eprd_builder({"Id Dépôt": dépôt, "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT, "Année": 2020})])
        données_ann_errd_ej = pd.DataFrame([csv_ann_errd_ej_builder({"Id Dépôt": dépôt, "Année": 2020})])

        # WHEN
        données_fusionnées = transforme_les_données_budgétaires_et_financières(
            données_errd_ej_et, données_ca_ej_et, données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_connus, mocked_logger
        )
        # THEN
        pd.testing.assert_frame_equal(
            pd.DataFrame(
                {
                    "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                    "annee": [2020],
                    "depenses_groupe_i": [-100.0],
                    "depenses_groupe_ii": [-200.0],
                    "depenses_groupe_iii": [-300.0],
                    "recettes_groupe_i": [150.0],
                    "recettes_groupe_ii": [150.0],
                    "recettes_groupe_iii": [350.0],
                    "resultat_net_comptable": [50.0],
                    "cadre_budgetaire": ["ERRD"],
                    "taux_de_caf": [0.071600138178413528],
                    "taux_de_vetuste_construction": [0.45555983373892417],
                    "produits": [NaN],
                    "charges": [NaN],
                    "contribution_frais_de_siege_groupement": [-300.0],
                }
            )
            .set_index(index_du_bloc_budget_et_finances)
            .sort_index(axis=1),
            données_fusionnées.sort_index(axis=1),
        )

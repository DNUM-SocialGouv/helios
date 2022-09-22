import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ÉTABLISSEMENT,
    csv_ann_ca_ej_et_budget_et_finances_builder,
    csv_ann_errd_ej_et_budget_et_finances_builder,
    mocked_logger,
)
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux import transforme
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_budget_et_finances


class TestTransformeLesIndicateursDuBlocBudgetEtFinances:
    def test_fusionne_les_données_des_établissements_errd_avec_celles_des_établissements_ca(self) -> None:
        # GIVEN
        numéro_finess_errd = "000000000"
        numéro_finess_ca_ph = "111111111"
        numéro_finess_ca_pa = "222222222"
        données_errd_ej_et = pd.DataFrame([csv_ann_errd_ej_et_budget_et_finances_builder({"Finess": numéro_finess_errd})])
        données_ca_ej_et = pd.DataFrame(
            [
                csv_ann_ca_ej_et_budget_et_finances_builder({"Finess": numéro_finess_ca_ph}),
                csv_ann_ca_ej_et_budget_et_finances_builder(
                    {
                        "Finess": numéro_finess_ca_pa,
                        "Recettes Groupe I CA": NaN,
                        "Recettes Groupe II CA": NaN,
                        "Recettes Groupe III CA": NaN,
                        "Dépenses Groupe I CA": NaN,
                        "Dépenses Groupe II CA": NaN,
                        "Dépenses Groupe III CA": NaN,
                        "MS Résultat net comptable CA PH": NaN,
                        "MS Résultat net comptable CA PA": 100.0,
                        "Charges CA PA": -200.0,
                        "Produits CA PA": 300.0,
                    }
                ),
            ]
        )
        numéros_finess_connus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [numéro_finess_errd, numéro_finess_ca_ph, numéro_finess_ca_pa],
            }
        )

        # WHEN
        données_fusionnées = transforme(données_errd_ej_et, données_ca_ej_et, numéros_finess_connus, mocked_logger)

        # THEN
        pd.testing.assert_frame_equal(
            pd.DataFrame(
                {
                    "numero_finess_etablissement_territorial": [numéro_finess_errd, numéro_finess_ca_ph, numéro_finess_ca_pa],
                    "annee": [2018, 2020, 2020],
                    "depenses_groupe_i": [-100.0, -100.0, NaN],
                    "depenses_groupe_ii": [-200.0, -200.0, NaN],
                    "depenses_groupe_iii": [-300.0, -300.0, NaN],
                    "recettes_groupe_i": [150.0, 150.0, NaN],
                    "recettes_groupe_ii": [150.0, 150.0, NaN],
                    "recettes_groupe_iii": [350.0, 350.0, NaN],
                    "resultat_net_comptable": [50.0, 50.0, 100.0],
                    "cadre_budgetaire": ["ERRD", "CA_PH", "CA_PA"],
                    "taux_de_caf": [NaN, 0.16, 0.16],
                    "taux_de_vetuste_construction": [NaN, 0.53, 0.53],
                    "produits": [NaN, NaN, 300.0],
                    "charges": [NaN, NaN, -200.0],
                    "contribution_frais_de_siege_groupement": [-300.0, NaN, NaN],
                }
            )
            .set_index(index_du_bloc_budget_et_finances)
            .sort_index(axis=1),
            données_fusionnées.sort_index(axis=1),
        )

    def test_privilégie_les_données_errd_pour_un_même_couple_finess_année(self) -> None:
        # GIVEN
        données_errd_ej_et = pd.DataFrame([csv_ann_errd_ej_et_budget_et_finances_builder({"Année": 2020, "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT})])
        données_ca_ej_et = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder({"Année": 2020, "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT})])
        numéros_finess_connus = pd.DataFrame([{"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT}])

        # WHEN
        données_fusionnées = transforme(données_errd_ej_et, données_ca_ej_et, numéros_finess_connus, mocked_logger)

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
                    "taux_de_caf": [NaN],
                    "taux_de_vetuste_construction": [NaN],
                    "produits": [NaN],
                    "charges": [NaN],
                    "contribution_frais_de_siege_groupement": [-300.0],
                }
            )
            .set_index(index_du_bloc_budget_et_finances)
            .sort_index(axis=1),
            données_fusionnées.sort_index(axis=1),
        )

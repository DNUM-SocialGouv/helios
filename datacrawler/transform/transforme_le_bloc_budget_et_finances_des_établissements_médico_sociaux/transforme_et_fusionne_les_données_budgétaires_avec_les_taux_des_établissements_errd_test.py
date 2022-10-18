import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ÉTABLISSEMENT,
    helios_ann_errd_ej_budget_et_finances_builder,
    helios_ann_errd_ej_et_budget_et_finances_builder,
    mocked_logger,
)
from datacrawler.test_helpers.diamant_builder import csv_ann_errd_ej_builder, csv_ann_errd_ej_et_budget_et_finances_builder, csv_ann_per_errd_eprd_builder
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_et_fusionne_les_données_budgétaires_avec_les_taux_des_établissements_errd import (
    transforme_et_fusionne_les_données_budgétaires_errd_avec_les_taux_errd,
)


class TestTransformeEtFusionneLesDonnéesBudgétairesAvecLesTauxDesÉtablissementsErrd:
    def test_fusionne_les_données_budgétaires_errd_avec_les_taux_errd_pour_un_établissement_sur_une_année_en_renseignant_le_cadre_budgétaire(self) -> None:
        # GIVEN
        données_errd_ej_et = pd.DataFrame([csv_ann_errd_ej_et_budget_et_finances_builder({"Année": 2020})])
        dépôt = 111111
        données_des_dépôts_errd = pd.DataFrame([csv_ann_per_errd_eprd_builder({"Id Dépôt": dépôt, "Année": 2020})])
        données_ann_errd_ej = pd.DataFrame([csv_ann_errd_ej_builder({"Id Dépôt": dépôt, "Année": 2020})])
        numéros_finess_connus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
            }
        )

        # WHEN
        données_fusionnées = transforme_et_fusionne_les_données_budgétaires_errd_avec_les_taux_errd(
            données_errd_ej_et, données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_connus, mocked_logger
        )

        # THEN
        pd.testing.assert_frame_equal(
            pd.DataFrame(
                [{**helios_ann_errd_ej_et_budget_et_finances_builder(), **helios_ann_errd_ej_budget_et_finances_builder(), **{"cadre_budgetaire": "ERRD"}}]
            ).sort_index(axis=1),
            données_fusionnées.sort_index(axis=1),
        )

    def test_retourne_des_lignes_différentes_pour_des_données_d_années_différentes(self) -> None:
        # GIVEN
        données_errd_ej_et = pd.DataFrame([csv_ann_errd_ej_et_budget_et_finances_builder({"Année": 2019})])
        dépôt = 111111
        données_des_dépôts_errd = pd.DataFrame([csv_ann_per_errd_eprd_builder({"Id Dépôt": dépôt, "Année": 2020})])
        données_ann_errd_ej = pd.DataFrame([csv_ann_errd_ej_builder({"Id Dépôt": dépôt, "Année": 2020})])
        numéros_finess_connus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
            }
        )

        # WHEN
        données_fusionnées = transforme_et_fusionne_les_données_budgétaires_errd_avec_les_taux_errd(
            données_errd_ej_et, données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_connus, mocked_logger
        )

        # THEN
        pd.testing.assert_frame_equal(
            pd.DataFrame(
                [
                    {
                        **helios_ann_errd_ej_budget_et_finances_builder(
                            {
                                "taux_de_caf": NaN,
                                "taux_de_vetuste_construction": NaN,
                                "fonds_de_roulement": NaN,
                            }
                        ),
                        **helios_ann_errd_ej_et_budget_et_finances_builder({"annee": 2019}),
                        **{"cadre_budgetaire": "ERRD"},
                    },
                    {
                        **helios_ann_errd_ej_et_budget_et_finances_builder(
                            {
                                "contribution_frais_de_siege_groupement": NaN,
                                "depenses_groupe_i": NaN,
                                "depenses_groupe_ii": NaN,
                                "depenses_groupe_iii": NaN,
                                "recettes_groupe_i": NaN,
                                "recettes_groupe_ii": NaN,
                                "recettes_groupe_iii": NaN,
                                "resultat_net_comptable": NaN,
                            }
                        ),
                        **helios_ann_errd_ej_budget_et_finances_builder({"annee": 2020}),
                        **{"cadre_budgetaire": "ERRD"},
                    },
                ]
            ).sort_index(axis=1),
            données_fusionnées.sort_index(axis=1),
        )

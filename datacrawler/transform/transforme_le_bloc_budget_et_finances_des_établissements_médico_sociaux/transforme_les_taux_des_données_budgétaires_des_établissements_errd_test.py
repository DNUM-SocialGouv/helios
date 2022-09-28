import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, mocked_logger
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_taux_des_données_budgétaires_des_établissements_errd import (
    transforme_les_taux_des_données_budgétaires_des_établissements_errd,
)


class TestTransformeLesTauxDesDonnéesBudgétairesDesÉtablissementsErrd:
    def test_agrège_les_données_de_taux_par_établissement_grâce_aux_dépôts_et_renomme_les_colonnes(self) -> None:
        # GIVEN
        dépôt_1 = 111111
        dépôt_2 = 222222
        dépôt_3 = 333333
        données_des_dépôts_errd = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL],
                "Année": [2020, 2019, 2020],
                "Id Dépôt": [dépôt_1, dépôt_2, dépôt_3],
            }
        )
        données_ann_errd_ej = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Année": [2019, 2020, 2020],
                "Id Dépôt": [dépôt_2, dépôt_3, dépôt_1],
                "Taux de CAF ERRD": [0.071600138178413528, 0.07553939035106072, 0.082983883939739017],
                "Taux vétusté Construction ERRD": [0.45555983373892417, 0.44546727805048336, 0.3682801725853011],
            }
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            {"numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL]}
        )

        # WHEN
        données_des_taux_budgétaires_errd = transforme_les_taux_des_données_budgétaires_des_établissements_errd(
            données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            {
                "taux_de_caf": [0.071600138178413528, 0.07553939035106072, 0.082983883939739017],
                "taux_de_vetuste_construction": [0.45555983373892417, 0.44546727805048336, 0.3682801725853011],
                "numero_finess_etablissement_territorial": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                ],
                "annee": [2019, 2020, 2020],
            }
        )
        pd.testing.assert_frame_equal(données_des_taux_budgétaires_errd, budget_et_finances_attendu)

    def test_indique_les_mêmes_taux_pour_des_établissements_partageant_le_même_dépôt(self) -> None:
        # GIVEN
        dépôt_commun = 111111
        données_des_dépôts_errd = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL],
                "Année": [2020, 2020],
                "Id Dépôt": [dépôt_commun, dépôt_commun],
            }
        )
        données_ann_errd_ej = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Année": [2020],
                "Id Dépôt": [dépôt_commun],
                "Taux de CAF ERRD": [0.071600138178413528],
                "Taux vétusté Construction ERRD": [0.45555983373892417],
            }
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            {"numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL]}
        )

        # WHEN
        données_des_taux_budgétaires_errd = transforme_les_taux_des_données_budgétaires_des_établissements_errd(
            données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            {
                "taux_de_caf": [0.071600138178413528, 0.071600138178413528],
                "taux_de_vetuste_construction": [0.45555983373892417, 0.45555983373892417],
                "numero_finess_etablissement_territorial": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                ],
                "annee": [2020, 2020],
            }
        )
        pd.testing.assert_frame_equal(données_des_taux_budgétaires_errd, budget_et_finances_attendu)

    def test_remplis_les_valeurs_manquantes_avec_les_données_de_dépôts_précédents_de_la_même_année(self) -> None:
        # GIVEN
        dépôt = 111111
        données_des_dépôts_errd = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "Année": [2020],
                "Id Dépôt": [dépôt],
            }
        )
        données_ann_errd_ej = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Année": [2020, 2020, 2020],
                "Id Dépôt": [dépôt, dépôt, dépôt],
                "Taux de CAF ERRD": [NaN, 0.071600138178413528, NaN],
                "Taux vétusté Construction ERRD": [NaN, NaN, 0.45555983373892417],
            }
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            {"numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL]}
        )

        # WHEN
        données_des_taux_budgétaires_errd = transforme_les_taux_des_données_budgétaires_des_établissements_errd(
            données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            {
                "taux_de_caf": [0.071600138178413528],
                "taux_de_vetuste_construction": [0.45555983373892417],
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "annee": [2020],
            }
        )
        pd.testing.assert_frame_equal(
            données_des_taux_budgétaires_errd.set_index("numero_finess_etablissement_territorial"),
            budget_et_finances_attendu.set_index("numero_finess_etablissement_territorial"),
        )

    def test_ne_considère_pas_les_dépôts_non_renseignés(self) -> None:
        # GIVEN
        dépôt = 111111
        données_des_dépôts_errd = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "Année": [2020],
                "Id Dépôt": [dépôt],
            }
        )
        données_ann_errd_ej = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, NaN],
                "Année": [2020, 2020],
                "Id Dépôt": [dépôt, NaN],
                "Taux de CAF ERRD": [0.071600138178413528, NaN],
                "Taux vétusté Construction ERRD": [NaN, 0.45555983373892417],
            }
        )
        numéros_finess_des_établissements_connus = pd.DataFrame({"numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT]})

        # WHEN
        données_des_taux_budgétaires_errd = transforme_les_taux_des_données_budgétaires_des_établissements_errd(
            données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            {
                "taux_de_caf": [0.071600138178413528],
                "taux_de_vetuste_construction": [NaN],
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "annee": [2020],
            }
        )
        pd.testing.assert_frame_equal(
            données_des_taux_budgétaires_errd,
            budget_et_finances_attendu,
        )

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        dépôt_1 = 111111
        données_des_dépôts_errd = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "Année": [2020],
                "Id Dépôt": [dépôt_1],
            }
        )
        données_ann_errd_ej = pd.DataFrame(
            {
                "Finess EJ": [NUMÉRO_FINESS_ENTITÉ_JURIDIQUE],
                "Année": [2020],
                "Id Dépôt": [dépôt_1],
                "Taux de CAF ERRD": [0.071600138178413528],
                "Taux vétusté Construction ERRD": [0.45555983373892417],
            }
        )
        numéros_finess_des_établissements_connus = pd.DataFrame({"numero_finess_etablissement_territorial": []})

        # WHEN
        données_des_taux_budgétaires_errd = transforme_les_taux_des_données_budgétaires_des_établissements_errd(
            données_des_dépôts_errd, données_ann_errd_ej, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_des_taux_budgétaires_errd.empty

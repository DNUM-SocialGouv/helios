import pandas as pd

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux import (
    transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux,
)
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_budget_et_finances


class TestTransformeLeBlocBudgetEtFinancesDesÉtablissementsMédicoSociaux:
    def test_renomme_les_colonnes(self) -> None:
        # GIVEN
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "655 Quotes-parts de résultat sur opérations faites en commun": -300,
                    "Dépenses Groupe I ERRD": -100,
                    "Dépenses Groupe II ERRD": -200,
                    "Dépenses Groupe III ERRD": -300,
                    "Recettes Groupe I ERRD": 150,
                    "Recettes Groupe II ERRD": 150,
                    "Recettes Groupe III ERRD": 350,
                    "MS Résultat net comptable ERRD": 50,
                }
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux(
            données_ann_errd_ej_et, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "contribution_frais_de_siege_groupement": 300,
                    "depenses_groupe_i": 100,
                    "depenses_groupe_ii": 200,
                    "depenses_groupe_iii": 300,
                    "recettes_groupe_i": 150,
                    "recettes_groupe_ii": 150,
                    "recettes_groupe_iii": 350,
                    "resultat_net_comptable": 50,
                }
            ],
        ).set_index(index_du_bloc_budget_et_finances)
        pd.testing.assert_frame_equal(données_transformées, budget_et_finances_attendu)

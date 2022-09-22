import pandas as pd
from pandas import NA

from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ÉTABLISSEMENT,
    csv_ann_ca_ej_et_budget_et_finances_builder,
    helios_ann_ca_ej_et_budget_et_finances_builder,
    mocked_logger,
)
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_données_ann_ca_ej_et_budget_et_finances import (
    transforme_les_données_ann_ca_ej_et_budget_finances,
)
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_budget_et_finances


class TestTransformeLesDonnéesAnnCaEjEtBudgetEtFinances:
    def test_renomme_les_colonnes_et_crée_l_index(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_ca_ej_et_budget_finances(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame([helios_ann_ca_ej_et_budget_et_finances_builder()]).set_index(index_du_bloc_budget_et_finances)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), budget_et_finances_attendu.sort_index(axis=1))

    def test_indique_le_cadre_budgétaire(self) -> None:
        # GIVEN
        établissement_ca_ph = csv_ann_ca_ej_et_budget_et_finances_builder()
        numéro_finess_ca_pa = "123456789"
        établissement_ca_pa = csv_ann_ca_ej_et_budget_et_finances_builder(
            {
                "Finess": numéro_finess_ca_pa,
                "MS Résultat net comptable CA PH": NA,
                "MS Résultat net comptable CA PA": 100.0,
                "Charges CA PA": 100.0,
                "Produits CA PA": 200.0,
                "Recettes Groupe I CA": NA,
                "Recettes Groupe II CA": NA,
                "Recettes Groupe III CA": NA,
                "Dépenses Groupe I CA": NA,
                "Dépenses Groupe II CA": NA,
                "Dépenses Groupe III CA": NA,
            }
        )

        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [
                établissement_ca_ph,
                établissement_ca_pa,
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame({"numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT, numéro_finess_ca_pa]})

        # WHEN
        données_transformées = transforme_les_données_ann_ca_ej_et_budget_finances(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            [
                helios_ann_ca_ej_et_budget_et_finances_builder(),
                helios_ann_ca_ej_et_budget_et_finances_builder(
                    {
                        "numero_finess_etablissement_territorial": numéro_finess_ca_pa,
                        "resultat_net_comptable": 100.0,
                        "charges": 100.0,
                        "produits": 200.0,
                        "recettes_groupe_i": NA,
                        "recettes_groupe_ii": NA,
                        "recettes_groupe_iii": NA,
                        "depenses_groupe_i": NA,
                        "depenses_groupe_ii": NA,
                        "depenses_groupe_iii": NA,
                        "cadre_budgetaire": "CA_PA",
                    }
                ),
            ],
        ).set_index(index_du_bloc_budget_et_finances)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), budget_et_finances_attendu.sort_index(axis=1))

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder({"Finess": NA})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_ca_ej_et_budget_finances(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder({"Année": NA})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_ca_ej_et_budget_finances(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder(), csv_ann_ca_ej_et_budget_et_finances_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_ca_ej_et_budget_finances(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame([helios_ann_ca_ej_et_budget_et_finances_builder()]).set_index(index_du_bloc_budget_et_finances)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), budget_et_finances_attendu.sort_index(axis=1))

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_ca_ej_et_budget_et_finances_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "123456789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_ca_ej_et_budget_finances(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

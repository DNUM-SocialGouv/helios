import pandas as pd
from pandas import NA

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.diamant_builder import csv_ann_errd_ej_et_budget_et_finances_builder
from datacrawler.test_helpers.helios_builder import helios_ann_errd_ej_et_budget_et_finances_builder
from datacrawler.transform.transforme_le_bloc_budget_et_finances_des_établissements_médico_sociaux.transforme_les_données_dépenses_et_recettes_des_établissements_errd import (
    transforme_les_données_dépenses_et_recettes_des_établissements_errd,
)


class TestTransformeLesDonnéesDépensesEtRecettesDesÉtablissementsErrd:
    def test_renomme_les_colonnes(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "655 Quotes-parts de résultat sur opérations faites en commun": -300.0,
                    "Dépenses Groupe I ERRD": -100.0,
                    "Dépenses Groupe II ERRD": -200.0,
                    "Dépenses Groupe III ERRD": -300.0,
                    "Recettes Groupe I ERRD": 150.0,
                    "Recettes Groupe II ERRD": 150.0,
                    "Recettes Groupe III ERRD": 350.0,
                    "MS Résultat net comptable ERRD": 50.0,
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
        données_transformées = transforme_les_données_dépenses_et_recettes_des_établissements_errd(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "contribution_frais_de_siege_groupement": -300.0,
                    "depenses_groupe_i": -100.0,
                    "depenses_groupe_ii": -200.0,
                    "depenses_groupe_iii": -300.0,
                    "recettes_groupe_i": 150.0,
                    "recettes_groupe_ii": 150.0,
                    "recettes_groupe_iii": 350.0,
                    "resultat_net_comptable": 50.0,
                }
            ],
        )
        pd.testing.assert_frame_equal(données_transformées, budget_et_finances_attendu)

    def test_transforme_l_indicateur_contributions_frais_de_siege_groupement_en_valeurs_positives(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [csv_ann_errd_ej_et_budget_et_finances_builder({"655 Quotes-parts de résultat sur opérations faites en commun": -300.0})]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_dépenses_et_recettes_des_établissements_errd(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        budget_et_finances_attendu = pd.DataFrame(
            [helios_ann_errd_ej_et_budget_et_finances_builder({"contribution_frais_de_siege_groupement": -300.0})],
        )
        pd.testing.assert_frame_equal(données_transformées, budget_et_finances_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [
                csv_ann_errd_ej_et_budget_et_finances_builder(
                    {
                        "Finess": NA,
                    }
                )
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
        données_transformées = transforme_les_données_dépenses_et_recettes_des_établissements_errd(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [
                csv_ann_errd_ej_et_budget_et_finances_builder({"Année": NA}),
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
        données_transformées = transforme_les_données_dépenses_et_recettes_des_établissements_errd(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_renseigne_la_ligne_même_si_aucun_indicateur_n_est_renseigné(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [
                csv_ann_errd_ej_et_budget_et_finances_builder(
                    {
                        "655 Quotes-parts de résultat sur opérations faites en commun": NA,
                        "Dépenses Groupe I ERRD": NA,
                        "Dépenses Groupe II ERRD": NA,
                        "Dépenses Groupe III ERRD": NA,
                        "Recettes Groupe I ERRD": NA,
                        "Recettes Groupe II ERRD": NA,
                        "Recettes Groupe III ERRD": NA,
                        "MS Résultat net comptable ERRD": NA,
                    }
                ),
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
        données_transformées = transforme_les_données_dépenses_et_recettes_des_établissements_errd(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                helios_ann_errd_ej_et_budget_et_finances_builder(
                    {
                        "contribution_frais_de_siege_groupement": NA,
                        "depenses_groupe_i": NA,
                        "depenses_groupe_ii": NA,
                        "depenses_groupe_iii": NA,
                        "recettes_groupe_i": NA,
                        "recettes_groupe_ii": NA,
                        "recettes_groupe_iii": NA,
                        "resultat_net_comptable": NA,
                    }
                )
            ],
        )
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame(
            [
                csv_ann_errd_ej_et_budget_et_finances_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "655 Quotes-parts de résultat sur opérations faites en commun": NA,
                    }
                ),
                csv_ann_errd_ej_et_budget_et_finances_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "655 Quotes-parts de résultat sur opérations faites en commun": 100.0,
                    }
                ),
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
        données_transformées = transforme_les_données_dépenses_et_recettes_des_établissements_errd(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                helios_ann_errd_ej_et_budget_et_finances_builder(
                    {
                        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "annee": 2018,
                        "contribution_frais_de_siege_groupement": NA,
                    }
                )
            ],
        )
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_budget_et_finances = pd.DataFrame([csv_ann_errd_ej_et_budget_et_finances_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "234567891",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_dépenses_et_recettes_des_établissements_errd(
            données_ann_errd_ej_et_budget_et_finances, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.shape[0] == 0

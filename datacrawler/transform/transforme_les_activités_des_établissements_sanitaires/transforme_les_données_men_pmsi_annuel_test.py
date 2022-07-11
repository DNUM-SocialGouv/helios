from unittest.mock import MagicMock

import pandas as pd
from numpy import NaN
from pandas import NA

from datacrawler.test_helpers import csv_men_pmsi_annuel_builder, sql_men_pmsi_annuel_builder
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_men_pmsi_annuel import (
    transforme_les_données_men_pmsi_annuel,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités

fake_logger = MagicMock()
NUMÉRO_FINESS_ÉTABLISSEMENT = "010001261"


class TestTransformeLesDonnéesMenPmsiAnnuel:
    def test_renomme_les_colonnes_et_crée_l_index(self) -> None:
        # GIVEN
        données_men_pmsi_annuel = pd.DataFrame([csv_men_pmsi_annuel_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, fake_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([sql_men_pmsi_annuel_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_men_pmsi_annuel = pd.DataFrame(
            [
                csv_men_pmsi_annuel_builder({"Finess": NA}),
                csv_men_pmsi_annuel_builder(),
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
        données_transformées = transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, fake_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([sql_men_pmsi_annuel_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_men_pmsi_annuel = pd.DataFrame(
            [
                csv_men_pmsi_annuel_builder({"Année": NA}),
                csv_men_pmsi_annuel_builder(),
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
        données_transformées = transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, fake_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([sql_men_pmsi_annuel_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_renseigne_la_ligne_même_si_aucun_taux_n_est_renseigné(self) -> None:
        # GIVEN
        données_men_pmsi_annuel = pd.DataFrame(
            [
                csv_men_pmsi_annuel_builder(
                    {
                        "Nombre de séjours HTP/AMBU Médecine": NaN,
                        "Nombre de séjours HTP/AMBU Obstétrique": NaN,
                        "Nombre de séjours HTP/AMBU Chirurgie": NaN,
                        "Nombre de séjours HC Médecine": NaN,
                        "Nombre de séjours HC Chirurgie": NaN,
                        "Nombre de séjours HC Obstétrique": NaN,
                        "Nombre de journées hospit complète SSR": NaN,
                        "Nombre de journées HTP SSR": NaN,
                        "Nb journées hospit complète PSY": NaN,
                        "Nb journées HTP PSY": NaN,
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
        données_transformées = transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, fake_logger)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                [
                    sql_men_pmsi_annuel_builder(
                        {
                            "nombre_sejours_partiels_medecine": NaN,
                            "nombre_sejours_partiels_obstetrique": NaN,
                            "nombre_sejours_partiels_chirurgie": NaN,
                            "nombre_sejours_complets_medecine": NaN,
                            "nombre_sejours_complets_chirurgie": NaN,
                            "nombre_sejours_complets_obstetrique": NaN,
                            "nombre_journees_completes_ssr": NaN,
                            "nombre_journees_partiels_ssr": NaN,
                            "nombre_journees_complete_psy": NaN,
                            "nombre_journées_partielles_psy": NaN,
                        }
                    )
                ],
            )
            .set_index(index_des_activités)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_men_pmsi_annuel = pd.DataFrame(
            [
                csv_men_pmsi_annuel_builder(
                    {
                        "Finess": "010001261",
                        "Année": 2018,
                        "Nombre de séjours HTP/AMBU Médecine": NaN,
                        "Nombre de séjours HTP/AMBU Obstétrique": 1.0,
                    }
                ),
                csv_men_pmsi_annuel_builder(
                    {
                        "Finess": "010001261",
                        "Année": 2018,
                        "Nombre de séjours HTP/AMBU Médecine": 1.0,
                        "Nombre de séjours HTP/AMBU Obstétrique": NaN,
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
        données_transformées = transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, fake_logger)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                [
                    sql_men_pmsi_annuel_builder(
                        {
                            "numero_finess_etablissement_territorial": "010001261",
                            "annee": 2018,
                            "nombre_sejours_partiels_medecine": NaN,
                            "nombre_sejours_partiels_obstetrique": 1.0,
                        }
                    )
                ],
            )
            .set_index(index_des_activités)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_men_pmsi_annuel = pd.DataFrame([csv_men_pmsi_annuel_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "234567891",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_men_pmsi_annuel(données_men_pmsi_annuel, numéros_finess_des_établissements_connus, fake_logger)

        # THEN
        assert données_transformées.shape == (0, 10)

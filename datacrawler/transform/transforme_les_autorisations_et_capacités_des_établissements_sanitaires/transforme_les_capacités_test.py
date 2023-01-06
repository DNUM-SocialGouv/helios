import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, mocked_logger
from datacrawler.test_helpers.diamant_builder import csv_ann_sae_builder
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_capacités import (
    transforme_les_données_des_capacités,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_capacités_sanitaires


class TestTransformeLesDonnéesDesCapacitésSanitaires:
    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame([csv_ann_sae_builder()])
        numéros_finess_connus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
            }
        )

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "nombre_places_chirurgie": [7.0],
                "nombre_places_obstétrique": [1.0],
                "nombre_places_médecine": [7.0],
                "nombre_places_ssr": [NaN],
                "nombre_lits_chirurgie": [26.0],
                "nombre_lits_obstétrique": [20.0],
                "nombre_lits_médecine": [62.0],
                "nombre_lits_ssr": [30.0],
                "nombre_lits_usld": [15.0],
                "nombre_lits_ou_places_psy_complet": [5.0],
                "nombre_places_psy_partiel": [13.0],
            }
        ).set_index(index_des_capacités_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_conserve_les_5_dernières_années_pour_chaque_établissement(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame(
            {
                "Finess": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                ],
                "Année": [2022, 2021, 2020, 2019, 2018, 2021, 2020, 2019, 2018, 2017],
                "Nombre de places de chirurgie": [7, 7, 7, 7, 7, 6, 6, 6, 6, 6],
                "Nombre de places d'obstétrique": [1, 1, 1, 1, 1, NaN, NaN, NaN, NaN, NaN],
                "Nombre de places de médecine": [7, 7, 7, 7, 7, 2, 2, 2, 2, 2],
                "Nombre de places de SSR": [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
                "Nombre de lits de chirurgie": [26, 21, 26, 26, 26, 12, 30, 30, 30, 30],
                "Nombre de lits d'obstétrique": [20, 21, 21, 21, 21, 8, 8, 8, 8, 8],
                "Nombre de lits de médecine": [62, 60, 60, 68, 76, 20, 20, 20, 20, 20],
                "Nombre de lits de SSR": [30, 30, 30, 30, 30, NaN, NaN, NaN, NaN, NaN],
                "nombre_lits_usld": [15, 15, 15, 15, 15, NaN, NaN, NaN, NaN, NaN],
                "nombre_lits_ou_places_psy_complet": [NaN, NaN, NaN, NaN, NaN, 5, 5, 5, 5, 5],
                "nombre_places_psy_partiel": [NaN, NaN, NaN, NaN, NaN, 13, 13, 13, 13, 13],
            }
        )
        numéros_finess_connus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE],
            }
        )

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                ],
                "nombre_places_chirurgie": [7, 7, 7, 7, 7, 6, 6, 6, 6, 6],
                "nombre_places_obstétrique": [1, 1, 1, 1, 1, NaN, NaN, NaN, NaN, NaN],
                "nombre_places_médecine": [7, 7, 7, 7, 7, 2, 2, 2, 2, 2],
                "nombre_places_ssr": [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
                "nombre_lits_chirurgie": [26, 21, 26, 26, 26, 12, 30, 30, 30, 30],
                "nombre_lits_obstétrique": [20, 21, 21, 21, 21, 8, 8, 8, 8, 8],
                "nombre_lits_médecine": [62, 60, 60, 68, 76, 20, 20, 20, 20, 20],
                "nombre_lits_ssr": [30, 30, 30, 30, 30, NaN, NaN, NaN, NaN, NaN],
                "nombre_lits_usld": [15, 15, 15, 15, 15, NaN, NaN, NaN, NaN, NaN],
                "nombre_lits_ou_places_psy_complet": [NaN, NaN, NaN, NaN, NaN, 5, 5, 5, 5, 5],
                "nombre_places_psy_partiel": [NaN, NaN, NaN, NaN, NaN, 13, 13, 13, 13, 13],
            }
        ).set_index(index_des_capacités_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame([csv_ann_sae_builder({"Finess": NaN})])
        numéros_finess_connus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
            }
        )

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame([csv_ann_sae_builder({"Finess": "123456789"})])
        numéros_finess_connus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
            }
        )

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

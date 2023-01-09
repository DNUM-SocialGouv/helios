import pandas as pd
from numpy import NaN
from freezegun import freeze_time

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.diamant_builder import csv_ann_sae_builder
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_capacités import (
    transforme_les_données_des_capacités,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_capacités_sanitaires


@freeze_time("2023-01-01")
class TestTransformeLesDonnéesDesCapacitésSanitaires:
    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame([csv_ann_sae_builder()])
        numéros_finess_connus = [NUMÉRO_FINESS_ÉTABLISSEMENT]

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
                "annee": [2020],
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

    def test_trie_par_annee(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame(
            {
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT],
                "Année": [2020, 2019, 2022],
            }
        )
        numéros_finess_connus = [NUMÉRO_FINESS_ÉTABLISSEMENT]

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        annees_attendues = [2022, 2020, 2019]
        assert données_transformées["annee"].tolist() == annees_attendues

    def test_limite_aux_5_dernières_annees(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame(
            {
                "Finess": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                ],
                "Année": [2022, 2021, 2020, 2019, 2018, 2017],
            }
        )
        numéros_finess_connus = [NUMÉRO_FINESS_ÉTABLISSEMENT]

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        annees_attendues = [2022, 2021, 2020, 2019, 2018]
        assert données_transformées["annee"].tolist() == annees_attendues

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame([csv_ann_sae_builder({"Finess": NaN})])
        numéros_finess_connus = [NUMÉRO_FINESS_ÉTABLISSEMENT]

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame([csv_ann_sae_builder({"Finess": "123456789"})])
        numéros_finess_connus = [NUMÉRO_FINESS_ÉTABLISSEMENT]

        # WHEN
        données_transformées = transforme_les_données_des_capacités(données_diamant_ann_sae, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

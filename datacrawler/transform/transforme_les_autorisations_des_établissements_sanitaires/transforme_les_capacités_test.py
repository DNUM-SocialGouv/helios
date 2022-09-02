import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, mocked_logger
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_capacités import transforme_les_données_des_capacités
from datacrawler.transform.équivalences_diamant_helios import index_des_capacités_sanitaires


class TestTransformeLesDonnéesDesCapacitésSanitaires:
    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_diamant_ann_sae = pd.DataFrame(
            {
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "Année": [2020],
                "Nombre de places de chirurgie": [7.0],
                "Nombre de places d'obstétrique": [1],
                "Nombre de places de médecine": [7.0],
                "Nombre de places de SSR": [NaN],
                "Nombre de lits de chirurgie": [26.0],
                "Nombre de lits d'obstétrique": [20.0],
                "Nombre de lits de médecine": [62.0],
                "Nombre de lits de SSR": [30],
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
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "annee": [2020],
                "nombre_places_chirurgie": [7.0],
                "nombre_places_obstétrique": [1],
                "nombre_places_médecine": [7.0],
                "nombre_places_ssr": [NaN],
                "nombre_lits_chirurgie": [26.0],
                "nombre_lits_obstétrique": [20.0],
                "nombre_lits_médecine": [62.0],
                "nombre_lits_ssr": [30],
            }
        ).set_index(index_des_capacités_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_conserve_uniquement_que_la_dernière_année_pour_chaque_établissement(self) -> None:
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
                "Année": [2020, 2019, 2018, 2017, 2016, 2020, 2019, 2018, 2017, 2016],
                "Nombre de places de chirurgie": [7.0, 7, 7, 7, 7, 6, 6, 6, 6, 6],
                "Nombre de places d'obstétrique": [1, 1, 1, 1, 1, NaN, NaN, NaN, NaN, NaN],
                "Nombre de places de médecine": [7.0, 7, 7, 7, 7, 2, 2, 2, 2, 2],
                "Nombre de places de SSR": [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
                "Nombre de lits de chirurgie": [26.0, 21, 26, 26, 26, 12, 30, 30, 30, 30],
                "Nombre de lits d'obstétrique": [20.0, 21, 21, 21, 21, 8, 8, 8, 8, 8],
                "Nombre de lits de médecine": [62.0, 60, 60, 68, 76, 20, 20, 20, 20, 20],
                "Nombre de lits de SSR": [30, 30, 30, 30, 30, NaN, NaN, NaN, NaN, NaN],
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
                    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                ],
                "annee": [2020, 2020],
                "nombre_places_chirurgie": [7.0, 6],
                "nombre_places_obstétrique": [1, NaN],
                "nombre_places_médecine": [7.0, 2],
                "nombre_places_ssr": [NaN, NaN],
                "nombre_lits_chirurgie": [26.0, 12],
                "nombre_lits_obstétrique": [20.0, 8],
                "nombre_lits_médecine": [62.0, 20],
                "nombre_lits_ssr": [30, NaN],
            }
        ).set_index(index_des_capacités_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        pass

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        pass

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        pass

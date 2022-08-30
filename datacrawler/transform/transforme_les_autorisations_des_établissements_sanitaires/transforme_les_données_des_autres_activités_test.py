import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger, xml_contenu_finess_cs1600101_builder
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_des_autres_activités import (
    transforme_les_données_des_autres_activités,
)
from datacrawler.transform.équivalences_finess_helios import index_des_autres_activités_sanitaires


class TestTransformeLesDonnéesFinessCs1400104:
    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_finess_cs1600101 = pd.DataFrame([xml_contenu_finess_cs1600101_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autres_activités(données_finess_cs1600101, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "code_activite": "A0",
                    "code_forme": "01",
                    "code_modalite": "00",
                    "date_autorisation": "2006-06-26",
                    "date_fin": "2026-06-26",
                    "date_mise_en_oeuvre": "2006-06-26",
                    "libelle_activite": "Installation de chirurgie esthétique",
                    "libelle_forme": "Hospitalisation complète (24 heures consécutives ou plus)",
                    "libelle_modalite": "Pas de modalité",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autres_activités_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_finess_cs1600101 = pd.DataFrame([xml_contenu_finess_cs1600101_builder({"nofinesset": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autres_activités(données_finess_cs1600101, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.shape == (0, 6)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_activité(self) -> None:
        # GIVEN
        données_finess_cs1600101 = pd.DataFrame([xml_contenu_finess_cs1600101_builder({"activite": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autres_activités(données_finess_cs1600101, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.shape == (0, 6)

    def test_supprime_les_lignes_ne_mentionnant_pas_la_forme(self) -> None:
        # GIVEN
        données_finess_cs1600101 = pd.DataFrame([xml_contenu_finess_cs1600101_builder({"forme": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autres_activités(données_finess_cs1600101, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.shape == (0, 6)

    def test_supprime_les_lignes_ne_mentionnant_pas_la_modalité(self) -> None:
        # GIVEN
        données_finess_cs1600101 = pd.DataFrame([xml_contenu_finess_cs1600101_builder({"modalite": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autres_activités(données_finess_cs1600101, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.shape == (0, 6)

    def test_ne_considère_pas_qu_une_seule_fois_un_ensemble_no_finess_activité_forme_et_modalité(self) -> None:
        # GIVEN
        données_finess_cs1600101 = pd.DataFrame([xml_contenu_finess_cs1600101_builder(), xml_contenu_finess_cs1600101_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autres_activités(données_finess_cs1600101, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "code_activite": "A0",
                    "code_forme": "01",
                    "code_modalite": "00",
                    "date_autorisation": "2006-06-26",
                    "date_fin": "2026-06-26",
                    "date_mise_en_oeuvre": "2006-06-26",
                    "libelle_activite": "Installation de chirurgie esthétique",
                    "libelle_forme": "Hospitalisation complète (24 heures consécutives ou plus)",
                    "libelle_modalite": "Pas de modalité",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autres_activités_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_finess_cs1600101 = pd.DataFrame([xml_contenu_finess_cs1600101_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "123456789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autres_activités(données_finess_cs1600101, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.shape == (0, 6)

import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger, xml_contenu_finess_cs1400103_builder
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_des_autorisations import (
    transforme_les_données_des_autorisations,
)
from datacrawler.transform.équivalences_finess_helios import index_des_autorisations_sanitaires


class TestTransformeLesDonnéesFinessCs1400103:
    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_finess_cs1400103 = pd.DataFrame([xml_contenu_finess_cs1400103_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autorisations(données_finess_cs1400103, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "code_activite": "16",
                    "code_forme": "00",
                    "code_modalite": "40",
                    "date_autorisation": "2004-11-02",
                    "date_fin": "2027-09-23",
                    "date_mise_en_oeuvre": "2005-03-22",
                    "libelle_activite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Hémodialyse en centre pour adultes",
                    "numero_autorisation_arhgos": "03-00-000",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_finess_cs1400103 = pd.DataFrame([xml_contenu_finess_cs1400103_builder({"nofinesset": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autorisations(données_finess_cs1400103, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_activité(self) -> None:
        # GIVEN
        données_finess_cs1400103 = pd.DataFrame([xml_contenu_finess_cs1400103_builder({"activite": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autorisations(données_finess_cs1400103, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_la_modalité(self) -> None:
        # GIVEN
        données_finess_cs1400103 = pd.DataFrame([xml_contenu_finess_cs1400103_builder({"modalite": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autorisations(données_finess_cs1400103, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_la_forme(self) -> None:
        # GIVEN
        données_finess_cs1400103 = pd.DataFrame([xml_contenu_finess_cs1400103_builder({"forme": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autorisations(données_finess_cs1400103, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_ne_considère_pas_qu_une_seule_fois_un_ensemble_no_finess_activité_modalité_et_forme(self) -> None:
        # GIVEN
        données_finess_cs1400103 = pd.DataFrame([xml_contenu_finess_cs1400103_builder(), xml_contenu_finess_cs1400103_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autorisations(données_finess_cs1400103, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "code_activite": "16",
                    "code_forme": "00",
                    "code_modalite": "40",
                    "date_autorisation": "2004-11-02",
                    "date_fin": "2027-09-23",
                    "date_mise_en_oeuvre": "2005-03-22",
                    "libelle_activite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Hémodialyse en centre pour adultes",
                    "numero_autorisation_arhgos": "03-00-000",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_finess_cs1400103 = pd.DataFrame([xml_contenu_finess_cs1400103_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "123456789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_autorisations(données_finess_cs1400103, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

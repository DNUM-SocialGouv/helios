import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger, xml_contenu_finess_cs1400104_builder
from datacrawler.transform.transforme_les_autorisations_des_établissements_sanitaires.transforme_les_données_des_équipements_matériels_lourds import (
    transforme_les_données_des_équipements_matériels_lourds,
)
from datacrawler.transform.équivalences_finess_helios import index_des_équipements_matériels_lourds


class TestTransformeLesDonnéesFinessCs1400104:
    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_finess_cs1400104 = pd.DataFrame([xml_contenu_finess_cs1400104_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_équipements_matériels_lourds(données_finess_cs1400104, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "date_autorisation": "2004-11-02",
                    "date_fin": "2028-05-29",
                    "date_mise_en_oeuvre": "2006-11-08",
                    "code_equipement_materiel_lourd": "05701",
                    "libelle_equipement_materiel_lourd": "Caméra à scintillation sans détecteur d'émission de positons",
                    "numero_autorisation_arhgos": "02-00-0000",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_équipements_matériels_lourds)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_finess_cs1400104 = pd.DataFrame([xml_contenu_finess_cs1400104_builder({"nofinesset": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_équipements_matériels_lourds(données_finess_cs1400104, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_équipement_matériel_lourd(self) -> None:
        # GIVEN
        données_finess_cs1400104 = pd.DataFrame([xml_contenu_finess_cs1400104_builder({"eml": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_équipements_matériels_lourds(données_finess_cs1400104, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_d_autorisation_arhgos(self) -> None:
        # GIVEN
        données_finess_cs1400104 = pd.DataFrame([xml_contenu_finess_cs1400104_builder({"noautorarhgos": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_équipements_matériels_lourds(données_finess_cs1400104, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_ne_considère_pas_qu_une_seule_fois_un_ensemble_no_finess_eml_et_no_autorisation_arhgos(self) -> None:
        # GIVEN
        données_finess_cs1400104 = pd.DataFrame([xml_contenu_finess_cs1400104_builder(), xml_contenu_finess_cs1400104_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_équipements_matériels_lourds(données_finess_cs1400104, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "date_autorisation": "2004-11-02",
                    "date_fin": "2028-05-29",
                    "date_mise_en_oeuvre": "2006-11-08",
                    "code_equipement_materiel_lourd": "05701",
                    "libelle_equipement_materiel_lourd": "Caméra à scintillation sans détecteur d'émission de positons",
                    "numero_autorisation_arhgos": "02-00-0000",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_équipements_matériels_lourds)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_finess_cs1400104 = pd.DataFrame([xml_contenu_finess_cs1400104_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "123456789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_équipements_matériels_lourds(données_finess_cs1400104, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

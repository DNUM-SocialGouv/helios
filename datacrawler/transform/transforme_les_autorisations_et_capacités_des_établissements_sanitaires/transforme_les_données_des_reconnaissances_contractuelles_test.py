import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.finess_builder import xml_contenu_finess_cs1600102_builder
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_données_des_reconnaissances_contractuelles import (
    transforme_les_données_des_reconnaissances_contractuelles,
)
from datacrawler.transform.équivalences_finess_helios import index_des_autres_activités_sanitaires


class TestTransformeLesDonnéesDesReconnaissancesContractuelles:
    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_finess_cs1600102 = pd.DataFrame([xml_contenu_finess_cs1600102_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_reconnaissances_contractuelles(données_finess_cs1600102, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "capacite_autorisee": 16,
                    "code_activite": "R4",
                    "code_forme": "01",
                    "code_modalite": "N2",
                    "numero_autorisation_arhgos": "07-00-RC00000",
                    "date_effet_asr": "2017-12-30",
                    "date_effet_cpom": "2017-12-30",
                    "date_fin_cpom": "2022-12-29",
                    "numero_cpom": "07-00-C00000",
                    "libelle_activite": "Soins palliatifs",
                    "libelle_forme": "Hospitalisation complète (24 heures consécutives ou plus)",
                    "libelle_modalite": "Lits identifiés  (Médecine) - adulte",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autres_activités_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_finess_cs1600102 = pd.DataFrame([xml_contenu_finess_cs1600102_builder({"nofinesset": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_reconnaissances_contractuelles(données_finess_cs1600102, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_activité(self) -> None:
        # GIVEN
        données_finess_cs1600102 = pd.DataFrame([xml_contenu_finess_cs1600102_builder({"activite": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_reconnaissances_contractuelles(données_finess_cs1600102, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_la_forme(self) -> None:
        # GIVEN
        données_finess_cs1600102 = pd.DataFrame([xml_contenu_finess_cs1600102_builder({"forme": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_reconnaissances_contractuelles(données_finess_cs1600102, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_la_modalité(self) -> None:
        # GIVEN
        données_finess_cs1600102 = pd.DataFrame([xml_contenu_finess_cs1600102_builder({"modalite": NaN})])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_reconnaissances_contractuelles(données_finess_cs1600102, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_ne_considère_pas_qu_une_seule_fois_un_ensemble_no_finess_activité_forme_et_modalité(self) -> None:
        # GIVEN
        données_finess_cs1600102 = pd.DataFrame([xml_contenu_finess_cs1600102_builder(), xml_contenu_finess_cs1600102_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_reconnaissances_contractuelles(données_finess_cs1600102, numéros_finess_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "capacite_autorisee": 16,
                    "code_activite": "R4",
                    "code_forme": "01",
                    "code_modalite": "N2",
                    "numero_autorisation_arhgos": "07-00-RC00000",
                    "date_effet_asr": "2017-12-30",
                    "date_effet_cpom": "2017-12-30",
                    "date_fin_cpom": "2022-12-29",
                    "numero_cpom": "07-00-C00000",
                    "libelle_activite": "Soins palliatifs",
                    "libelle_forme": "Hospitalisation complète (24 heures consécutives ou plus)",
                    "libelle_modalite": "Lits identifiés  (Médecine) - adulte",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autres_activités_sanitaires)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_finess_cs1600102 = pd.DataFrame([xml_contenu_finess_cs1600102_builder()])
        numéros_finess_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "123456789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_reconnaissances_contractuelles(données_finess_cs1600102, numéros_finess_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

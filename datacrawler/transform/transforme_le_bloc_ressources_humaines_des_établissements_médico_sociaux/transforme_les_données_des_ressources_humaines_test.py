import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.diamant_builder import csv_ann_ms_tdp_et_ressources_humaines_builder
from datacrawler.test_helpers.helios_builder import helios_ann_ms_tdp_et_ressources_humaines_builder
from datacrawler.transform.transforme_le_bloc_ressources_humaines_des_établissements_médico_sociaux.transforme_les_données_des_ressources_humaines import (
    transforme_les_données_des_ressources_humaines,
)
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_ressources_humaines


class TestTransformeLesDonnéesDesRessourcesHumaines:
    def test_renomme_des_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame([csv_ann_ms_tdp_et_ressources_humaines_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_ressources_humaines(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2019,
                    "nombre_cdd_remplacement": 19,
                    "taux_etp_vacants": 0.0483,
                    "taux_prestation_externes": 0.0164,
                    "taux_rotation_personnel": 0.1429,
                    "taux_absenteisme_maladie_courte_duree": 0.0021,
                    "taux_absenteisme_maladie_moyenne_duree": 0.0717,
                    "taux_absenteisme_maladie_longue_duree": 0.1194,
                    "taux_absenteisme_maternite_paternite": 0.0,
                    "taux_absenteisme_accident_maladie_professionnelle": 0.0246,
                    "taux_absenteisme_conges_speciaux": 0.0,
                    "taux_absenteisme_hors_formation": 0.2179,
                }
            ],
        ).set_index(index_du_bloc_ressources_humaines)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame([csv_ann_ms_tdp_et_ressources_humaines_builder({"Finess": NaN})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_ressources_humaines(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame([csv_ann_ms_tdp_et_ressources_humaines_builder({"Année": NaN})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_ressources_humaines(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

    def test_renseigne_la_ligne_même_si_aucune_valeur_n_est_renseignée(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame(
            [
                csv_ann_ms_tdp_et_ressources_humaines_builder(
                    {
                        "Nombre de CDD de remplacement": NaN,
                        "Taux d'ETP vacants au 31/12": NaN,
                        "Taux de prestations externes sur les prestations directes": NaN,
                        "Taux de rotation du personnel sur effectifs réels": NaN,
                        "Taux d'absentéisme pour maladie ordinaire/courte durée": NaN,
                        "Taux d'absentéisme pour maladie moyenne durée": NaN,
                        "Taux d'absentéisme pour maladie longue durée": NaN,
                        "Taux d'absentéisme pour maternité/paternité": NaN,
                        "Taux d'absentéisme pour accident du travail / maladie professionnelle": NaN,
                        "Taux d'absentéisme pour congés spéciaux dont sans solde": NaN,
                        "Taux d'absentéisme (hors formation)": NaN,
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
        données_transformées = transforme_les_données_des_ressources_humaines(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2019,
                    "nombre_cdd_remplacement": NaN,
                    "taux_etp_vacants": NaN,
                    "taux_prestation_externes": NaN,
                    "taux_rotation_personnel": NaN,
                    "taux_absenteisme_maladie_courte_duree": NaN,
                    "taux_absenteisme_maladie_moyenne_duree": NaN,
                    "taux_absenteisme_maladie_longue_duree": NaN,
                    "taux_absenteisme_maternite_paternite": NaN,
                    "taux_absenteisme_accident_maladie_professionnelle": NaN,
                    "taux_absenteisme_conges_speciaux": NaN,
                    "taux_absenteisme_hors_formation": NaN,
                }
            ],
        ).set_index(index_du_bloc_ressources_humaines)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame(
            [
                csv_ann_ms_tdp_et_ressources_humaines_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2020,
                        "Nombre de CDD de remplacement": 1,
                    }
                ),
                csv_ann_ms_tdp_et_ressources_humaines_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2020,
                        "Nombre de CDD de remplacement": 2,
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
        données_transformées = transforme_les_données_des_ressources_humaines(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [helios_ann_ms_tdp_et_ressources_humaines_builder({"annee": 2020, "nombre_cdd_remplacement": 1})],
        ).set_index(index_du_bloc_ressources_humaines)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame([csv_ann_ms_tdp_et_ressources_humaines_builder({"Finess": NUMÉRO_FINESS_ÉTABLISSEMENT})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "123456789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_des_ressources_humaines(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

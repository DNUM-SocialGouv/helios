import pandas as pd
from numpy import NaN
from pandas import NA

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.diamant_builder import csv_ann_ms_tdp_et_builder
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_du_tableau_de_bord_de_la_performance import (
    récupère_le_taux_de_réalisation_des_établissements,
    transforme_les_données_ann_ms_tdp_et,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités


class TestTransformeLesDonnéesAnnMsTdpEt:
    def test_renomme_les_colonnes_et_crée_l_index(self) -> None:
        # GIVEN
        données_ann_errd_ej_et = pd.DataFrame([csv_ann_ms_tdp_et_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_ms_tdp_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "nombre_moyen_journees_absence_personnes_accompagnees": 31.41,
                    "duree_moyenne_sejour_accompagnement_personnes_sorties": 904.17,
                    "file_active_personnes_accompagnees": 94,
                    "taux_realisation_activite": 0.9256,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame([csv_ann_ms_tdp_et_builder(), csv_ann_ms_tdp_et_builder({"Finess": "123456789"})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_ms_tdp_et(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        assert données_transformées.shape == (1, 4)

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame(
            [
                csv_ann_ms_tdp_et_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "Nombre moyen de journées d'absence des personnes accompagnées sur la période": 31.41,
                        "Durée moyenne de séjour/d'accompagnement": 904.17,
                        "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": 0.9256,
                        "Taux de réalisation de l’activité CAMSP et CMPP": NaN,
                        "File active des personnes accompagnées sur la période": 94,
                    }
                ),
                csv_ann_ms_tdp_et_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "Nombre moyen de journées d'absence des personnes accompagnées sur la période": 58.61,
                        "Durée moyenne de séjour/d'accompagnement": 603.00,
                        "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": 1.0458,
                        "Taux de réalisation de l’activité CAMSP et CMPP": NaN,
                        "File active des personnes accompagnées sur la période": 116,
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
        données_transformées = transforme_les_données_ann_ms_tdp_et(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "nombre_moyen_journees_absence_personnes_accompagnees": 31.41,
                    "duree_moyenne_sejour_accompagnement_personnes_sorties": 904.17,
                    "file_active_personnes_accompagnees": 94,
                    "taux_realisation_activite": 0.9256,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame(
            [
                csv_ann_ms_tdp_et_builder({"Finess": NaN}),
                csv_ann_ms_tdp_et_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "Nombre moyen de journées d'absence des personnes accompagnées sur la période": 58.61,
                        "Durée moyenne de séjour/d'accompagnement": 603.00,
                        "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": 1.0458,
                        "Taux de réalisation de l’activité CAMSP et CMPP": NaN,
                        "File active des personnes accompagnées sur la période": 116,
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
        données_transformées = transforme_les_données_ann_ms_tdp_et(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "nombre_moyen_journees_absence_personnes_accompagnees": 58.61,
                    "duree_moyenne_sejour_accompagnement_personnes_sorties": 603.00,
                    "file_active_personnes_accompagnees": 116,
                    "taux_realisation_activite": 1.0458,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame([csv_ann_ms_tdp_et_builder({"Année": NA}), csv_ann_ms_tdp_et_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_ms_tdp_et(données_ann_ms_tdp_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "nombre_moyen_journees_absence_personnes_accompagnees": 31.41,
                    "duree_moyenne_sejour_accompagnement_personnes_sorties": 904.17,
                    "file_active_personnes_accompagnees": 94,
                    "taux_realisation_activite": 0.9256,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_renvoie_un_unique_taux_de_réalisation_de_l_activité_pour_chaque_couple_année_et_numéro_finess(self) -> None:
        # GIVEN
        données_ann_ms_tdp_et = pd.DataFrame(
            [
                {
                    "Finess": "111111111",
                    "Année": 2018,
                    "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": 0.48012820512820514,
                    "Taux de réalisation de l’activité CAMSP et CMPP": NaN,
                },
                {
                    "Finess": "222222222",
                    "Année": 2018,
                    "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": NaN,
                    "Taux de réalisation de l’activité CAMSP et CMPP": 0.93698630136986305,
                },
                {
                    "Finess": "333333333",
                    "Année": 2018,
                    "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": NaN,
                    "Taux de réalisation de l’activité CAMSP et CMPP": NaN,
                },
            ]
        )
        # WHEN
        taux_de_réalisation_unique = récupère_le_taux_de_réalisation_des_établissements(données_ann_ms_tdp_et)

        # THEN
        pd.testing.assert_frame_equal(
            taux_de_réalisation_unique,
            pd.DataFrame(
                [
                    {
                        "Finess": "111111111",
                        "Année": 2018,
                        "taux_realisation_activite": 0.48012820512820514,
                    },
                    {
                        "Finess": "222222222",
                        "Année": 2018,
                        "taux_realisation_activite": 0.93698630136986305,
                    },
                    {
                        "Finess": "333333333",
                        "Année": 2018,
                        "taux_realisation_activite": NaN,
                    },
                ]
            ),
        )

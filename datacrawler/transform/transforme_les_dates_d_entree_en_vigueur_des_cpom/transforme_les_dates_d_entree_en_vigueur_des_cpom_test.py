import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.transform.transforme_les_dates_d_entree_en_vigueur_des_cpom.transforme_les_dates_d_entree_en_vigueur_des_cpom import (
    transforme_les_dates_d_entree_en_vigueur_des_cpom,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_dates_d_entrée_en_vigueur_des_cpom


class TestTransformeLesDatesDEntreeEnVigueurDesCpom:
    def test_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        donnees_diamant_ann_ms_tdp_et = pd.DataFrame(
            {
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "Année": [2021],
                "Date d'entrée en vigueur du CPOM": ["01/01/2021"],
            }
        )
        numeros_finess_connus = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        dates_d_entree_en_vigueur_des_cpom = transforme_les_dates_d_entree_en_vigueur_des_cpom(
            donnees_diamant_ann_ms_tdp_et, numeros_finess_connus, mocked_logger
        )

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "date_d_entree_en_vigueur": "2021-01-01",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_dates_d_entrée_en_vigueur_des_cpom)
        pd.testing.assert_frame_equal(dates_d_entree_en_vigueur_des_cpom, data_frame_attendu)

    def test_conserve_uniquement_l_annee_la_plus_recente_pour_chaque_etablissement(self) -> None:
        # GIVEN
        donnees_diamant_ann_ms_tdp_et = pd.DataFrame(
            {
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT],
                "Année": [2021, 2020],
                "Date d'entrée en vigueur du CPOM": ["01/01/2021", "01/01/2020"],
            }
        )
        numeros_finess_connus = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        dates_d_entree_en_vigueur_des_cpom = transforme_les_dates_d_entree_en_vigueur_des_cpom(
            donnees_diamant_ann_ms_tdp_et, numeros_finess_connus, mocked_logger
        )

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "date_d_entree_en_vigueur": "2021-01-01",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_dates_d_entrée_en_vigueur_des_cpom)
        pd.testing.assert_frame_equal(dates_d_entree_en_vigueur_des_cpom, data_frame_attendu)

    def test_ne_conserve_pas_les_lignes_ne_mentionnant_pas_la_date_d_entree_en_vigueur_du_cpom(self) -> None:
        # GIVEN
        donnees_diamant_ann_ms_tdp_et = pd.DataFrame(
            {
                "Finess": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "Année": [2021],
                "Date d'entrée en vigueur du CPOM": [NaN],
            }
        )
        numeros_finess_connus = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        dates_d_entree_en_vigueur_des_cpom = transforme_les_dates_d_entree_en_vigueur_des_cpom(
            donnees_diamant_ann_ms_tdp_et, numeros_finess_connus, mocked_logger
        )

        # THEN
        assert dates_d_entree_en_vigueur_des_cpom.empty

    def test_ne_renvoie_pas_les_etablissements_non_presents_en_base(self) -> None:
        # GIVEN
        donnees_diamant_ann_ms_tdp_et = pd.DataFrame(
            {
                "Finess": ["0987654321"],
                "Année": [2021],
                "Date d'entrée en vigueur du CPOM": ["01/01/2021"],
            }
        )
        numeros_finess_connus = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        dates_d_entree_en_vigueur_des_cpom = transforme_les_dates_d_entree_en_vigueur_des_cpom(
            donnees_diamant_ann_ms_tdp_et, numeros_finess_connus, mocked_logger
        )

        # THEN
        assert dates_d_entree_en_vigueur_des_cpom.empty

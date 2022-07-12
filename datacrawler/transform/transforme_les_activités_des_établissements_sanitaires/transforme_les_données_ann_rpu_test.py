import pandas as pd
from numpy import NaN
from pandas import NA

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, csv_ann_rpu_builder, mocked_logger, helios_ann_rpu_builder
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_données_ann_rpu import (
    transforme_les_données_ann_rpu,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités


class TestTransformeLesDonnéesAnnRpu:
    def test_renomme_les_colonnes_et_crée_l_index(self) -> None:
        # GIVEN
        données_ann_rpu = pd.DataFrame([csv_ann_rpu_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_rpu(données_ann_rpu, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([helios_ann_rpu_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_rpu = pd.DataFrame(
            [
                csv_ann_rpu_builder({"Finess": NA}),
                csv_ann_rpu_builder(),
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
        données_transformées = transforme_les_données_ann_rpu(données_ann_rpu, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([helios_ann_rpu_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_rpu = pd.DataFrame(
            [
                csv_ann_rpu_builder({"Année": NA}),
                csv_ann_rpu_builder(),
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
        données_transformées = transforme_les_données_ann_rpu(données_ann_rpu, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([helios_ann_rpu_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_renseigne_la_ligne_même_si_aucun_taux_n_est_renseigné(self) -> None:
        # GIVEN
        données_ann_rpu = pd.DataFrame(
            [
                csv_ann_rpu_builder(
                    {
                        "Nombre de passages aux urgences": NaN,
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
        données_transformées = transforme_les_données_ann_rpu(données_ann_rpu, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                [
                    helios_ann_rpu_builder(
                        {
                            "nombre_passages_urgences": NaN,
                        }
                    )
                ],
            )
            .set_index(index_des_activités)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_rpu = pd.DataFrame(
            [
                csv_ann_rpu_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "Nombre de passages aux urgences": NaN,
                    }
                ),
                csv_ann_rpu_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "Nombre de passages aux urgences": 100,
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
        données_transformées = transforme_les_données_ann_rpu(données_ann_rpu, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                [
                    helios_ann_rpu_builder(
                        {
                            "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                            "annee": 2018,
                            "nombre_passages_urgences": NaN,
                        }
                    )
                ],
            )
            .set_index(index_des_activités)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(données_transformées.sort_index(axis=1), data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_rpu = pd.DataFrame([csv_ann_rpu_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "234567891",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_rpu(données_ann_rpu, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        assert données_transformées.shape[0] == 0

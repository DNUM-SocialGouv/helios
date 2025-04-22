import pandas as pd
from numpy import NaN
from pandas import NA

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.diamant_builder import csv_ann_sae_activite_builder
from datacrawler.test_helpers.helios_builder import helios_ann_sae_activite_builder
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.transforme_les_donnees_du_nombre_de_journees_usld import (
    transforme_les_donnees_usld,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités


class TestTransformeLesDonneesUSLD:
    def test_renomme_les_colonnes_et_cree_l_index(self) -> None:
        # GIVEN
        donnees_ann_sae_activite = pd.DataFrame([csv_ann_sae_activite_builder()])
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_usld(donnees_ann_sae_activite, numeros_finess_des_etablissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([helios_ann_sae_activite_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(donnees_transformees.sort_index(axis=1), data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numero_finess(self) -> None:
        # GIVEN
        donnees_ann_sae_activite = pd.DataFrame(
            [
                csv_ann_sae_activite_builder({"Finess": NA}),
                csv_ann_sae_activite_builder(),
            ]
        )
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_usld(donnees_ann_sae_activite, numeros_finess_des_etablissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([helios_ann_sae_activite_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(donnees_transformees.sort_index(axis=1), data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_annee(self) -> None:
        # GIVEN
        donnees_ann_sae_activite = pd.DataFrame(
            [
                csv_ann_sae_activite_builder({"Année": NA}),
                csv_ann_sae_activite_builder(),
            ]
        )
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_usld(donnees_ann_sae_activite, numeros_finess_des_etablissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame([helios_ann_sae_activite_builder()]).set_index(index_des_activités).sort_index(axis=1)
        pd.testing.assert_frame_equal(donnees_transformees.sort_index(axis=1), data_frame_attendu)

    def test_renseigne_la_ligne_meme_si_la_donnee_usld_n_est_pas_renseigne(self) -> None:
        # GIVEN
        donnees_ann_sae_activite = pd.DataFrame(
            [
                csv_ann_sae_activite_builder(
                    {
                        "Nombre journées USLD": NaN,
                    }
                ),
            ]
        )
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_usld(donnees_ann_sae_activite, numeros_finess_des_etablissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                [
                    helios_ann_sae_activite_builder(
                        {
                            "nombre_journees_usld": NaN,
                        }
                    )
                ],
            )
            .set_index(index_des_activités)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(donnees_transformees.sort_index(axis=1), data_frame_attendu)

    def test_ne_considere_qu_une_seule_fois_un_meme_couple_annee_numero_finess(self) -> None:
        # GIVEN
        donnees_ann_sae_activite = pd.DataFrame(
            [
                csv_ann_sae_activite_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "Nombre journées USLD": NaN,
                    }
                ),
                csv_ann_sae_activite_builder(
                    {
                        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "Année": 2018,
                        "Nombre journées USLD": 15798.0,
                    }
                ),
            ]
        )
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_usld(donnees_ann_sae_activite, numeros_finess_des_etablissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                [
                    helios_ann_sae_activite_builder(
                        {
                            "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                            "annee": 2018,
                            "nombre_journees_usld": NaN,
                        }
                    )
                ],
            )
            .set_index(index_des_activités)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(donnees_transformees.sort_index(axis=1), data_frame_attendu)

    def test_ne_renvoie_pas_les_etablissements_non_presents_en_base(self) -> None:
        # GIVEN
        donnees_ann_sae_activite = pd.DataFrame([csv_ann_sae_activite_builder()])
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "234567891",
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_usld(donnees_ann_sae_activite, numeros_finess_des_etablissements_connus, mocked_logger)

        # THEN
        assert donnees_transformees.empty

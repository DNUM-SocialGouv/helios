import pandas as pd
from numpy import NaN
from pandas import NA

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_ann_errd_ej_et import (
    transforme_les_données_ann_errd_ej_et,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités


class TestTransformeLesDonnéesAnnErrdEjEt:
    def test_renomme_les_colonnes_et_crée_l_index(self) -> None:
        # GIVEN
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                }
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
        données_transformées = transforme_les_données_ann_errd_ej_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NaN,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                },
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                },
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
        données_transformées = transforme_les_données_ann_errd_ej_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": NA,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                }
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
        données_transformées = transforme_les_données_ann_errd_ej_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                columns=[
                    "numero_finess_etablissement_territorial",
                    "annee",
                    "taux_occupation_accueil_de_jour",
                    "taux_occupation_en_hebergement_temporaire",
                    "taux_occupation_en_hebergement_permanent",
                ],
            )
            .astype(
                {
                    "numero_finess_etablissement_territorial": str,
                    "annee": int,
                    "taux_occupation_accueil_de_jour": float,
                    "taux_occupation_en_hebergement_temporaire": float,
                    "taux_occupation_en_hebergement_permanent": float,
                }
            )
            .set_index(index_des_activités)
        )
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_renseigne_la_ligne_même_si_aucun_taux_n_est_renseigné(self) -> None:
        # GIVEN
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": NaN,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": NaN,
                    "Taux d'occupation des places autorisées en hébergement permanent": NaN,
                }
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
        données_transformées = transforme_les_données_ann_errd_ej_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": NaN,
                    "taux_occupation_en_hebergement_temporaire": NaN,
                    "taux_occupation_en_hebergement_permanent": NaN,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": NaN,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                },
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": NaN,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
                    "Taux d'occupation des places autorisées en hébergement permanent": NaN,
                },
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
        données_transformées = transforme_les_données_ann_errd_ej_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_en_hebergement_temporaire": NaN,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                }
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "234567891",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_ann_errd_ej_et(données_ann_errd_ej_et, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        assert données_transformées.empty

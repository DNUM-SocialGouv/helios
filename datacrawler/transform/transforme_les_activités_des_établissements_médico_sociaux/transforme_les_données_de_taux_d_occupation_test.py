import pandas as pd
from numpy import NaN
from pandas import NA

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.transforme_les_données_de_taux_d_occupation import (
    transforme_les_donnees_ann_errd_ej_et,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités


class TestTransformeLesDonneesAnnErrdEjEt:
    def test_renomme_les_colonnes_et_cree_l_index(self) -> None:
        # GIVEN
        donnees_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                    "Taux d'occupation Externat Autres ESMS": 0.99779299847793002,
                    "Taux d'occupation Semi-internat Autres ESMS": 0.99779299847793002,
                    "Taux d'occupation Internat Autres ESMS": 0.99779299847793002,
                    "Taux d'occupation Autre 1, 2 et 3 Autres ESMS": 0.99779299847793002,
                }
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
        donnees_transformees = transforme_les_donnees_ann_errd_ej_et(donnees_ann_errd_ej_et, numeros_finess_des_etablissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                    "taux_occupation_externat": 0.99779299847793002,
                    "taux_occupation_semi_internat": 0.99779299847793002,
                    "taux_occupation_internat": 0.99779299847793002,
                    "taux_occupation_autre": 0.99779299847793002,
                }
            ],
        )
        pd.testing.assert_frame_equal(donnees_transformees, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numero_finess(self) -> None:
        # GIVEN
        donnees_ann_errd_ej_et = pd.DataFrame(
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
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_ann_errd_ej_et(donnees_ann_errd_ej_et, numeros_finess_des_etablissements_connus, mocked_logger)

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
        )
        pd.testing.assert_frame_equal(donnees_transformees.reset_index(drop=True), data_frame_attendu.reset_index(drop=True))

    def test_supprime_les_lignes_ne_mentionnant_pas_l_annee(self) -> None:
        # GIVEN
        donnees_ann_errd_ej_et = pd.DataFrame(
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
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_ann_errd_ej_et(donnees_ann_errd_ej_et, numeros_finess_des_etablissements_connus, mocked_logger)

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

        )
        pd.testing.assert_frame_equal(donnees_transformees.reset_index(drop=True), data_frame_attendu.reset_index(drop=True), check_dtype=False)

    def test_renseigne_la_ligne_meme_si_aucun_taux_n_est_renseigne(self) -> None:
        # GIVEN
        donnees_ann_errd_ej_et = pd.DataFrame(
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
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_ann_errd_ej_et(donnees_ann_errd_ej_et, numeros_finess_des_etablissements_connus, mocked_logger)

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
        )
        pd.testing.assert_frame_equal(donnees_transformees, data_frame_attendu, check_index_type=False)

    def test_ne_considere_qu_une_seule_fois_un_meme_couple_annee_numero_finess(self) -> None:
        # GIVEN
        donnees_ann_errd_ej_et = pd.DataFrame(
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
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_ann_errd_ej_et(donnees_ann_errd_ej_et, numeros_finess_des_etablissements_connus, mocked_logger)

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
        )
        pd.testing.assert_frame_equal(donnees_transformees, data_frame_attendu, check_index_type=False)

    def test_ne_renvoie_pas_les_etablissements_non_presents_en_base(self) -> None:
        # GIVEN
        donnees_ann_errd_ej_et = pd.DataFrame(
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
        numeros_finess_des_etablissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "234567891",
                }
            ]
        )

        # WHEN
        donnees_transformees = transforme_les_donnees_ann_errd_ej_et(donnees_ann_errd_ej_et, numeros_finess_des_etablissements_connus, mocked_logger)

        # THEN
        assert donnees_transformees.empty

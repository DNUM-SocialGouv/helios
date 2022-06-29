from unittest.mock import MagicMock

import pandas as pd
from numpy import NaN

from datacrawler.transform.diamant.équivalences_diamant_helios import index_des_activités_médico_sociales
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import transforme_les_activités_des_établissements_médico_sociaux


class TestTransformeLesActivitésDesÉtablissementsMédicoSociaux:
    def test_lis_le_fichier_diamant_renomme_les_colonnes_et_crée_l_index(self):
        # GIVEN
        logger = MagicMock()
        numéro_finess_établissement = "010001261"
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": numéro_finess_établissement,
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
                    "numérofinessÉtablissementterritorial": numéro_finess_établissement,
                }
            ]
        )

        # WHEN

        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(données_ann_errd_ej_et,
                                                                                          numéros_finess_des_établissements_connus,
                                                                                          logger)
        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numérofinessÉtablissementterritorial": "010001261",
                    "année": 2018,
                    "tauxoccupationaccueildejour": 0.48012820512820514,
                    "tauxoccupationhébergementtemporaire": 0.93698630136986305,
                    "tauxoccupationhébergementpermanent": 0.99779299847793002,
                }
            ],
        ).set_index(index_des_activités_médico_sociales)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self):
        # GIVEN
        logger = MagicMock()
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": NaN,
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
                    "numérofinessÉtablissementterritorial": "123456789",
                }
            ]
        )

        # WHEN

        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(données_ann_errd_ej_et,
                                                                                          numéros_finess_des_établissements_connus,
                                                                                          logger)
        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                columns=[
                    "numérofinessÉtablissementterritorial",
                    "année",
                    "tauxoccupationaccueildejour",
                    "tauxoccupationhébergementtemporaire",
                    "tauxoccupationhébergementpermanent",
                ],
            )
            .astype(
                {
                    "numérofinessÉtablissementterritorial": str,
                    "année": int,
                    "tauxoccupationaccueildejour": float,
                    "tauxoccupationhébergementtemporaire": float,
                    "tauxoccupationhébergementpermanent": float,
                }
            )
            .set_index(index_des_activités_médico_sociales)
        )
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self):
        # GIVEN
        logger = MagicMock()
        numéro_finess_établissement = "010001261"
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": numéro_finess_établissement,
                    "Année": NaN,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                }
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numérofinessÉtablissementterritorial": numéro_finess_établissement,
                }
            ]
        )

        # WHEN

        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(données_ann_errd_ej_et,
                                                                                          numéros_finess_des_établissements_connus,
                                                                                          logger)
        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                columns=[
                    "numérofinessÉtablissementterritorial",
                    "année",
                    "tauxoccupationaccueildejour",
                    "tauxoccupationhébergementtemporaire",
                    "tauxoccupationhébergementpermanent",
                ],
            )
            .astype(
                {
                    "numérofinessÉtablissementterritorial": str,
                    "année": int,
                    "tauxoccupationaccueildejour": float,
                    "tauxoccupationhébergementtemporaire": float,
                    "tauxoccupationhébergementpermanent": float,
                }
            )
            .set_index(index_des_activités_médico_sociales)
        )
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_renseigne_la_ligne_même_si_aucun_taux_n_est_renseigné(self):
        # GIVEN
        logger = MagicMock()
        numéro_finess_établissement = "010001261"
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": numéro_finess_établissement,
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
                    "numérofinessÉtablissementterritorial": numéro_finess_établissement,
                }
            ]
        )

        # WHEN

        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(données_ann_errd_ej_et,
                                                                                          numéros_finess_des_établissements_connus,
                                                                                          logger)
        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numérofinessÉtablissementterritorial": numéro_finess_établissement,
                    "année": 2018,
                    "tauxoccupationaccueildejour": NaN,
                    "tauxoccupationhébergementtemporaire": NaN,
                    "tauxoccupationhébergementpermanent": NaN,
                }
            ],
        ).set_index(index_des_activités_médico_sociales)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self):
        # GIVEN
        logger = MagicMock()
        numéro_finess_établissement = "010001261"
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": numéro_finess_établissement,
                    "Année": 2018,
                    "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514,
                    "Taux d'occupation des lits autorisés en hébergement temporaire": NaN,
                    "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
                },
                {
                    "Finess": numéro_finess_établissement,
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
                    "numérofinessÉtablissementterritorial": numéro_finess_établissement,
                }
            ]
        )

        # WHEN

        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(données_ann_errd_ej_et,
                                                                                          numéros_finess_des_établissements_connus,
                                                                                          logger)
        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numérofinessÉtablissementterritorial": numéro_finess_établissement,
                    "année": 2018,
                    "tauxoccupationaccueildejour": 0.48012820512820514,
                    "tauxoccupationhébergementtemporaire": NaN,
                    "tauxoccupationhébergementpermanent": 0.99779299847793002,
                }
            ],
        ).set_index(index_des_activités_médico_sociales)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self):
        # GIVEN
        logger = MagicMock()
        données_ann_errd_ej_et = pd.DataFrame(
            [
                {
                    "Finess": "010001261",
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
                    "numérofinessÉtablissementterritorial": "234567891",
                }
            ]
        )

        # WHEN

        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(données_ann_errd_ej_et,
                                                                                          numéros_finess_des_établissements_connus,
                                                                                          logger)
        # THEN
        assert données_transformées.shape == (0, 3)

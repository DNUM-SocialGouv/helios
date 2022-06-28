from unittest.mock import MagicMock

import pandas as pd
from numpy import NaN

from datacrawler.load.activités_des_établissements_médico_sociaux import TableActivitésDesÉtablissementsMédicoSociaux
from datacrawler.transform.diamant.ann_errd_ej_et import ColonnesDuFichierAnnErrdEjEt
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import transforme_les_activités_des_établissements_médico_sociaux


class TestTransformeLesActivitésDesÉtablissementsMédicoSociaux:
    def test_lis_le_fichier_diamant_renomme_les_colonnes_et_crée_l_index(self):
        # GIVEN
        chemin_du_fichier = "chemin/vers_le.csv"
        lis_le_fichier_csv = MagicMock()
        données_diamant = pd.DataFrame(
            [
                {
                    ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: "010001261",
                    ColonnesDuFichierAnnErrdEjEt.année: 2018,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: 0.48012820512820514,
                }
            ]
        )
        lis_le_fichier_csv.return_value = données_diamant

        # WHEN
        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, lis_le_fichier_csv)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: "010001261",
                    TableActivitésDesÉtablissementsMédicoSociaux.année: 2018,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: 0.48012820512820514,
                }
            ],
        ).set_index([TableActivitésDesÉtablissementsMédicoSociaux.année, TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial])
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)
        colonnes_attendues = [
            ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial,
            ColonnesDuFichierAnnErrdEjEt.année,
            ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent,
            ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire,
            ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour,
        ]
        types_attendus = {
            ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: str,
            ColonnesDuFichierAnnErrdEjEt.année: int,
            ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: float,
            ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: float,
            ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: float,
        }
        lis_le_fichier_csv.assert_called_once_with(chemin_du_fichier, colonnes_attendues, types_attendus)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self):
        # GIVEN
        chemin_du_fichier = "chemin/vers_le.csv"
        lis_le_fichier_csv = MagicMock()
        données_diamant = pd.DataFrame(
            [
                {
                    ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: NaN,
                    ColonnesDuFichierAnnErrdEjEt.année: 2018,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: 0.48012820512820514,
                }
            ]
        )
        lis_le_fichier_csv.return_value = données_diamant

        # WHEN
        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, lis_le_fichier_csv)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                columns=[
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial,
                    TableActivitésDesÉtablissementsMédicoSociaux.année,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour,
                ],
            )
            .astype(
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: str,
                    TableActivitésDesÉtablissementsMédicoSociaux.année: int,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: float,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: float,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: float,
                }
            )
            .set_index(
                [TableActivitésDesÉtablissementsMédicoSociaux.année, TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial]
            )
        )
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self):
        # GIVEN
        chemin_du_fichier = "chemin/vers_le.csv"
        lis_le_fichier_csv = MagicMock()
        données_diamant = pd.DataFrame(
            [
                {
                    ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: "010001261",
                    ColonnesDuFichierAnnErrdEjEt.année: NaN,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: 0.48012820512820514,
                }
            ]
        )
        lis_le_fichier_csv.return_value = données_diamant

        # WHEN
        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, lis_le_fichier_csv)

        # THEN
        data_frame_attendu = (
            pd.DataFrame(
                columns=[
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial,
                    TableActivitésDesÉtablissementsMédicoSociaux.année,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour,
                ],
            )
            .astype(
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: str,
                    TableActivitésDesÉtablissementsMédicoSociaux.année: int,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: float,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: float,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: float,
                }
            )
            .set_index(
                [TableActivitésDesÉtablissementsMédicoSociaux.année, TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial]
            )
        )
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_renseigne_la_ligne_même_si_aucun_taux_n_est_renseigné(self):
        # GIVEN
        chemin_du_fichier = "chemin/vers_le.csv"
        lis_le_fichier_csv = MagicMock()
        données_diamant = pd.DataFrame(
            [
                {
                    ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: "010001261",
                    ColonnesDuFichierAnnErrdEjEt.année: 2018,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: NaN,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: NaN,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: NaN,
                }
            ]
        )
        lis_le_fichier_csv.return_value = données_diamant

        # WHEN
        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, lis_le_fichier_csv)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: "010001261",
                    TableActivitésDesÉtablissementsMédicoSociaux.année: 2018,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: NaN,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: NaN,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: NaN,
                }
            ],
        ).set_index([TableActivitésDesÉtablissementsMédicoSociaux.année, TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial])
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self):
        # GIVEN
        chemin_du_fichier = "chemin/vers_le.csv"
        lis_le_fichier_csv = MagicMock()
        données_diamant = pd.DataFrame(
            [
                {
                    ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: "010001261",
                    ColonnesDuFichierAnnErrdEjEt.année: 2018,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: NaN,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: 0.48012820512820514,
                },
                {
                    ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: "010001261",
                    ColonnesDuFichierAnnErrdEjEt.année: 2018,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: NaN,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: NaN,
                },
            ]
        )
        lis_le_fichier_csv.return_value = données_diamant

        # WHEN
        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, lis_le_fichier_csv)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: "010001261",
                    TableActivitésDesÉtablissementsMédicoSociaux.année: 2018,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: NaN,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: 0.48012820512820514,
                }
            ],
        ).set_index([TableActivitésDesÉtablissementsMédicoSociaux.année, TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial])
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu, check_index_type=False)

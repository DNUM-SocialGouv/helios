from unittest.mock import MagicMock, Mock, patch

import pandas as pd
import pytest
from numpy import NaN

import datacrawler
from datacrawler.ajoute_les_activités_des_établissements_médico_sociaux import ajoute_les_activités_des_établissements_médico_sociaux
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.test_helpers import (
    base_de_données_test,
    supprime_les_données_des_tables,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_activité_en_base,
    sauvegarde_une_entité_juridique_en_base,
)


class TestAjouteLesActivitésDesÉtablissementsSanitaires:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_les_données_dans_une_table_vide(self) -> None:
        # GIVEN
        chemin_du_fichier_men_pmsi_annuel = "data_set/diamant/MEN_PMSI_ANNUEL_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        logger = MagicMock()

        # WHEN
        ajoute_les_activités_des_établissements_sanitaires(chemin_du_fichier_men_pmsi_annuel, base_de_données_test, logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
                "annee": [2017],
                "numero_finess_etablissement_territorial": ["010003598"],
                "nombre_sejours_partiels_medecine": [1],
                "nombre_sejours_partiels_obstetrique": [NaN],
                "nombre_sejours_partiels_chirurgie": [NaN],
                "nombre_sejours_complets_medecine": [255],
                "nombre_sejours_complets_obstetrique": [NaN],
                "nombre_sejours_complets_chirurgie": [6],
                "nombre_journees_completes_ssr": [1074],
                "nombre_journees_partiels_ssr": [],
                "nombre_journees_complete_psy": [],
                "nombre_journées_partielles_psy": [],
            }
        )

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pd.testing.assert_frame_equal(data_frame, data_frame_attendu)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ms_tdp_et = "data_set/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010786259", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010789717", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010001261", "010008407", base_de_données_test)
        table_activité_existante = pd.DataFrame(
            {
                "annee": [2018, 2019],
                "numero_finess_etablissement_territorial": ["010003598", "010003598"],
                "taux_occupation_accueil_de_jour": [0.48012820512820514, NaN],
                "taux_occupation_en_hebergement_temporaire": [0.93698630136986305, NaN],
                "taux_occupation_en_hebergement_permanent": [0.99779299847793002, NaN],
                "taux_realisation_activite": [0.8993, 1.0182],
                "file_active_personnes_accompagnees": [121.0, NaN],
                "nombre_moyen_journees_absence_personnes_accompagnees": [17.86, 18.52],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [2359.81, 2226.21],
            }
        )
        sauvegarde_une_activité_en_base(table_activité_existante, base_de_données_test)

        logger = MagicMock()

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier_ann_errd_ej_et, chemin_du_fichier_ann_ms_tdp_et, base_de_données_test, logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
                "annee": [2018, 2018, 2018, 2019, 2019, 2019, 2020],
                "numero_finess_etablissement_territorial": ["010001261", "010003598", "010786259", "010001261", "010003598", "010789717", "010003598"],
                "taux_occupation_accueil_de_jour": [NaN, 0.4801282051282051, 0.8486301369863014, NaN, 0.3615384615384615, NaN, 0.3397435897435897],
                "taux_occupation_en_hebergement_temporaire": [
                    NaN,
                    0.936986301369863,
                    1.0972602739726027,
                    NaN,
                    0.2513661202185792,
                    0.8136986301369862,
                    0.758904109589041,
                ],
                "taux_occupation_en_hebergement_permanent": [NaN, 0.99779299847793, 0.9953224189776144, NaN, 0.9324506094997898, NaN, 0.9902397260273972],
                "taux_realisation_activite": [1.0458, 0.8993, NaN, 1.052, 1.0182, NaN, NaN],
                "file_active_personnes_accompagnees": [55.0, 121.0, NaN, 59.0, 119.0, NaN, NaN],
                "nombre_moyen_journees_absence_personnes_accompagnees": [32.11, 17.86, NaN, 31.41, 18.52, NaN, NaN],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [6008.33, 2359.81, NaN, 5729.5, 2226.21, NaN, NaN],
            }
        )

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pd.testing.assert_frame_equal(data_frame, data_frame_attendu)

    @patch.object(datacrawler.ajoute_les_activités_des_établissements_médico_sociaux, "sauvegarde_les_activités_des_établissements_médico_sociaux")
    def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(
        self, mocked_sauvegarde_les_activités_des_établissements_médico_sociaux: Mock
    ) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        chemin_du_fichier_ann_errd_ej_et = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ms_tdp_et = "data_set/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        table_activité_existante = pd.DataFrame(
            {
                "annee": [2018, 2019],
                "numero_finess_etablissement_territorial": ["010003598", "010003598"],
                "taux_occupation_accueil_de_jour": [0.48012820512820514, NaN],
                "taux_occupation_en_hebergement_temporaire": [0.93698630136986305, NaN],
                "taux_occupation_en_hebergement_permanent": [0.99779299847793002, NaN],
                "taux_realisation_activite": [0.8993, 1.0182],
                "file_active_personnes_accompagnees": [121.0, NaN],
                "nombre_moyen_journees_absence_personnes_accompagnees": [17.86, 18.52],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [2359.81, 2226.21],
            }
        )
        sauvegarde_une_activité_en_base(table_activité_existante, base_de_données_test)

        logger = MagicMock()

        mocked_sauvegarde_les_activités_des_établissements_médico_sociaux.side_effect = ValueError()

        # WHEN
        with pytest.raises(ValueError):
            ajoute_les_activités_des_établissements_médico_sociaux(
                chemin_du_fichier_ann_errd_ej_et, chemin_du_fichier_ann_ms_tdp_et, base_de_données_test, logger
            )

        # THEN
        table_activité = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pd.testing.assert_frame_equal(table_activité, table_activité_existante)

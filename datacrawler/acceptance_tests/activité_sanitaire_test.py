from unittest.mock import Mock, patch

import pandas as pd
import pytest
from numpy import NaN

import datacrawler
from datacrawler.ajoute_les_activités_des_établissements_sanitaires import ajoute_les_activités_des_établissements_sanitaires

from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_activité_en_base,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)


class TestAjouteLesActivitésDesÉtablissementsSanitaires:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_les_données_dans_une_table_vide(self) -> None:
        # GIVEN
        chemin_du_fichier_men_pmsi_annuel = "data_set/diamant/MEN_PMSI_ANNUEL_2022_06_07.CSV"
        chemin_du_fichier_ann_rpu = "data_set/diamant/ANN_RPU_2022_06_23.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_une_entité_juridique_en_base("2A0000204", base_de_données_test)
        sauvegarde_un_établissement_en_base("010005239", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("2A0000154", "2A0000204", base_de_données_test)

        # WHEN
        ajoute_les_activités_des_établissements_sanitaires(chemin_du_fichier_men_pmsi_annuel, chemin_du_fichier_ann_rpu, base_de_données_test, mocked_logger)

        # THEN
        activité_attendue = pd.DataFrame(
            {
                "annee": [2016, 2017, 2018, 2019],
                "numero_finess_etablissement_territorial": ["2A0000154", "010005239", "010005239", "010005239"],
                "nombre_sejours_partiels_medecine": [NaN, 1.0, 3.0, 4.0],
                "nombre_sejours_partiels_obstetrique": [NaN, 10.0, NaN, NaN],
                "nombre_sejours_partiels_chirurgie": [NaN, 20.0, NaN, NaN],
                "nombre_sejours_complets_medecine": [NaN, 255.0, 232.0, 231.0],
                "nombre_sejours_complets_obstetrique": [NaN, 10.0, NaN, NaN],
                "nombre_sejours_complets_chirurgie": [NaN, 6.0, 10.0, 9.0],
                "nombre_journees_completes_ssr": [NaN, 1074.0, 1103.0, 1087.0],
                "nombre_journees_partiels_ssr": [NaN, 100.0, NaN, NaN],
                "nombre_journees_complete_psy": [NaN, 200.0, NaN, NaN],
                "nombre_journées_partielles_psy": [NaN, 300.0, NaN, NaN],
                "nombre_passages_urgences": [10296, NaN, 24032, 23987],
            }
        )

        activité_enregistrée = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(activité_enregistrée, activité_attendue)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        chemin_du_fichier_men_pmsi_annuel = "data_set/diamant/MEN_PMSI_ANNUEL_2022_06_07.CSV"
        chemin_du_fichier_ann_rpu = "data_set/diamant/ANN_RPU_2022_06_23.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_une_entité_juridique_en_base("2A0000204", base_de_données_test)
        sauvegarde_un_établissement_en_base("010005239", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("2A0000154", "2A0000204", base_de_données_test)
        activité_existante = pd.DataFrame(
            {
                "annee": [2017],
                "numero_finess_etablissement_territorial": ["010005239"],
                "nombre_sejours_partiels_medecine": [1.0],
                "nombre_sejours_partiels_obstetrique": [NaN],
                "nombre_sejours_partiels_chirurgie": [NaN],
                "nombre_sejours_complets_medecine": [255.0],
                "nombre_sejours_complets_obstetrique": [3.0],
                "nombre_sejours_complets_chirurgie": [6.0],
                "nombre_journees_completes_ssr": [1074.0],
                "nombre_journees_partiels_ssr": [NaN],
                "nombre_journees_complete_psy": [4.0],
                "nombre_journées_partielles_psy": [NaN],
                "nombre_passages_urgences": [10],
            }
        )
        sauvegarde_une_activité_en_base(activité_existante, base_de_données_test, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES)

        # WHEN
        ajoute_les_activités_des_établissements_sanitaires(chemin_du_fichier_men_pmsi_annuel, chemin_du_fichier_ann_rpu, base_de_données_test, mocked_logger)

        # THEN
        activité_attendue = pd.DataFrame(
            {
                "annee": [2016, 2017, 2018, 2019],
                "numero_finess_etablissement_territorial": ["2A0000154", "010005239", "010005239", "010005239"],
                "nombre_sejours_partiels_medecine": [NaN, 1.0, 3.0, 4.0],
                "nombre_sejours_partiels_obstetrique": [NaN, 10.0, NaN, NaN],
                "nombre_sejours_partiels_chirurgie": [NaN, 20.0, NaN, NaN],
                "nombre_sejours_complets_medecine": [NaN, 255.0, 232.0, 231.0],
                "nombre_sejours_complets_obstetrique": [NaN, 10.0, NaN, NaN],
                "nombre_sejours_complets_chirurgie": [NaN, 6.0, 10.0, 9.0],
                "nombre_journees_completes_ssr": [NaN, 1074.0, 1103.0, 1087.0],
                "nombre_journees_partiels_ssr": [NaN, 100.0, NaN, NaN],
                "nombre_journees_complete_psy": [NaN, 200.0, NaN, NaN],
                "nombre_journées_partielles_psy": [NaN, 300.0, NaN, NaN],
                "nombre_passages_urgences": [10296, NaN, 24032, 23987],
            }
        )

        activité_enregistrée = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(activité_enregistrée, activité_attendue)

    @patch.object(datacrawler.ajoute_les_activités_des_établissements_sanitaires, "sauvegarde")
    def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde: Mock) -> None:
        # GIVEN
        chemin_du_fichier_men_pmsi_annuel = "data_set/diamant/MEN_PMSI_ANNUEL_2022_06_07.CSV"
        chemin_du_fichier_ann_rpu = "data_set/diamant/ANN_RPU_2022_06_23.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        activité_existante = pd.DataFrame(
            {
                "annee": [2017, 2018],
                "numero_finess_etablissement_territorial": ["010003598", "010003598"],
                "nombre_sejours_partiels_medecine": [1.0, NaN],
                "nombre_sejours_partiels_obstetrique": [NaN, NaN],
                "nombre_sejours_partiels_chirurgie": [NaN, NaN],
                "nombre_sejours_complets_medecine": [255.0, NaN],
                "nombre_sejours_complets_obstetrique": [NaN, NaN],
                "nombre_sejours_complets_chirurgie": [6.0, NaN],
                "nombre_journees_completes_ssr": [1074.0, NaN],
                "nombre_journees_partiels_ssr": [NaN, NaN],
                "nombre_journees_complete_psy": [NaN, NaN],
                "nombre_journées_partielles_psy": [NaN, NaN],
                "nombre_passages_urgences": [NaN, NaN],
            }
        )
        sauvegarde_une_activité_en_base(activité_existante, base_de_données_test, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES)

        mocked_sauvegarde.side_effect = ValueError()

        # WHEN
        with pytest.raises(ValueError):
            ajoute_les_activités_des_établissements_sanitaires(
                chemin_du_fichier_men_pmsi_annuel, chemin_du_fichier_ann_rpu, base_de_données_test, mocked_logger
            )

        # THEN
        table_activité = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(table_activité, activité_existante)

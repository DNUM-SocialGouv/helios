from unittest.mock import MagicMock, Mock, patch

import pandas as pd
import pytest
from numpy import NaN

import datacrawler
from datacrawler.ajoute_les_activités_des_établissements_médico_sociaux import ajoute_les_activités_des_établissements_médico_sociaux
from datacrawler.ajoute_les_activités_des_établissements_sanitaires import ajoute_les_activités_des_établissements_sanitaires
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES
from datacrawler.test_helpers import (
    base_de_données_test,
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
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        logger = MagicMock()

        # WHEN
        ajoute_les_activités_des_établissements_sanitaires(chemin_du_fichier_men_pmsi_annuel, base_de_données_test, logger)

        # THEN
        activité_attendue = pd.DataFrame(
            {
                "annee": [2017],
                "numero_finess_etablissement_territorial": ["010003598"],
                "nombre_sejours_partiels_medecine": [1.0],
                "nombre_sejours_partiels_obstetrique": [NaN],
                "nombre_sejours_partiels_chirurgie": [NaN],
                "nombre_sejours_complets_medecine": [255.0],
                "nombre_sejours_complets_obstetrique": [NaN],
                "nombre_sejours_complets_chirurgie": [6.0],
                "nombre_journees_completes_ssr": [1074.0],
                "nombre_journees_partiels_ssr": [NaN],
                "nombre_journees_complete_psy": [NaN],
                "nombre_journées_partielles_psy": [NaN],
            }
        )

        activité_enregistrée = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(activité_enregistrée, activité_attendue)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        chemin_du_fichier_men_pmsi_annuel = "data_set/diamant/MEN_PMSI_ANNUEL_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        activité_existante = pd.DataFrame(
            {
                "annee": [2017],
                "numero_finess_etablissement_territorial": ["010003598"],
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
            }
        )
        sauvegarde_une_activité_en_base(activité_existante, base_de_données_test, "activité_sanitaire")

        logger = MagicMock()

        # WHEN
        ajoute_les_activités_des_établissements_sanitaires(chemin_du_fichier_men_pmsi_annuel, base_de_données_test, logger)

        # THEN
        activité_attendue = pd.DataFrame(
            {
                "annee": [2017],
                "numero_finess_etablissement_territorial": ["010003598"],
                "nombre_sejours_partiels_medecine": [1.0],
                "nombre_sejours_partiels_obstetrique": [NaN],
                "nombre_sejours_partiels_chirurgie": [NaN],
                "nombre_sejours_complets_medecine": [255.0],
                "nombre_sejours_complets_obstetrique": [NaN],
                "nombre_sejours_complets_chirurgie": [6.0],
                "nombre_journees_completes_ssr": [1074.0],
                "nombre_journees_partiels_ssr": [NaN],
                "nombre_journees_complete_psy": [NaN],
                "nombre_journées_partielles_psy": [NaN],
            }
        )

        activité_enregistrée = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(activité_enregistrée, activité_attendue)

    @patch.object(datacrawler.ajoute_les_activités_des_établissements_médico_sociaux, "sauvegarde_les_activités_des_établissements_médico_sociaux")
    def skip_test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(
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
        sauvegarde_une_activité_en_base(table_activité_existante, base_de_données_test, "activité_sanitaire")

        logger = MagicMock()

        mocked_sauvegarde_les_activités_des_établissements_médico_sociaux.side_effect = ValueError()

        # WHEN
        with pytest.raises(ValueError):
            ajoute_les_activités_des_établissements_médico_sociaux(
                chemin_du_fichier_ann_errd_ej_et, chemin_du_fichier_ann_ms_tdp_et, base_de_données_test, logger
            )

        # THEN
        table_activité = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(table_activité, table_activité_existante)

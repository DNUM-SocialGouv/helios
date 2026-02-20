from datetime import date
from unittest.mock import Mock, patch

import pandas as pd
import pytest
from freezegun import freeze_time
from numpy import nan
from sqlalchemy import text

import datacrawler
from datacrawler.ajoute_les_activités_des_établissements_sanitaires import ajoute_les_activites_des_etablissements_sanitaires
from datacrawler.load.nom_des_tables import (
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    FichierSource,
)
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_activité_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
    CHEMIN_FICHIER_MEN_PMSI_ANNUEL,
    CHEMIN_FICHIER_ANN_RPU,
    CHEMIN_FICHIER_ANN_SAE,
)
from datacrawler.test_helpers.config_path import get_absolute_file_path


class TestAjouteLesActivitesDesEtablissementsSanitaires:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    @freeze_time("2022-01-14")
    def test_sauvegarde_les_cinq_dernieres_annees_dans_une_table_vide(self) -> None:
        # GIVEN
        chemin_du_fichier_men_pmsi_annuel = get_absolute_file_path(CHEMIN_FICHIER_MEN_PMSI_ANNUEL)
        chemin_du_fichier_ann_rpu = get_absolute_file_path(CHEMIN_FICHIER_ANN_RPU)
        chemin_du_fichier_ann_sae = get_absolute_file_path(CHEMIN_FICHIER_ANN_SAE)
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010005239", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("2A0000155", "010008407", base_de_données_test)
        # WHEN
        ajoute_les_activites_des_etablissements_sanitaires(
            chemin_du_fichier_men_pmsi_annuel, chemin_du_fichier_ann_rpu, chemin_du_fichier_ann_sae, base_de_données_test, mocked_logger
        )
        # THEN
        activite_attendue = pd.DataFrame(
            {
                "annee": [2017, 2018, 2019, 2020, 2021],
                "numero_finess_etablissement_territorial": ["010005239", "010005239", "010005239", "010005239", "010005239"],
                "nombre_sejours_partiels_medecine": [1.0, 3.0, 4.0, 4.0, 4.0],
                "nombre_sejours_partiels_obstetrique": [10.0, nan, nan, nan, nan],
                "nombre_sejours_partiels_chirurgie": [20.0, nan, nan, nan, nan],
                "nombre_sejours_complets_medecine": [255.0, 232.0, 231.0, 231.0, 231.0],
                "nombre_sejours_complets_obstetrique": [10.0, nan, nan, nan, nan],
                "nombre_sejours_complets_chirurgie": [6.0, 10.0, 9.0, 9.0, 9.0],
                "nombre_journees_completes_ssr": [1074.0, 1103.0, 1087.0, nan, nan],
                "nombre_journees_partiels_ssr": [100.0, nan, nan, nan, nan],
                "nombre_journees_complete_psy": [200.0, nan, nan, nan, nan],
                "nombre_journées_partielles_psy": [300.0, nan, nan, nan, nan],
                "nombre_passages_urgences": [10296.0, 24032.0, 23987.0, 23087.0, 25987.0],
                "nombre_sejours_had": [1674.0, 1103.0, 1087.0, nan, nan],
                "nombre_journees_usld": [10048.0, 12248.0, 12458.0, 15248.0, nan],
                "duree_moyenne_sejour_medecine": [4, nan, nan, nan, nan],
                "duree_moyenne_sejour_chirurgie": [5, nan, nan, nan, nan],
                "duree_moyenne_sejour_obstetrique": [6, nan, nan, nan, nan],
            }
        )

        activite_enregistree = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(activite_enregistree, activite_attendue)

        date_du_fichier_men_pmsi_annuel = base_de_données_test.connect().execute(
            text(f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_MEN_PMSI_ANNUEL.value}'""")
        )
        assert date_du_fichier_men_pmsi_annuel.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_MEN_PMSI_ANNUEL.value)

        date_du_fichier_ann_rpu = base_de_données_test.connect().execute(
            text(f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_RPU.value}'""")
        )
        assert date_du_fichier_ann_rpu.fetchone() == (date(2022, 6, 23), FichierSource.DIAMANT_ANN_RPU.value)

    @freeze_time("2022-01-14")
    def test_supprime_les_donnees_existantes_avant_de_sauvegarder_les_donnees_en_base(self) -> None:
        # GIVEN
        chemin_du_fichier_men_pmsi_annuel = get_absolute_file_path(CHEMIN_FICHIER_MEN_PMSI_ANNUEL)
        chemin_du_fichier_ann_rpu = get_absolute_file_path(CHEMIN_FICHIER_ANN_RPU)
        chemin_du_fichier_ann_sae = get_absolute_file_path(CHEMIN_FICHIER_ANN_SAE)
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010005239", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("2A0000155", "010008407", base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_MEN_PMSI_ANNUEL, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_RPU, base_de_données_test)
        activite_existante = pd.DataFrame(
            {
                "annee": [2017],
                "numero_finess_etablissement_territorial": ["010005239"],
                "nombre_sejours_partiels_medecine": [1.0],
                "nombre_sejours_partiels_obstetrique": [nan],
                "nombre_sejours_partiels_chirurgie": [nan],
                "nombre_sejours_complets_medecine": [255.0],
                "nombre_sejours_complets_obstetrique": [3.0],
                "nombre_sejours_complets_chirurgie": [6.0],
                "nombre_journees_completes_ssr": [1074.0],
                "nombre_journees_partiels_ssr": [nan],
                "nombre_journees_complete_psy": [4.0],
                "nombre_journées_partielles_psy": [nan],
                "nombre_passages_urgences": [10],
                "nombre_sejours_had": [100],
                "nombre_journees_usld": [15484],
                "duree_moyenne_sejour_medecine": [7],
                "duree_moyenne_sejour_chirurgie": [8],
                "duree_moyenne_sejour_obstetrique": [9],
            }
        )
        sauvegarde_une_activité_en_base(activite_existante, base_de_données_test, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES)

        # WHEN
        ajoute_les_activites_des_etablissements_sanitaires(
            chemin_du_fichier_men_pmsi_annuel, chemin_du_fichier_ann_rpu, chemin_du_fichier_ann_sae, base_de_données_test, mocked_logger
        )

        # THEN
        activite_attendue = pd.DataFrame(
            {
                "annee": [2017, 2018, 2019, 2020, 2021],
                "numero_finess_etablissement_territorial": ["010005239", "010005239", "010005239", "010005239", "010005239"],
                "nombre_sejours_partiels_medecine": [1.0, 3.0, 4.0, 4.0, 4.0],
                "nombre_sejours_partiels_obstetrique": [10.0, nan, nan, nan, nan],
                "nombre_sejours_partiels_chirurgie": [20.0, nan, nan, nan, nan],
                "nombre_sejours_complets_medecine": [255.0, 232.0, 231.0, 231.0, 231.0],
                "nombre_sejours_complets_obstetrique": [10.0, nan, nan, nan, nan],
                "nombre_sejours_complets_chirurgie": [6.0, 10.0, 9.0, 9.0, 9.0],
                "nombre_journees_completes_ssr": [1074.0, 1103.0, 1087.0, nan, nan],
                "nombre_journees_partiels_ssr": [100.0, nan, nan, nan, nan],
                "nombre_journees_complete_psy": [200.0, nan, nan, nan, nan],
                "nombre_journées_partielles_psy": [300.0, nan, nan, nan, nan],
                "nombre_passages_urgences": [10296.0, 24032.0, 23987.0, 23087.0, 25987.0],
                "nombre_sejours_had": [1674.0, 1103.0, 1087.0, nan, nan],
                "nombre_journees_usld": [10048.0, 12248.0, 12458.0, 15248.0, nan],
                "duree_moyenne_sejour_medecine": [4, nan, nan, nan, nan],
                "duree_moyenne_sejour_chirurgie": [5, nan, nan, nan, nan],
                "duree_moyenne_sejour_obstetrique": [6, nan, nan, nan, nan],
            }
        )

        activite_enregistree = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(activite_enregistree, activite_attendue)

        date_du_fichier_men_pmsi_annuel = base_de_données_test.connect().execute(
            text(f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_MEN_PMSI_ANNUEL.value}'""")
        )
        assert date_du_fichier_men_pmsi_annuel.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_MEN_PMSI_ANNUEL.value)

        date_du_fichier_ann_rpu = base_de_données_test.connect().execute(
            text(f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_RPU.value}'""")
        )
        assert date_du_fichier_ann_rpu.fetchone() == (date(2022, 6, 23), FichierSource.DIAMANT_ANN_RPU.value)

    @patch.object(datacrawler, "sauvegarde")
    def test_revient_a_la_situation_initiale_si_l_ecriture_des_activites_echoue(self, mocked_sauvegarde: Mock) -> None:
        # GIVEN
        chemin_du_fichier_men_pmsi_annuel = get_absolute_file_path(CHEMIN_FICHIER_MEN_PMSI_ANNUEL)
        chemin_du_fichier_ann_rpu = get_absolute_file_path(CHEMIN_FICHIER_ANN_RPU)
        chemin_du_fichier_ann_sae = get_absolute_file_path(CHEMIN_FICHIER_ANN_SAE)
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_MEN_PMSI_ANNUEL, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_RPU, base_de_données_test)
        activite_existante = pd.DataFrame(
            {
                "annee": [2017, 2018],
                "numero_finess_etablissement_territorial": ["010003598", "010003598"],
                "nombre_sejours_partiels_medecine": [1.0, nan],
                "nombre_sejours_partiels_obstetrique": [nan, nan],
                "nombre_sejours_partiels_chirurgie": [nan, nan],
                "nombre_sejours_complets_medecine": [255.0, nan],
                "nombre_sejours_complets_obstetrique": [nan, nan],
                "nombre_sejours_complets_chirurgie": [6.0, nan],
                "nombre_journees_completes_ssr": [1074.0, nan],
                "nombre_journees_partiels_ssr": [nan, nan],
                "nombre_journees_complete_psy": [nan, nan],
                "nombre_journées_partielles_psy": [nan, nan],
                "nombre_passages_urgences": [nan, nan],
                "nombre_sejours_had": [nan, nan],
                "nombre_journees_usld": [nan, nan],
                "duree_moyenne_sejour_medecine": [nan, nan],
                "duree_moyenne_sejour_chirurgie": [nan, nan],
                "duree_moyenne_sejour_obstetrique": [nan, nan],
            }
        )
        sauvegarde_une_activité_en_base(activite_existante, base_de_données_test, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES)

        mocked_sauvegarde.side_effect = ValueError()

        # WHEN
        with pytest.raises(ValueError):
            ajoute_les_activites_des_etablissements_sanitaires(
                chemin_du_fichier_men_pmsi_annuel, chemin_du_fichier_ann_rpu, chemin_du_fichier_ann_sae, base_de_données_test, mocked_logger
            )

        # THEN
        table_activite = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, base_de_données_test)

        pd.testing.assert_frame_equal(table_activite, activite_existante)

        date_du_fichier_men_pmsi_annuel = base_de_données_test.connect().execute(
            text(f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_MEN_PMSI_ANNUEL.value}'""")
        )
        assert date_du_fichier_men_pmsi_annuel.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_MEN_PMSI_ANNUEL.value)

        date_du_fichier_ann_rpu = base_de_données_test.connect().execute(
            text(f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_RPU.value}'""")
        )
        assert date_du_fichier_ann_rpu.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_ANN_RPU.value)

from datetime import date
from unittest.mock import Mock, patch

import pandas as pd
import pytest
from freezegun import freeze_time
from numpy import NaN

import datacrawler
from datacrawler.ajoute_les_activités_des_établissements_médico_sociaux import ajoute_les_activités_des_établissements_médico_sociaux
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES, FichierSource
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_activité_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)


class TestAjouteLesActivitésDesÉtablissementsMedicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    @freeze_time("2022-01-14")
    def test_sauvegarde_les_cinqs_dernières_années_dans_une_table_vide(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_test/entrée/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ms_tdp_et = "data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("123456789", "010008407", base_de_données_test)

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_errd_ej_et, chemin_du_fichier_ann_ms_tdp_et, base_de_données_test, mocked_logger
        )

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
                "annee": [2018, 2019, 2020, 2021],
                "numero_finess_etablissement_territorial": ["010003598", "010003598", "010003598", "010003598"],
                "taux_occupation_accueil_de_jour": [
                    0.48012820512820514,
                    0.36153846153846153,
                    0.33974358974358976,
                    0.33974358974358976,
                ],
                "taux_occupation_en_hebergement_temporaire": [
                    0.93698630136986305,
                    0.25136612021857924,
                    0.75890410958904109,
                    0.75890410958904109,
                ],
                "taux_occupation_en_hebergement_permanent": [
                    0.99779299847793002,
                    0.93245060949978986,
                    0.99023972602739729,
                    0.99023972602739729,
                ],
                "taux_realisation_activite": [
                    0.899300000000000000000000000,
                    1.018200000000000000000000000,
                    0.899300000000000000000000000,
                    0.899300000000000000000000000,
                ],
                "file_active_personnes_accompagnees": [
                    121.0,
                    119.0,
                    121.0,
                    121.0,
                ],
                "nombre_moyen_journees_absence_personnes_accompagnees": [
                    17.86,
                    18.52,
                    17.86,
                    17.86,
                ],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [
                    2359.81
                    2226.21,
                    2352.81,
                    2351.81,
                ],
            }
        )

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pd.testing.assert_frame_equal(data_frame, data_frame_attendu)

        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ms_tdp_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_MS_TDP_ET.value}'"""
        )
        assert date_du_fichier_ann_ms_tdp_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_MS_TDP_ET.value)

    @freeze_time("2022-01-14")
    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_errd_ej_et = "data_test/entrée/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ms_tdp_et = "data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("123456789", "010008407", base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_ERRD_EJ_ET, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_MS_TDP_ET, base_de_données_test)
        table_activité_existante = pd.DataFrame(
            {
                "annee": [2018, 2019],
                "numero_finess_etablissement_territorial": ["010003598", "010003598"],
                "taux_occupation_accueil_de_jour": [0.48012820512820510, NaN],
                "taux_occupation_en_hebergement_temporaire": [0.93698630136986300, NaN],
                "taux_occupation_en_hebergement_permanent": [0.99779299847793000, NaN],
                "taux_realisation_activite": [0.8990, 1.0182],
                "file_active_personnes_accompagnees": [120.0, NaN],
                "nombre_moyen_journees_absence_personnes_accompagnees": [17.80, 18.52],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [2359.80, 2226.21],
            }
        )
        sauvegarde_une_activité_en_base(table_activité_existante, base_de_données_test, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX)

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_errd_ej_et, chemin_du_fichier_ann_ms_tdp_et, base_de_données_test, mocked_logger
        )

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
            "annee": [2018, 2019, 2020, 2021],
                "numero_finess_etablissement_territorial": ["010003598", "010003598", "010003598", "010003598"],
                "taux_occupation_accueil_de_jour": [
                    0.48012820512820514,
                    0.36153846153846153,
                    0.33974358974358976,
                    0.33974358974358976,
                ],
                "taux_occupation_en_hebergement_temporaire": [
                    0.93698630136986305,
                    0.25136612021857924,
                    0.75890410958904109,
                    0.75890410958904109,
                ],
                "taux_occupation_en_hebergement_permanent": [
                    0.99779299847793002,
                    0.93245060949978986,
                    0.99023972602739729,
                    0.99023972602739729,
                ],
                "taux_realisation_activite": [
                    0.899300000000000000000000000,
                    1.018200000000000000000000000,
                    0.899300000000000000000000000,
                    0.899300000000000000000000000,
                ],
                "file_active_personnes_accompagnees": [
                    121.0,
                    119.0,
                    121.0,
                    121.0,
                ],
                "nombre_moyen_journees_absence_personnes_accompagnees": [
                    17.86,
                    18.52,
                    17.86,
                    17.86,
                ],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [
                    2359.81,
                    2226.21,
                    2352.81,
                    2351.81,
                ],
            }
        )

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pd.testing.assert_frame_equal(data_frame, data_frame_attendu)

        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ms_tdp_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_MS_TDP_ET.value}'"""
        )
        assert date_du_fichier_ann_ms_tdp_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_MS_TDP_ET.value)

    @patch.object(datacrawler, "sauvegarde")
    def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde: Mock) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        chemin_du_fichier_ann_errd_ej_et = "data_test/entrée/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ms_tdp_et = "data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_ERRD_EJ_ET, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_MS_TDP_ET, base_de_données_test)
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
        sauvegarde_une_activité_en_base(table_activité_existante, base_de_données_test, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX)

        mocked_sauvegarde.side_effect = ValueError

        # WHEN
        with pytest.raises(ValueError):
            ajoute_les_activités_des_établissements_médico_sociaux(
                chemin_du_fichier_ann_errd_ej_et, chemin_du_fichier_ann_ms_tdp_et, base_de_données_test, mocked_logger
            )

        # THEN
        table_activité = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pd.testing.assert_frame_equal(table_activité, table_activité_existante)

        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ms_tdp_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_MS_TDP_ET.value}'"""
        )
        assert date_du_fichier_ann_ms_tdp_et.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_ANN_MS_TDP_ET.value)

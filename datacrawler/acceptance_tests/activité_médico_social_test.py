from datetime import date
from unittest.mock import Mock, patch

import pandas as pd
import pytest
from freezegun import freeze_time
from numpy import NaN

import datacrawler
from datacrawler.ajoute_les_activités_des_établissements_médico_sociaux import ajoute_les_activites_des_etablissements_medico_sociaux
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES, FichierSource
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_activité_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
    CHEMIN_FICHIER_ANN_MS_TDP_ET,
    CHEMIN_FICHIER_ANN_CA_EJ_ET,
    CHEMIN_FICHIER_ANN_ERRD_EJ_ET
)

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
                "taux_occupation_externat": [
                     1.000817111271329,
                    1.000817111271329,
                    0.926075462629176,
                    0.926075462629176,
                ],
                "taux_occupation_semi_internat": [
                    NaN,
                    NaN,
                    NaN,
                    NaN,
                ],
                "taux_occupation_internat": [
                    NaN,
                    NaN,
                    NaN,
                    NaN,
                ],
                "taux_occupation_autre": [
                    NaN,
                    NaN,
                    NaN,
                    NaN,
                ],
                "taux_occupation_seances": [
                    NaN,
                    NaN,
                    NaN,
                    0.79774305555555558,

                ]
            }
        )


class TestAjouteLesActivitesDesEtablissementsMedicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
    @freeze_time("2022-01-14")
    def test_sauvegarde_les_cinqs_dernieres_annees_dans_une_table_vide(self) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("123456789", "010008407", base_de_données_test)

        # WHEN
        ajoute_les_activites_des_etablissements_medico_sociaux(
            CHEMIN_FICHIER_ANN_ERRD_EJ_ET, CHEMIN_FICHIER_ANN_CA_EJ_ET, CHEMIN_FICHIER_ANN_MS_TDP_ET, base_de_données_test, mocked_logger
        )

        # THEN

        pd.testing.assert_frame_equal(pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test), data_frame_attendu)

        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ms_tdp_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_MS_TDP_ET.value}'"""
        )
        assert date_du_fichier_ann_ms_tdp_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_MS_TDP_ET.value)

    @freeze_time("2022-01-14")
    def test_supprime_les_donnees_existantes_avant_de_sauvegarder_les_donnees_en_base(self) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("123456789", "010008407", base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_ERRD_EJ_ET, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_MS_TDP_ET, base_de_données_test)
        table_activite_existante = pd.DataFrame(
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
        sauvegarde_une_activité_en_base(table_activite_existante, base_de_données_test, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX)

        # WHEN
        ajoute_les_activites_des_etablissements_medico_sociaux(
            CHEMIN_FICHIER_ANN_ERRD_EJ_ET, CHEMIN_FICHIER_ANN_CA_EJ_ET, CHEMIN_FICHIER_ANN_MS_TDP_ET, base_de_données_test, mocked_logger
        )

        # THEN
        pd.testing.assert_frame_equal(pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test), data_frame_attendu)

        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ms_tdp_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_MS_TDP_ET.value}'"""
        )
        assert date_du_fichier_ann_ms_tdp_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_MS_TDP_ET.value)

    @patch.object(datacrawler, "sauvegarde")
    def test_revient_a_la_situation_initiale_si_l_ecriture_des_activites_echoue(self, mocked_sauvegarde: Mock) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_ERRD_EJ_ET, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_MS_TDP_ET, base_de_données_test)
        table_activite_existante = pd.DataFrame(
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
                 "taux_occupation_externat": [1.000817111271329,1.000817111271329,],
                "taux_occupation_semi_internat": [NaN,NaN],
                "taux_occupation_internat": [NaN,NaN],
                "taux_occupation_autre": [NaN,NaN],
                "taux_occupation_seances": [NaN,NaN],
            }
        )
        sauvegarde_une_activité_en_base(table_activite_existante, base_de_données_test, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX)

        mocked_sauvegarde.side_effect = ValueError

        # WHEN
        with pytest.raises(ValueError):
            ajoute_les_activites_des_etablissements_medico_sociaux(
                CHEMIN_FICHIER_ANN_ERRD_EJ_ET, CHEMIN_FICHIER_ANN_CA_EJ_ET, CHEMIN_FICHIER_ANN_MS_TDP_ET, base_de_données_test, mocked_logger
            )

        # THEN
        table_activite = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pd.testing.assert_frame_equal(table_activite, table_activite_existante)

        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ms_tdp_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_MS_TDP_ET.value}'"""
        )
        assert date_du_fichier_ann_ms_tdp_et.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_ANN_MS_TDP_ET.value)

from datetime import date
from unittest.mock import Mock, patch

import pandas as pd
from freezegun import freeze_time
import pytest
from numpy import NaN

import datacrawler
from datacrawler.ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux import (
    ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux,
)
from datacrawler.load.nom_des_tables import TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES, TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL, FichierSource
from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    NUMÉRO_FINESS_ÉTABLISSEMENT,
    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
    base_de_données_test,
    mocked_logger,
    sauvegarde_les_indicateurs_ressources_humaines_en_base,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)
from datacrawler.test_helpers.helios_builder import helios_ressources_humaines_builder


class TestAjouteLeBlocDesRessourcesHumainesMédicoSocial:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    @freeze_time("2022-01-14")
    def test_sauvegarde_les_données_des_ressources_humaines(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_ms_tdp_et = "data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_errd_ej_et = "data_test/entrée/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ca_ej_et = "data_test/entrée/diamant/ANN_CA_EJ_ET_2022_09_01.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        numéro_finess_ca = "010002269"
        sauvegarde_un_établissement_en_base(numéro_finess_ca, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_ca_ej_et,
            chemin_du_fichier_ann_errd_ej_et,
            chemin_du_fichier_ann_ms_tdp_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        données_ressources_humaines_attendues = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    numéro_finess_ca,
                    numéro_finess_ca,
                ],
                "annee": [2019, 2018, 2021, 2020, 2019, 2018, 2019, 2018],
                "nombre_cdd_remplacement": [2.0, 19.0, 5.0, 5.0, 5.0, 5.0, NaN, NaN],
                "taux_etp_vacants": [0.1197, 0.0483, 0.0, 0.0, 0.0, 0.0, NaN, NaN],
                "taux_prestation_externes": [0.0232, NaN, 0.0164, 0.0164, 0.0082, 0.0164, NaN, NaN],
                "taux_rotation_personnel": [0.1923, 0.1429, 0.0352, 0.0352, 0.0141, 0.0352, NaN, NaN],
                "taux_absenteisme_maladie_courte_duree": [0.0028, 0.0021, 0.0083, 0.0083, 0.0125, 0.0083, NaN, NaN],
                "taux_absenteisme_maladie_moyenne_duree": [0.0465, 0.0717, 0.0166, 0.0166, 0.0149, 0.0166, NaN, NaN],
                "taux_absenteisme_maladie_longue_duree": [0.0, .1194, 0.0089, 0.0089, 0.0319, 0.0089 , NaN, NaN],
                "taux_absenteisme_maternite_paternite": [0.0, 0.0, 0.0128, 0.0128, 0.0005, 0.0128, NaN, NaN],
                "taux_absenteisme_accident_maladie_professionnelle": [0.0008, 0.0246, 0.0085, 0.0085, 0.0088, 0.0085, NaN, NaN],
                "taux_absenteisme_conges_speciaux": [0.0109, 0.0, 0.0004, 0.0004, 0.0, 0.0004, NaN, NaN],
                "taux_absenteisme_hors_formation": [0.0609, 0.2179, 0.0554, 0.0554, 0.0685, 0.0554, NaN, NaN],
                "nombre_etp_realises": [NaN, NaN, 188.5, 50.64999999999999, 17.19, 4.55, 9.71, 10.34],
            },
        )

        données_ressources_humaines_enregistrées = pd.read_sql(
            TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL,
            base_de_données_test,
        )

        pd.testing.assert_frame_equal(données_ressources_humaines_enregistrées.sort_index(axis=1), données_ressources_humaines_attendues.sort_index(axis=1))

    def test_sauvegarde_les_dates_de_mises_à_jour_des_indicateurs_ressources_humaines(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_ms_tdp_et = "data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_errd_ej_et = "data_test/entrée/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ca_ej_et = "data_test/entrée/diamant/ANN_CA_EJ_ET_2022_09_01.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_ca_ej_et,
            chemin_du_fichier_ann_errd_ej_et,
            chemin_du_fichier_ann_ms_tdp_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        date_du_fichier_ann_ca_ej_et = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_CA_EJ_ET.value}'"
        )
        assert date_du_fichier_ann_ca_ej_et.fetchone() == (date(2022, 9, 1), FichierSource.DIAMANT_ANN_CA_EJ_ET.value)

        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ms_tdp_et = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_MS_TDP_ET.value}'"
        )
        assert date_du_fichier_ann_ms_tdp_et.fetchone() == (date(2022, 6, 7), FichierSource.DIAMANT_ANN_MS_TDP_ET.value)

    @freeze_time("2022-01-14")
    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_ms_tdp_et = "data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_errd_ej_et = "data_test/entrée/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ca_ej_et = "data_test/entrée/diamant/ANN_CA_EJ_ET_2022_09_01.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        sauvegarde_les_indicateurs_ressources_humaines_en_base(
            pd.DataFrame(
                [
                    helios_ressources_humaines_builder(
                        {"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT, "nombre_cdd_remplacement": 999}
                    ),
                    helios_ressources_humaines_builder(
                        {"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, "nombre_cdd_remplacement": 0}
                    ),
                ]
            ),
            base_de_données_test,
        )

        # WHEN
        ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_ca_ej_et,
            chemin_du_fichier_ann_errd_ej_et,
            chemin_du_fichier_ann_ms_tdp_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        données_ressources_humaines_attendues = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL
                ],
                "annee": [2019, 2018, 2021, 2020, 2019, 2018],
                "nombre_cdd_remplacement": [2.0, 19.0, 5.0, 5.0, 5.0, 5.0],
                "taux_etp_vacants": [0.1197, 0.0483, 0.0, 0.0, 0.0, 0.0],
                "taux_prestation_externes": [0.0232, NaN, 0.0164, 0.0164, 0.0082, 0.0164],
                "taux_rotation_personnel": [0.1923, 0.1429, 0.0352, 0.0352, 0.0141, 0.0352],
                "taux_absenteisme_maladie_courte_duree": [0.0028, 0.0021, 0.0083, 0.0083, 0.0125, 0.0083],
                "taux_absenteisme_maladie_moyenne_duree": [0.0465, 0.0717, 0.0166, 0.0166, 0.0149, 0.0166],
                "taux_absenteisme_maladie_longue_duree": [0.0, .1194, 0.0089, 0.0089, 0.0319, 0.0089],
                "taux_absenteisme_maternite_paternite": [0.0, 0.0, 0.0128, 0.0128, 0.0005, 0.0128],
                "taux_absenteisme_accident_maladie_professionnelle": [0.0008, 0.0246, 0.0085, 0.0085, 0.0088,0.0085],
                "taux_absenteisme_conges_speciaux": [0.0109, 0.0, 0.0004, 0.0004, 0.0, 0.0004],
                "taux_absenteisme_hors_formation": [0.0609, 0.2179, 0.0554, 0.0554, 0.0685, 0.0554],
                "nombre_etp_realises": [NaN, NaN, 188.5, 50.64999999999999, 17.19, 4.55],
            }
        )

        données_ressources_humaines_enregistrées = pd.read_sql(
            TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL,
            base_de_données_test,
        )

        pd.testing.assert_frame_equal(données_ressources_humaines_enregistrées.sort_index(axis=1), données_ressources_humaines_attendues.sort_index(axis=1))

    @patch.object(datacrawler, "sauvegarde")
    def test_revient_à_la_situation_initiale_si_l_écriture_des_indicateurs_ressources_humaines_échoue(self, mocked_sauvegarde: Mock) -> None:
        # GIVEN
        chemin_du_fichier_ann_ms_tdp_et = "data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_errd_ej_et = "data_test/entrée/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        chemin_du_fichier_ann_ca_ej_et = "data_test/entrée/diamant/ANN_CA_EJ_ET_2022_09_01.CSV"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        table_des_ressources_humaines_existante = pd.DataFrame(
            [
                helios_ressources_humaines_builder({"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT}),
                helios_ressources_humaines_builder({"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL}),
            ]
        )
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_CA_EJ_ET, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200102", FichierSource.DIAMANT_ANN_ERRD_EJ_ET, base_de_données_test)
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200103", FichierSource.DIAMANT_ANN_MS_TDP_ET, base_de_données_test)

        sauvegarde_les_indicateurs_ressources_humaines_en_base(
            table_des_ressources_humaines_existante,
            base_de_données_test,
        )
        mocked_sauvegarde.side_effect = ValueError

        # WHEN
        with pytest.raises(ValueError):
            ajoute_le_bloc_ressources_humaines_des_établissements_médico_sociaux(
                chemin_du_fichier_ann_ca_ej_et,
                chemin_du_fichier_ann_errd_ej_et,
                chemin_du_fichier_ann_ms_tdp_et,
                base_de_données_test,
                mocked_logger,
            )

        # THEN
        table_des_ressources_humaines = pd.read_sql(TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL, base_de_données_test)

        pd.testing.assert_frame_equal(table_des_ressources_humaines.sort_index(axis=1), table_des_ressources_humaines_existante.sort_index(axis=1))

        date_du_fichier_ann_ca_ej_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_CA_EJ_ET.value}'"""
        )
        assert date_du_fichier_ann_ca_ej_et.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_ANN_CA_EJ_ET.value)

        date_du_fichier_ann_errd_ej_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value}'"""
        )
        assert date_du_fichier_ann_errd_ej_et.fetchone() == (date(2020, 1, 2), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)

        date_du_fichier_ann_ms_tdp_et = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_MS_TDP_ET.value}'"""
        )
        assert date_du_fichier_ann_ms_tdp_et.fetchone() == (date(2020, 1, 3), FichierSource.DIAMANT_ANN_MS_TDP_ET.value)

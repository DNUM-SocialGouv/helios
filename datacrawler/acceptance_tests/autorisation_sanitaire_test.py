# pylint: disable=too-many-lines
import gzip
import os
import shutil
from datetime import date
from unittest.mock import Mock, patch

import pandas as pd
import pytest
from numpy import NaN
from freezegun import freeze_time

import datacrawler
from datacrawler.ajoute_les_autorisations_des_établissements_sanitaires import (
    ajoute_les_autorisations_des_établissements_sanitaires,
)
from datacrawler.load.nom_des_tables import (
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
    FichierSource,
)
from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
    base_de_données_test,
    mocked_logger,
    sauvegarde_les_capacités_sanitaires_en_base,
    sauvegarde_un_équipement_matériel_lourd_en_base,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_autorisation_sanitaire_en_base,
    sauvegarde_une_autre_activité_sanitaire_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_une_entité_juridique_en_base,
    sauvegarde_une_reconnaissance_contractuelle_en_base,
    supprime_les_données_des_tables,
)
from datacrawler.test_helpers.helios_builder import (
    helios_ann_sae_builder,
    helios_autorisation_sanitaire_builder,
    helios_autre_activité_sanitaire_builder,
    helios_reconnaissance_contractuelle_sanitaire_builder,
    helios_équipement_matériel_lourd_sanitaire_builder,
)

archive_de_données_finess_cs1400103_de_test = os.path.join("data_test", "entrée", "flux_finess", "enrichi", "finess_cs1400103_stock_20211214-0343.xml.gz")
fichier_de_données_finess_cs1400103_de_test = os.path.join("data_test", "entrée", "flux_finess", "enrichi", "finess_cs1400103_stock_20211214-0343.xml")

archive_de_données_finess_cs1400104_de_test = os.path.join("data_test", "entrée", "flux_finess", "enrichi", "finess_cs1400104_stock_20211214-0345.xml.gz")
fichier_de_données_finess_cs1400104_de_test = os.path.join("data_test", "entrée", "flux_finess", "enrichi", "finess_cs1400104_stock_20211214-0345.xml")

archive_de_données_finess_cs1600101_de_test = os.path.join("data_test", "entrée", "flux_finess", "enrichi", "finess_cs1600101_stock_20211214-0332.xml.gz")
fichier_de_données_finess_cs1600101_de_test = os.path.join("data_test", "entrée", "flux_finess", "enrichi", "finess_cs1600101_stock_20211214-0332.xml")

archive_de_données_finess_cs1600102_de_test = os.path.join("data_test", "entrée", "flux_finess", "enrichi", "finess_cs1600102_stock_20211214-0417.xml.gz")
fichier_de_données_finess_cs1600102_de_test = os.path.join("data_test", "entrée", "flux_finess", "enrichi", "finess_cs1600102_stock_20211214-0417.xml")

fichier_de_données_diamant_ann_sae = os.path.join("data_test", "entrée", "diamant", "ANN_SAE_2022_08_03.CSV")


class TestAjouteLesAutorisationsDesÉtablissementsMédicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        for archive_de_données, fichier_de_données in [
            (
                archive_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400103_de_test,
            ),
            (
                archive_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1400104_de_test,
            ),
            (
                archive_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600101_de_test,
            ),
            (
                archive_de_données_finess_cs1600102_de_test,
                fichier_de_données_finess_cs1600102_de_test,
            ),
        ]:
            with gzip.open(archive_de_données, "rb") as archive:
                with open(fichier_de_données, "wb") as fichier_xml:
                    shutil.copyfileobj(archive, fichier_xml)

    def teardown_method(self) -> None:
        for fichier_de_données in [
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
        ]:
            os.remove(fichier_de_données)

    class TestAjouteLesAutorisationsDesÉtablissementsSanitaires:
        def test_sauvegarde_les_autorisations_installées_des_établissements_sanitaires(
            self,
        ) -> None:
            # GIVEN
            numéro_finess_avec_valeurs_manquantes = "010786259"
            numéro_finess_inconnu_de_la_base = "490019148"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_avec_valeurs_manquantes,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_inconnu_de_la_base,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            autorisations_attendues = pd.DataFrame(
                {
                    "code_activite": ["16", "16", "16", "16", "50"],
                    "code_forme": ["00", "14", "00", "00", "02"],
                    "code_modalite": ["42", "44", "46", "45", "78"],
                    "date_autorisation": [
                        date(2005, 10, 11),
                        date(2005, 10, 11),
                        date(2005, 10, 11),
                        date(2005, 10, 11),
                        None,
                    ],
                    "date_fin": [
                        date(2026, 5, 3),
                        date(2026, 5, 3),
                        date(2026, 5, 3),
                        date(2026, 5, 3),
                        None,
                    ],
                    "date_mise_en_oeuvre": [
                        date(2008, 12, 4),
                        date(2009, 11, 9),
                        date(2008, 12, 4),
                        date(2008, 12, 4),
                        None,
                    ],
                    "libelle_activite": [
                        "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "Soins de suite et de réadaptation non spécialisés",
                    ],
                    "libelle_forme": [
                        "Pas de forme",
                        "Non saisonnier",
                        "Pas de forme",
                        "Pas de forme",
                        "Hospitalisation à temps partiel de jour ou de nuit",
                    ],
                    "libelle_modalite": [
                        "Hémodialyse en unité médicalisée",
                        "Hémodialyse en unité d'auto dialyse assistée",
                        "Dialyse péritonéale à domicile",
                        "Hémodialyse à domicile",
                        "Juvénile (âge >= 6 ans et < 18 ans)",
                    ],
                    "numero_autorisation_arhgos": [
                        "01-00-000",
                        "01-00-111",
                        "01-00-222",
                        "01-00-333",
                        "02-00-000",
                    ],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        numéro_finess_avec_valeurs_manquantes,
                    ],
                },
            )

            autorisations_enregistrées = pd.read_sql(
                TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(autorisations_enregistrées, autorisations_attendues)

        def test_sauvegarde_la_date_de_mise_à_jour_des_autorisations(self) -> None:
            # GIVEN
            numéro_finess_avec_valeurs_manquantes = "010786259"
            numéro_finess_inconnu_de_la_base = "490019148"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_avec_valeurs_manquantes,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_inconnu_de_la_base,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            date_du_fichier_finess_cs1400103 = base_de_données_test.execute(
                f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400103.value}'"
            )
            assert date_du_fichier_finess_cs1400103.fetchone() == (
                date(2021, 12, 14),
                FichierSource.FINESS_CS1400103.value,
            )

        def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(
            self,
        ) -> None:
            # GIVEN
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.FINESS_CS1400103, base_de_données_test)
            autorisation_sanitaire_existante = pd.DataFrame([helios_autorisation_sanitaire_builder()])
            sauvegarde_une_autorisation_sanitaire_en_base(autorisation_sanitaire_existante, base_de_données_test)

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            autorisations_attendues = pd.DataFrame(
                {
                    "code_activite": ["16", "16", "16", "16"],
                    "code_forme": ["00", "14", "00", "00"],
                    "code_modalite": ["42", "44", "46", "45"],
                    "date_autorisation": [
                        date(2005, 10, 11),
                        date(2005, 10, 11),
                        date(2005, 10, 11),
                        date(2005, 10, 11),
                    ],
                    "date_fin": [
                        date(2026, 5, 3),
                        date(2026, 5, 3),
                        date(2026, 5, 3),
                        date(2026, 5, 3),
                    ],
                    "date_mise_en_oeuvre": [
                        date(2008, 12, 4),
                        date(2009, 11, 9),
                        date(2008, 12, 4),
                        date(2008, 12, 4),
                    ],
                    "libelle_activite": [
                        "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                    ],
                    "libelle_forme": [
                        "Pas de forme",
                        "Non saisonnier",
                        "Pas de forme",
                        "Pas de forme",
                    ],
                    "libelle_modalite": [
                        "Hémodialyse en unité médicalisée",
                        "Hémodialyse en unité d'auto dialyse assistée",
                        "Dialyse péritonéale à domicile",
                        "Hémodialyse à domicile",
                    ],
                    "numero_autorisation_arhgos": [
                        "01-00-000",
                        "01-00-111",
                        "01-00-222",
                        "01-00-333",
                    ],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    ],
                },
            )

            autorisations_enregistrées = pd.read_sql(
                TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(autorisations_enregistrées, autorisations_attendues)

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400103.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2021, 12, 14),
                FichierSource.FINESS_CS1400103.value,
            )

        @patch.object(datacrawler, "sauvegarde")
        def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde: Mock) -> None:
            # GIVEN
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.FINESS_CS1400103, base_de_données_test)
            autorisation_sanitaire_existante = pd.DataFrame([helios_autorisation_sanitaire_builder()])
            sauvegarde_une_autorisation_sanitaire_en_base(autorisation_sanitaire_existante, base_de_données_test)

            mocked_sauvegarde.side_effect = ValueError()

            # WHEN
            with pytest.raises(ValueError):
                ajoute_les_autorisations_des_établissements_sanitaires(
                    fichier_de_données_finess_cs1400103_de_test,
                    fichier_de_données_finess_cs1400104_de_test,
                    fichier_de_données_finess_cs1600101_de_test,
                    fichier_de_données_finess_cs1600102_de_test,
                    fichier_de_données_diamant_ann_sae,
                    base_de_données_test,
                    mocked_logger,
                )

            autorisations_enregistrées = pd.read_sql(
                TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(autorisations_enregistrées, autorisation_sanitaire_existante)

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400103.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2020, 1, 1),
                FichierSource.FINESS_CS1400103.value,
            )

    class TestAjouteLesÉquipementsMatérielsLourdsDesÉtablissementsSanitaires:
        def test_sauvegarde_les_équipements_matériels_lourds_des_établissements_sanitaires(
            self,
        ) -> None:
            # GIVEN
            numéro_finess_avec_valeurs_manquantes = "010786259"
            numéro_finess_inconnu_de_la_base = "490019148"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_avec_valeurs_manquantes,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_inconnu_de_la_base,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            équipements_matériels_lourds_attendus = pd.DataFrame(
                {
                    "code_equipement_materiel_lourd": ["05602", "06201", "05701"],
                    "date_autorisation": [date(2007, 11, 6), date(2006, 5, 2), None],
                    "date_fin": [date(2029, 1, 1), date(2027, 2, 16), None],
                    "date_mise_en_oeuvre": [
                        date(2011, 10, 19),
                        date(2009, 1, 20),
                        None,
                    ],
                    "libelle_eml": [
                        "Scanographe à utilisation médicale",
                        "Appareil d'IRM à utilisation clinique",
                        "Caméra à scintillation sans détecteur d'émission de positons",
                    ],
                    "numero_autorisation_arhgos": [
                        "01-00-0000",
                        "01-00-0001",
                        "02-00-0000",
                    ],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        numéro_finess_avec_valeurs_manquantes,
                    ],
                    "date_ouverture": [None, None, None],
                },
            )

            équipements_matériels_lourds_enregistrés = pd.read_sql(
                TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(
                équipements_matériels_lourds_attendus,
                équipements_matériels_lourds_enregistrés,
            )

        def test_sauvegarde_la_date_de_mise_à_jour_des_équipements_matériels_lourds(
            self,
        ) -> None:
            # GIVEN
            numéro_finess_avec_valeurs_manquantes = "010786259"
            numéro_finess_inconnu_de_la_base = "490019148"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_avec_valeurs_manquantes,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_inconnu_de_la_base,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            date_du_fichier_finess_cs1400104 = base_de_données_test.execute(
                f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400104.value}'"
            )
            assert date_du_fichier_finess_cs1400104.fetchone() == (
                date(2021, 12, 14),
                FichierSource.FINESS_CS1400104.value,
            )

        def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(
            self,
        ) -> None:
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.FINESS_CS1400104, base_de_données_test)
            équipement_matériel_lourd_sanitaire_existante = pd.DataFrame([helios_équipement_matériel_lourd_sanitaire_builder()])
            sauvegarde_un_équipement_matériel_lourd_en_base(équipement_matériel_lourd_sanitaire_existante, base_de_données_test)

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            équipements_matériels_lourds_attendus = pd.DataFrame(
                {
                    "code_equipement_materiel_lourd": ["05602", "06201"],
                    "date_autorisation": [date(2007, 11, 6), date(2006, 5, 2)],
                    "date_fin": [date(2029, 1, 1), date(2027, 2, 16)],
                    "date_mise_en_oeuvre": [date(2011, 10, 19), date(2009, 1, 20)],
                    "libelle_eml": [
                        "Scanographe à utilisation médicale",
                        "Appareil d'IRM à utilisation clinique",
                    ],
                    "numero_autorisation_arhgos": ["01-00-0000", "01-00-0001"],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    ],
                    "date_ouverture": [None, None],
                },
            )

            équipements_matériels_lourds_enregistrés = pd.read_sql(
                TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(
                équipements_matériels_lourds_attendus,
                équipements_matériels_lourds_enregistrés,
            )

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400104.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2021, 12, 14),
                FichierSource.FINESS_CS1400104.value,
            )

        @patch.object(datacrawler, "sauvegarde")
        def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde: Mock) -> None:
            # GIVEN
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.FINESS_CS1400104, base_de_données_test)
            équipement_matériel_lourd_sanitaire_existante = pd.DataFrame([helios_équipement_matériel_lourd_sanitaire_builder()])
            sauvegarde_un_équipement_matériel_lourd_en_base(équipement_matériel_lourd_sanitaire_existante, base_de_données_test)

            mocked_sauvegarde.side_effect = ValueError()

            # WHEN
            with pytest.raises(ValueError):
                ajoute_les_autorisations_des_établissements_sanitaires(
                    fichier_de_données_finess_cs1400103_de_test,
                    fichier_de_données_finess_cs1400104_de_test,
                    fichier_de_données_finess_cs1600101_de_test,
                    fichier_de_données_finess_cs1600102_de_test,
                    fichier_de_données_diamant_ann_sae,
                    base_de_données_test,
                    mocked_logger,
                )

            équipements_matériels_lourds_enregistrés = pd.read_sql(
                TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(
                équipement_matériel_lourd_sanitaire_existante,
                équipements_matériels_lourds_enregistrés,
            )

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400104.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2020, 1, 1),
                FichierSource.FINESS_CS1400104.value,
            )

    class TestAjouteLesAutresActivitésDesÉtablissementsSanitaires:
        def test_sauvegarde_les_autres_activités_des_établissements_sanitaires(
            self,
        ) -> None:
            # GIVEN
            numéro_finess_avec_valeurs_manquantes = "010786259"
            numéro_finess_inconnu_de_la_base = "490019148"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_avec_valeurs_manquantes,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_inconnu_de_la_base,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            autres_activités_attendues = pd.DataFrame(
                {
                    "code_activite": ["A1", "A1", "A0"],
                    "code_forme": ["00", "00", "15"],
                    "code_modalite": ["M0", "M2", "00"],
                    "date_autorisation": [date(2019, 6, 3), date(2019, 6, 3), None],
                    "date_fin": [date(2024, 8, 31), date(2024, 8, 31), None],
                    "date_mise_en_oeuvre": [date(2019, 6, 3), date(2019, 6, 3), None],
                    "libelle_activite": [
                        "Dépôt de sang",
                        "Dépôt de sang",
                        "Installation de chirurgie esthétique",
                    ],
                    "libelle_forme": [
                        "Pas de forme",
                        "Pas de forme",
                        "Forme non précisée",
                    ],
                    "libelle_modalite": [
                        "Dépôt d'urgence",
                        "Dépôt relais",
                        "Pas de modalité",
                    ],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        numéro_finess_avec_valeurs_manquantes,
                    ],
                },
            )

            autres_activités_enregistrées = pd.read_sql(
                TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(autres_activités_attendues, autres_activités_enregistrées)

        def test_sauvegarde_la_date_de_mise_à_jour_des_autres_activités(self) -> None:
            # GIVEN
            numéro_finess_avec_valeurs_manquantes = "010786259"
            numéro_finess_inconnu_de_la_base = "490019148"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_avec_valeurs_manquantes,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_inconnu_de_la_base,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            date_du_fichier_finess_cs1600101 = base_de_données_test.execute(
                f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1600101.value}'"
            )
            assert date_du_fichier_finess_cs1600101.fetchone() == (
                date(2021, 12, 14),
                FichierSource.FINESS_CS1600101.value,
            )

        def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(
            self,
        ) -> None:
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.FINESS_CS1600101, base_de_données_test)
            autre_activité_sanitaire_existante = pd.DataFrame([helios_autre_activité_sanitaire_builder()])
            sauvegarde_une_autre_activité_sanitaire_en_base(autre_activité_sanitaire_existante, base_de_données_test)

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            autres_activités_attendues = pd.DataFrame(
                {
                    "code_activite": ["A1", "A1"],
                    "code_forme": ["00", "00"],
                    "code_modalite": ["M0", "M2"],
                    "date_autorisation": [date(2019, 6, 3), date(2019, 6, 3)],
                    "date_fin": [date(2024, 8, 31), date(2024, 8, 31)],
                    "date_mise_en_oeuvre": [date(2019, 6, 3), date(2019, 6, 3)],
                    "libelle_activite": ["Dépôt de sang", "Dépôt de sang"],
                    "libelle_forme": ["Pas de forme", "Pas de forme"],
                    "libelle_modalite": ["Dépôt d'urgence", "Dépôt relais"],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    ],
                },
            )

            autres_activités_enregistrées = pd.read_sql(
                TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(autres_activités_attendues, autres_activités_enregistrées)

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1600101.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2021, 12, 14),
                FichierSource.FINESS_CS1600101.value,
            )

        @patch.object(datacrawler, "sauvegarde")
        def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde: Mock) -> None:
            # GIVEN
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.FINESS_CS1600101, base_de_données_test)
            autre_activité_sanitaire_existante = pd.DataFrame([helios_autre_activité_sanitaire_builder()])
            sauvegarde_une_autre_activité_sanitaire_en_base(autre_activité_sanitaire_existante, base_de_données_test)

            mocked_sauvegarde.side_effect = ValueError()

            # WHEN
            with pytest.raises(ValueError):
                ajoute_les_autorisations_des_établissements_sanitaires(
                    fichier_de_données_finess_cs1400103_de_test,
                    fichier_de_données_finess_cs1400104_de_test,
                    fichier_de_données_finess_cs1600101_de_test,
                    fichier_de_données_finess_cs1600102_de_test,
                    fichier_de_données_diamant_ann_sae,
                    base_de_données_test,
                    mocked_logger,
                )

            autres_activités_enregistrées = pd.read_sql(
                TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_autorisation": {"format": "%y-%m-%d"},
                    "date_fin": {"format": "%y-%m-%d"},
                    "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(autre_activité_sanitaire_existante, autres_activités_enregistrées)

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1600101.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2020, 1, 1),
                FichierSource.FINESS_CS1600101.value,
            )

    class TestAjouteLesReconnaissancesContractuellesDesÉtablissementsSanitaires:
        def test_sauvegarde_les_reconnaissances_contractuelles_des_établissements_sanitaires(
            self,
        ) -> None:
            # GIVEN
            numéro_finess_avec_valeurs_manquantes = "010786259"
            numéro_finess_inconnu_de_la_base = "490019148"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_avec_valeurs_manquantes,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_inconnu_de_la_base,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            reconnaissances_contractuelles_attendues = pd.DataFrame(
                {
                    "capacite_autorisee": [4, 1, 0, NaN],
                    "code_activite": ["R7", "R4", "S6", "R7"],
                    "code_forme": ["01", "00", "00", "01"],
                    "code_modalite": ["N8", "N4", "B3", "09"],
                    "date_effet_asr": [
                        date(2013, 11, 30),
                        date(2013, 1, 1),
                        None,
                        None,
                    ],
                    "date_effet_cpom": [
                        date(2013, 12, 1),
                        date(2013, 12, 1),
                        date(2019, 4, 1),
                        None,
                    ],
                    "date_fin_cpom": [
                        date(2018, 11, 30),
                        date(2018, 11, 30),
                        date(2023, 12, 31),
                        None,
                    ],
                    "numero_cpom": [
                        "01-00-C00000",
                        "01-00-C00001",
                        "01-00-C00002",
                        "02-00-C00000",
                    ],
                    "libelle_activite": [
                        "Surveillance continue",
                        "Soins palliatifs",
                        "Structure spécifique d'hospitalisation",
                        "Surveillance continue",
                    ],
                    "libelle_forme": [
                        "Hospitalisation complète (24 heures consécutives ou plus)",
                        "Pas de forme",
                        "Pas de forme",
                        "Hospitalisation complète (24 heures consécutives ou plus)",
                    ],
                    "libelle_modalite": [
                        "USC polyvalente - adulte (non adossée à une unité de réanimation)",
                        "Equipe mobile",
                        "Clinique ouverte",
                        "Adulte (âge >=18 ans)",
                    ],
                    "numero_autorisation_arhgos": [
                        "01-00-RC00000",
                        "01-00-RC00001",
                        "01-00-RC00002",
                        "02-00-RC00000",
                    ],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        numéro_finess_avec_valeurs_manquantes,
                    ],
                },
            )

            reconnaissances_contractuelles_enregistrées = pd.read_sql(
                TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_effet_asr": {"format": "%y-%m-%d"},
                    "date_effet_cpom": {"format": "%y-%m-%d"},
                    "date_fin_cpom": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(
                reconnaissances_contractuelles_attendues,
                reconnaissances_contractuelles_enregistrées,
            )

        def test_sauvegarde_la_date_de_mise_à_jour_des_reconnaissances_contractuelles(
            self,
        ) -> None:
            # GIVEN
            numéro_finess_avec_valeurs_manquantes = "010786259"
            numéro_finess_inconnu_de_la_base = "490019148"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_avec_valeurs_manquantes,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                numéro_finess_inconnu_de_la_base,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            date_du_fichier_finess_cs1600102 = base_de_données_test.execute(
                f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1600102.value}'"
            )
            assert date_du_fichier_finess_cs1600102.fetchone() == (
                date(2021, 12, 14),
                FichierSource.FINESS_CS1600102.value,
            )

        def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(
            self,
        ) -> None:
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.FINESS_CS1600102, base_de_données_test)
            reconnaissance_contractuelle_sanitaire_existante = pd.DataFrame([helios_reconnaissance_contractuelle_sanitaire_builder()])
            sauvegarde_une_reconnaissance_contractuelle_en_base(reconnaissance_contractuelle_sanitaire_existante, base_de_données_test)

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            reconnaissances_contractuelles_attendues = pd.DataFrame(
                {
                    "capacite_autorisee": [4, 1, 0],
                    "code_activite": ["R7", "R4", "S6"],
                    "code_forme": ["01", "00", "00"],
                    "code_modalite": ["N8", "N4", "B3"],
                    "date_effet_asr": [date(2013, 11, 30), date(2013, 1, 1), None],
                    "date_effet_cpom": [
                        date(2013, 12, 1),
                        date(2013, 12, 1),
                        date(2019, 4, 1),
                    ],
                    "date_fin_cpom": [
                        date(2018, 11, 30),
                        date(2018, 11, 30),
                        date(2023, 12, 31),
                    ],
                    "numero_cpom": ["01-00-C00000", "01-00-C00001", "01-00-C00002"],
                    "libelle_activite": [
                        "Surveillance continue",
                        "Soins palliatifs",
                        "Structure spécifique d'hospitalisation",
                    ],
                    "libelle_forme": [
                        "Hospitalisation complète (24 heures consécutives ou plus)",
                        "Pas de forme",
                        "Pas de forme",
                    ],
                    "libelle_modalite": [
                        "USC polyvalente - adulte (non adossée à une unité de réanimation)",
                        "Equipe mobile",
                        "Clinique ouverte",
                    ],
                    "numero_autorisation_arhgos": [
                        "01-00-RC00000",
                        "01-00-RC00001",
                        "01-00-RC00002",
                    ],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                    ],
                },
            )

            reconnaissances_contractuelles_enregistrées = pd.read_sql(
                TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_effet_asr": {"format": "%y-%m-%d"},
                    "date_effet_cpom": {"format": "%y-%m-%d"},
                    "date_fin_cpom": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(
                reconnaissances_contractuelles_attendues,
                reconnaissances_contractuelles_enregistrées,
            )

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1600102.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2021, 12, 14),
                FichierSource.FINESS_CS1600102.value,
            )

        @patch.object(datacrawler, "sauvegarde")
        def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde: Mock) -> None:
            # GIVEN
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.FINESS_CS1600102, base_de_données_test)
            reconnaissance_contractuelle_sanitaire_existante = pd.DataFrame([helios_reconnaissance_contractuelle_sanitaire_builder()])
            sauvegarde_une_reconnaissance_contractuelle_en_base(reconnaissance_contractuelle_sanitaire_existante, base_de_données_test)

            mocked_sauvegarde.side_effect = ValueError()

            # WHEN
            with pytest.raises(ValueError):
                ajoute_les_autorisations_des_établissements_sanitaires(
                    fichier_de_données_finess_cs1400103_de_test,
                    fichier_de_données_finess_cs1400104_de_test,
                    fichier_de_données_finess_cs1600101_de_test,
                    fichier_de_données_finess_cs1600102_de_test,
                    fichier_de_données_diamant_ann_sae,
                    base_de_données_test,
                    mocked_logger,
                )

            reconnaissances_contractuelles_enregistrées = pd.read_sql(
                TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
                parse_dates={
                    "date_effet_asr": {"format": "%y-%m-%d"},
                    "date_effet_cpom": {"format": "%y-%m-%d"},
                    "date_fin_cpom": {"format": "%y-%m-%d"},
                },
            )

            pd.testing.assert_frame_equal(
                reconnaissance_contractuelle_sanitaire_existante,
                reconnaissances_contractuelles_enregistrées,
            )

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1600102.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2020, 1, 1),
                FichierSource.FINESS_CS1600102.value,
            )

    class TestAjouteLesCapacitésDesÉtablissementsSanitaires:
        @freeze_time("2023-01-01")
        def test_sauvegarde_les_capacités_des_établissements_sanitaires_des_5_dernières_annees(
            self,
        ) -> None:
            # GIVEN
            autre_numéro_finess_sanitaire = "2A0000154"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                autre_numéro_finess_sanitaire,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            capacités_attendues = pd.DataFrame(
                {
                    "nombre_lits_chirurgie": [26, 12, 21, 30, 26, 30],
                    "nombre_lits_médecine": [62, 20, 60, 20, 60, 20],
                    "nombre_lits_obstétrique": [20, 8, 21, 8, 21, 8],
                    "nombre_lits_ssr": [30.0, NaN, 30.0, NaN, 30.0, NaN],
                    "nombre_places_chirurgie": [7, 6, 7, 6, 7, 6],
                    "nombre_places_médecine": [7, 2, 7, 2, 7, 2],
                    "nombre_places_obstétrique": [1.0, NaN, 1.0, NaN, 1.0, NaN],
                    "nombre_places_ssr": [3.0, NaN, 3.0, NaN, 3.0, NaN],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        autre_numéro_finess_sanitaire,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        autre_numéro_finess_sanitaire,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        autre_numéro_finess_sanitaire,
                    ],
                    "nombre_lits_usld": [15, 10, 15, 10, 15, 10],
                    "nombre_lits_ou_places_psy_complet": [NaN, 5.0, NaN, 5.0, NaN, 5.0],
                    "nombre_places_psy_partiel": [NaN, 13.0, NaN, 13.0, NaN, 13.0],
                    "annee": [2020, 2020, 2019, 2019, 2018, 2018],
                }
            )

            capacités_enregistrées = pd.read_sql(
                TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
            )
            pd.testing.assert_frame_equal(capacités_attendues, capacités_enregistrées)

        def test_sauvegarde_la_date_de_mise_à_jour_des_capacités(self) -> None:
            # GIVEN
            autre_numéro_finess_sanitaire = "2A0000154"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                autre_numéro_finess_sanitaire,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            date_du_fichier_ann_sae = base_de_données_test.execute(
                f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_SAE.value}'"
            )
            assert date_du_fichier_ann_sae.fetchone() == (
                date(2022, 8, 3),
                FichierSource.DIAMANT_ANN_SAE.value,
            )

        @freeze_time("2023-01-01")
        def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(
            self,
        ) -> None:
            # GIVEN
            autre_numéro_finess_sanitaire = "2A0000154"
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_un_établissement_en_base(
                autre_numéro_finess_sanitaire,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_les_capacités_sanitaires_en_base(pd.DataFrame([helios_ann_sae_builder()]), base_de_données_test)
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_SAE, base_de_données_test)

            # WHEN
            ajoute_les_autorisations_des_établissements_sanitaires(
                fichier_de_données_finess_cs1400103_de_test,
                fichier_de_données_finess_cs1400104_de_test,
                fichier_de_données_finess_cs1600101_de_test,
                fichier_de_données_finess_cs1600102_de_test,
                fichier_de_données_diamant_ann_sae,
                base_de_données_test,
                mocked_logger,
            )

            # THEN
            capacités_attendues = pd.DataFrame(
                {
                    "nombre_lits_chirurgie": [26, 12, 21, 30, 26, 30],
                    "nombre_lits_médecine": [62, 20, 60, 20, 60, 20],
                    "nombre_lits_obstétrique": [20, 8, 21, 8, 21, 8],
                    "nombre_lits_ssr": [30.0, NaN, 30.0, NaN, 30.0, NaN],
                    "nombre_places_chirurgie": [7, 6, 7, 6, 7, 6],
                    "nombre_places_médecine": [7, 2, 7, 2, 7, 2],
                    "nombre_places_obstétrique": [1.0, NaN, 1.0, NaN, 1.0, NaN],
                    "nombre_places_ssr": [3.0, NaN, 3.0, NaN, 3.0, NaN],
                    "numero_finess_etablissement_territorial": [
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        autre_numéro_finess_sanitaire,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        autre_numéro_finess_sanitaire,
                        NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                        autre_numéro_finess_sanitaire,
                    ],
                    "nombre_lits_usld": [15, 10, 15, 10, 15, 10],
                    "nombre_lits_ou_places_psy_complet": [NaN, 5.0, NaN, 5.0, NaN, 5.0],
                    "nombre_places_psy_partiel": [NaN, 13.0, NaN, 13.0, NaN, 13.0],
                    "annee": [2020, 2020, 2019, 2019, 2018, 2018],
                }
            )

            capacités_enregistrées = pd.read_sql(
                TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
            )

            pd.testing.assert_frame_equal(capacités_attendues, capacités_enregistrées)

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_SAE.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2022, 8, 3),
                FichierSource.DIAMANT_ANN_SAE.value,
            )

        @patch.object(datacrawler, "sauvegarde")
        def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde: Mock) -> None:
            # GIVEN
            capacités_sanitaires_existantes = pd.DataFrame([helios_ann_sae_builder()])
            sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
            sauvegarde_un_établissement_en_base(
                NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
                base_de_données_test,
            )
            sauvegarde_les_capacités_sanitaires_en_base(capacités_sanitaires_existantes, base_de_données_test)
            sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_ANN_SAE, base_de_données_test)

            mocked_sauvegarde.side_effect = ValueError()

            # WHEN
            with pytest.raises(ValueError):
                ajoute_les_autorisations_des_établissements_sanitaires(
                    fichier_de_données_finess_cs1400103_de_test,
                    fichier_de_données_finess_cs1400104_de_test,
                    fichier_de_données_finess_cs1600101_de_test,
                    fichier_de_données_finess_cs1600102_de_test,
                    fichier_de_données_diamant_ann_sae,
                    base_de_données_test,
                    mocked_logger,
                )

            capacités_enregistrées = pd.read_sql(
                TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
                base_de_données_test,
            )

            pd.testing.assert_frame_equal(capacités_sanitaires_existantes, capacités_enregistrées)

            date_du_fichier_de_données = base_de_données_test.execute(
                f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_ANN_SAE.value}'"""
            )
            assert date_du_fichier_de_données.fetchone() == (
                date(2020, 1, 1),
                FichierSource.DIAMANT_ANN_SAE.value,
            )

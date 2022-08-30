import gzip
import os
import shutil
from datetime import date

import pandas as pd
from numpy import NaN

from datacrawler.ajoute_les_autorisations_des_établissements_sanitaires import ajoute_les_autorisations_des_établissements_sanitaires
from datacrawler.load.nom_des_tables import (
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
    FichierSource,
)
from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
    base_de_données_test,
    mocked_logger,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)

archive_de_données_finess_cs1400103_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1400103_stock_20211214-0343.xml.gz")
fichier_de_données_finess_cs1400103_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1400103_stock_20211214-0343.xml")

archive_de_données_finess_cs1400104_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1400104_stock_20211214-0345.xml.gz")
fichier_de_données_finess_cs1400104_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1400104_stock_20211214-0345.xml")

archive_de_données_finess_cs1600101_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1600101_stock_20211214-0332.xml.gz")
fichier_de_données_finess_cs1600101_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1600101_stock_20211214-0332.xml")

archive_de_données_finess_cs1600102_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1600102_stock_20211214-0417.xml.gz")
fichier_de_données_finess_cs1600102_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1600102_stock_20211214-0417.xml")


def dézippe_les_archives_de_données() -> None:
    for (archive_de_données, fichier_de_données) in [
        (archive_de_données_finess_cs1400103_de_test, fichier_de_données_finess_cs1400103_de_test),
        (archive_de_données_finess_cs1400104_de_test, fichier_de_données_finess_cs1400104_de_test),
        (archive_de_données_finess_cs1600101_de_test, fichier_de_données_finess_cs1600101_de_test),
        (archive_de_données_finess_cs1600102_de_test, fichier_de_données_finess_cs1600102_de_test),
    ]:
        with gzip.open(archive_de_données, "rb") as archive:
            with open(fichier_de_données, "wb") as fichier_xml:
                shutil.copyfileobj(archive, fichier_xml)


def supprime_les_fichiers_de_données() -> None:
    for fichier_de_données in [
        fichier_de_données_finess_cs1400103_de_test,
        fichier_de_données_finess_cs1400104_de_test,
        fichier_de_données_finess_cs1600101_de_test,
        fichier_de_données_finess_cs1600102_de_test,
    ]:
        os.remove(fichier_de_données)


class TestAjouteLesAutorisationsDesÉtablissementsMédicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        dézippe_les_archives_de_données()

    def teardown_method(self) -> None:
        supprime_les_fichiers_de_données()

    def test_sauvegarde_les_autorisations_installées_des_établissements_sanitaires(self) -> None:
        # GIVEN
        numéro_finess_avec_valeurs_manquantes = "010786259"
        numéro_finess_inconnu_de_la_base = "490019148"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_les_autorisations_des_établissements_sanitaires(
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        autorisations_attendues = pd.DataFrame(
            [
                {
                    "code_activite": "16",
                    "code_forme": "00",
                    "code_modalite": "42",
                    "date_autorisation": date(2005, 10, 11),
                    "date_fin": date(2026, 5, 3),
                    "date_mise_en_oeuvre": date(2008, 12, 4),
                    "libelle_activite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Hémodialyse en unité médicalisée",
                    "numero_autorisation_arhgos": "01-00-000",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "code_activite": "16",
                    "code_forme": "14",
                    "code_modalite": "44",
                    "date_autorisation": date(2005, 10, 11),
                    "date_fin": date(2026, 5, 3),
                    "date_mise_en_oeuvre": date(2009, 11, 9),
                    "libelle_activite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                    "libelle_forme": "Non saisonnier",
                    "libelle_modalite": "Hémodialyse en unité d'auto dialyse assistée",
                    "numero_autorisation_arhgos": "01-00-111",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "code_activite": "16",
                    "code_forme": "00",
                    "code_modalite": "46",
                    "date_autorisation": date(2005, 10, 11),
                    "date_fin": date(2026, 5, 3),
                    "date_mise_en_oeuvre": date(2008, 12, 4),
                    "libelle_activite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Dialyse péritonéale à domicile",
                    "numero_autorisation_arhgos": "01-00-222",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "code_activite": "16",
                    "code_forme": "00",
                    "code_modalite": "45",
                    "date_autorisation": date(2005, 10, 11),
                    "date_fin": date(2026, 5, 3),
                    "date_mise_en_oeuvre": date(2008, 12, 4),
                    "libelle_activite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Hémodialyse à domicile",
                    "numero_autorisation_arhgos": "01-00-333",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "code_activite": "50",
                    "code_forme": "02",
                    "code_modalite": "78",
                    "date_autorisation": None,
                    "date_fin": None,
                    "date_mise_en_oeuvre": None,
                    "libelle_activite": "Soins de suite et de réadaptation non spécialisés",
                    "libelle_forme": "Hospitalisation à temps partiel de jour ou de nuit",
                    "libelle_modalite": "Juvénile (âge >= 6 ans et < 18 ans)",
                    "numero_autorisation_arhgos": "02-00-000",
                    "numero_finess_etablissement_territorial": numéro_finess_avec_valeurs_manquantes,
                },
            ]
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
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_les_autorisations_des_établissements_sanitaires(
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        date_du_fichier_finess_cs1400103 = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400103.value}'"
        )
        assert date_du_fichier_finess_cs1400103.fetchone() == (date(2021, 12, 14), FichierSource.FINESS_CS1400103.value)


class TestAjouteLesÉquipementsMatérielsLourdsDesÉtablissementsMédicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        dézippe_les_archives_de_données()

    def teardown_method(self) -> None:
        supprime_les_fichiers_de_données()

    def test_sauvegarde_les_équipements_matériels_lourds_des_établissements_sanitaires(self) -> None:
        # GIVEN
        numéro_finess_avec_valeurs_manquantes = "010786259"
        numéro_finess_inconnu_de_la_base = "490019148"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_les_autorisations_des_établissements_sanitaires(
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
            base_de_données_test,
            mocked_logger,
        )

        # THEN

        équipements_matériels_lourds_attendus = pd.DataFrame(
            [
                {
                    "code_equipement_materiel_lourd": "05602",
                    "date_autorisation": date(2007, 11, 6),
                    "date_fin": date(2029, 1, 1),
                    "date_mise_en_oeuvre": date(2011, 10, 19),
                    "libelle_equipement_materiel_lourd": "Scanographe à utilisation médicale",
                    "numero_autorisation_arhgos": "01-00-0000",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "code_equipement_materiel_lourd": "06201",
                    "date_autorisation": date(2006, 5, 2),
                    "date_fin": date(2027, 2, 16),
                    "date_mise_en_oeuvre": date(2009, 1, 20),
                    "libelle_equipement_materiel_lourd": "Appareil d'IRM à utilisation clinique",
                    "numero_autorisation_arhgos": "01-00-0001",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "code_equipement_materiel_lourd": "05701",
                    "date_autorisation": None,
                    "date_fin": None,
                    "date_mise_en_oeuvre": None,
                    "libelle_equipement_materiel_lourd": "Caméra à scintillation sans détecteur d'émission de positons",
                    "numero_autorisation_arhgos": "02-00-0000",
                    "numero_finess_etablissement_territorial": numéro_finess_avec_valeurs_manquantes,
                },
            ]
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

        pd.testing.assert_frame_equal(équipements_matériels_lourds_attendus, équipements_matériels_lourds_enregistrés)

    def test_sauvegarde_la_date_de_mise_à_jour_des_équipements_matériels_lourds(self) -> None:
        # GIVEN
        numéro_finess_avec_valeurs_manquantes = "010786259"
        numéro_finess_inconnu_de_la_base = "490019148"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_les_autorisations_des_établissements_sanitaires(
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        date_du_fichier_finess_cs1400104 = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400104.value}'"
        )
        assert date_du_fichier_finess_cs1400104.fetchone() == (date(2021, 12, 14), FichierSource.FINESS_CS1400104.value)


class TestAjouteLesAutresActivitésDesÉtablissementsMédicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        dézippe_les_archives_de_données()

    def teardown_method(self) -> None:
        supprime_les_fichiers_de_données()

    def test_sauvegarde_les_autres_activités_des_établissements_sanitaires(self) -> None:
        # GIVEN
        numéro_finess_avec_valeurs_manquantes = "010786259"
        numéro_finess_inconnu_de_la_base = "490019148"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_les_autorisations_des_établissements_sanitaires(
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        autres_activités_attendues = pd.DataFrame(
            [
                {
                    "code_activite": "A1",
                    "code_forme": "00",
                    "code_modalite": "M0",
                    "date_autorisation": date(2019, 6, 3),
                    "date_fin": date(2024, 8, 31),
                    "date_mise_en_oeuvre": date(2019, 6, 3),
                    "libelle_activite": "Dépôt de sang",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Dépôt d'urgence",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "code_activite": "A1",
                    "code_forme": "00",
                    "code_modalite": "M2",
                    "date_autorisation": date(2019, 6, 3),
                    "date_fin": date(2024, 8, 31),
                    "date_mise_en_oeuvre": date(2019, 6, 3),
                    "libelle_activite": "Dépôt de sang",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Dépôt relais",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "code_activite": "A0",
                    "code_forme": "15",
                    "code_modalite": "00",
                    "date_autorisation": None,
                    "date_fin": None,
                    "date_mise_en_oeuvre": None,
                    "libelle_activite": "Installation de chirurgie esthétique",
                    "libelle_forme": "Forme non précisée",
                    "libelle_modalite": "Pas de modalité",
                    "numero_finess_etablissement_territorial": numéro_finess_avec_valeurs_manquantes,
                },
            ]
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
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_les_autorisations_des_établissements_sanitaires(
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        date_du_fichier_finess_cs1600101 = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1600101.value}'"
        )
        assert date_du_fichier_finess_cs1600101.fetchone() == (date(2021, 12, 14), FichierSource.FINESS_CS1600101.value)


class TestAjouteLesReconnaissancesContractuellesDesÉtablissementsMédicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        dézippe_les_archives_de_données()

    def teardown_method(self) -> None:
        supprime_les_fichiers_de_données()

    def test_sauvegarde_les_reconnaissances_contractuelles_des_établissements_sanitaires(self) -> None:
        # GIVEN
        numéro_finess_avec_valeurs_manquantes = "010786259"
        numéro_finess_inconnu_de_la_base = "490019148"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_les_autorisations_des_établissements_sanitaires(
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        reconnaissances_contractuelles_attendues = pd.DataFrame(
            [
                {
                    "capacite_autorisee": 4,
                    "code_activite": "R7",
                    "code_forme": "01",
                    "code_modalite": "N8",
                    "date_effet_asr": date(2013, 11, 30),
                    "date_effet_cpom": date(2013, 12, 1),
                    "date_fin_cpom": date(2018, 11, 30),
                    "id_cpom": "01-00-C00000",
                    "libelle_activite": "Surveillance continue",
                    "libelle_forme": "Hospitalisation complète (24 heures consécutives ou plus)",
                    "libelle_modalite": "USC polyvalente - adulte (non adossée à une unité de réanimation)",
                    "numero_autorisation_arhgos": "01-00-RC00000",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "capacite_autorisee": 1,
                    "code_activite": "R4",
                    "code_forme": "00",
                    "code_modalite": "N4",
                    "date_effet_asr": date(2013, 1, 1),
                    "date_effet_cpom": date(2013, 12, 1),
                    "date_fin_cpom": date(2018, 11, 30),
                    "id_cpom": "01-00-C00001",
                    "libelle_activite": "Soins palliatifs",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Equipe mobile",
                    "numero_autorisation_arhgos": "01-00-RC00001",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "capacite_autorisee": 0,
                    "code_activite": "S6",
                    "code_forme": "00",
                    "code_modalite": "B3",
                    "date_effet_asr": None,
                    "date_effet_cpom": date(2019, 4, 1),
                    "date_fin_cpom": date(2023, 12, 31),
                    "id_cpom": "01-00-C00002",
                    "libelle_activite": "Structure spécifique d'hospitalisation",
                    "libelle_forme": "Pas de forme",
                    "libelle_modalite": "Clinique ouverte",
                    "numero_autorisation_arhgos": "01-00-RC00002",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
                },
                {
                    "capacite_autorisee": NaN,
                    "code_activite": "R7",
                    "code_forme": "01",
                    "code_modalite": "09",
                    "date_effet_asr": None,
                    "date_effet_cpom": None,
                    "date_fin_cpom": None,
                    "id_cpom": "02-00-C00000",
                    "libelle_activite": "Surveillance continue",
                    "libelle_forme": "Hospitalisation complète (24 heures consécutives ou plus)",
                    "libelle_modalite": "Adulte (âge >=18 ans)",
                    "numero_autorisation_arhgos": "02-00-RC00000",
                    "numero_finess_etablissement_territorial": numéro_finess_avec_valeurs_manquantes,
                },
            ]
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

        pd.testing.assert_frame_equal(reconnaissances_contractuelles_attendues, reconnaissances_contractuelles_enregistrées)

    def test_sauvegarde_la_date_de_mise_à_jour_des_reconnaissances_contractuelles(self) -> None:
        # GIVEN
        numéro_finess_avec_valeurs_manquantes = "010786259"
        numéro_finess_inconnu_de_la_base = "490019148"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_les_autorisations_des_établissements_sanitaires(
            fichier_de_données_finess_cs1400103_de_test,
            fichier_de_données_finess_cs1400104_de_test,
            fichier_de_données_finess_cs1600101_de_test,
            fichier_de_données_finess_cs1600102_de_test,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        date_du_fichier_finess_cs1600102 = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1600102.value}'"
        )
        assert date_du_fichier_finess_cs1600102.fetchone() == (date(2021, 12, 14), FichierSource.FINESS_CS1600102.value)

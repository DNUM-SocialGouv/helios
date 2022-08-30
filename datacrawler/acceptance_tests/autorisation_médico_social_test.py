import gzip
import os
import shutil
from datetime import date

import pandas as pd
from numpy import NaN

from datacrawler.ajoute_les_autorisations_des_établissements_médico_sociaux import ajoute_les_autorisations_des_établissements_médico_sociaux
from datacrawler.load.nom_des_tables import (
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
    FichierSource,
)
from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
    base_de_données_test,
    mocked_logger,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)


class TestAjouteLesAutorisationsDesÉtablissementsMédicoSociaux:
    archive_de_données_de_test = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1400105_stock_20211214-0346.xml.gz")
    fichier_de_données = os.path.join("data_set", "flux_finess", "enrichi", "finess_cs1400105_stock_20211214-0346.xml")

    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        with gzip.open(self.archive_de_données_de_test, "rb") as archive:
            with open(self.fichier_de_données, "wb") as fichier_xml:
                shutil.copyfileobj(archive, fichier_xml)

    def teardown_method(self) -> None:
        os.remove(self.fichier_de_données)

    def test_sauvegarde_les_autorisations_installées_des_établissements_médico_sociaux(self) -> None:
        # GIVEN
        numéro_finess_avec_valeurs_manquantes = "010786259"
        numéro_finess_inconnu_de_la_base = "140004698"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_inconnu_de_la_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        chemin_du_fichier_finess_cs1400105 = self.fichier_de_données

        # WHEN
        ajoute_les_autorisations_des_établissements_médico_sociaux(chemin_du_fichier_finess_cs1400105, base_de_données_test, mocked_logger)

        # THEN
        autorisations_attendues = pd.DataFrame(
            [
                {
                    "activite": "11",
                    "capacite_autorisee_totale": NaN,
                    "capacite_installee_totale": NaN,
                    "clientele": "700",
                    "date_autorisation": None,
                    "date_derniere_installation": None,
                    "date_mise_a_jour_autorisation": None,
                    "discipline_equipement": "925",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Personnes Agées (Sans Autre Indication)",
                    "libelle_discipline_equipement": "Hébergement résidence autonomie personnes âgées seules F1",
                    "numero_finess_etablissement_territorial": numéro_finess_avec_valeurs_manquantes,
                },
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 15,
                    "capacite_installee_totale": 15,
                    "clientele": "810",
                    "date_autorisation": date(2016, 10, 7),
                    "date_derniere_installation": date(2018, 4, 16),
                    "date_mise_a_jour_autorisation": date(2018, 12, 21),
                    "discipline_equipement": "957",
                    "est_installee": False,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Adultes en Difficulté d'Insertion Sociale (SAI)",
                    "libelle_discipline_equipement": "Hébergement d'insertion Adultes,Familles Difficulté",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                },
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 75,
                    "capacite_installee_totale": 15,
                    "clientele": "810",
                    "date_autorisation": date(2016, 10, 7),
                    "date_derniere_installation": date(2018, 4, 16),
                    "date_mise_a_jour_autorisation": date(2019, 12, 28),
                    "discipline_equipement": "957",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Adultes en Difficulté d'Insertion Sociale (SAI)",
                    "libelle_discipline_equipement": "Hébergement d'insertion Adultes,Familles Difficulté",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                },
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 75,
                    "capacite_installee_totale": 75,
                    "clientele": "810",
                    "date_autorisation": date(2016, 10, 7),
                    "date_derniere_installation": date(2018, 4, 16),
                    "date_mise_a_jour_autorisation": date(2019, 12, 28),
                    "discipline_equipement": "957",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Adultes en Difficulté d'Insertion Sociale (SAI)",
                    "libelle_discipline_equipement": "Hébergement d'insertion Adultes,Familles Difficulté",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
                },
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 8,
                    "capacite_installee_totale": 8,
                    "clientele": "110",
                    "date_autorisation": date(2017, 1, 3),
                    "date_derniere_installation": date(2016, 11, 29),
                    "date_mise_a_jour_autorisation": date(2017, 4, 21),
                    "discipline_equipement": "901",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Déficience Intellectuelle (sans autre indication)",
                    "libelle_discipline_equipement": "Éducation Générale et Soins Spécialisés Enfants Handicapés",
                    "numero_finess_etablissement_territorial": "140004698",
                },
                {
                    "activite": "13",
                    "capacite_autorisee_totale": 21,
                    "capacite_installee_totale": 21,
                    "clientele": "110",
                    "date_autorisation": date(2017, 1, 3),
                    "date_derniere_installation": date(2016, 11, 29),
                    "date_mise_a_jour_autorisation": date(2017, 4, 21),
                    "discipline_equipement": "901",
                    "est_installee": True,
                    "libelle_activite": "Semi-Internat",
                    "libelle_clientele": "Déficience Intellectuelle (sans autre indication)",
                    "libelle_discipline_equipement": "Éducation Générale et Soins Spécialisés Enfants Handicapés",
                    "numero_finess_etablissement_territorial": "140004698",
                },
                {
                    "activite": "13",
                    "capacite_autorisee_totale": 6,
                    "capacite_installee_totale": 6,
                    "clientele": "500",
                    "date_autorisation": date(2017, 1, 3),
                    "date_derniere_installation": date(2016, 11, 29),
                    "date_mise_a_jour_autorisation": date(2017, 4, 21),
                    "discipline_equipement": "901",
                    "est_installee": False,
                    "libelle_activite": "Semi-Internat",
                    "libelle_clientele": "Polyhandicap",
                    "libelle_discipline_equipement": "Éducation Générale et Soins Spécialisés Enfants Handicapés",
                    "numero_finess_etablissement_territorial": "140004698",
                },
            ]
        )

        autorisations_enregistrées = pd.read_sql(
            TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
            base_de_données_test,
            parse_dates={
                "date_autorisation": {"format": "%y-%m-%d"},
                "date_derniere_installation": {"format": "%y-%m-%d"},
                "date_mise_a_jour_autorisation": {"format": "%y-%m-%d"},
            },
            columns=[
                "activite",
                "capacite_autorisee_totale",
                "capacite_installee_totale",
                "clientele",
                "date_autorisation",
                "date_derniere_installation",
                "date_mise_a_jour_autorisation",
                "discipline_equipement",
                "est_installee",
                "libelle_activite",
                "libelle_clientele",
                "libelle_discipline_equipement",
                "numero_finess_etablissement_territorial",
            ],
        )

        pd.testing.assert_frame_equal(autorisations_enregistrées, autorisations_attendues)

        date_du_fichier_finess_cs1400105 = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.FINESS_CS1400105.value}'"""
        )
        assert date_du_fichier_finess_cs1400105.fetchone() == (date(2021, 12, 14), FichierSource.FINESS_CS1400105.value)

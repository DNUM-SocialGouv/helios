from datetime import date
from unittest.mock import Mock, patch

import pandas as pd
from freezegun import freeze_time
import pytest
import datacrawler
from datacrawler.load.nom_des_tables import (
    TABLES_DES_RESSOURCES_HUMAINES_ETABLISSEMENT_SANITAIRE,
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    FichierSource
)
from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    NUMÉRO_FINESS_ÉTABLISSEMENT,
    base_de_données_test,
    mocked_logger,
    supprime_les_données_des_tables,
    sauvegarde_une_entité_juridique_en_base,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_les_indicateurs_ressources_humaines_en_base_etablissement_sanitaire
)

from datacrawler.test_helpers.helios_builder import helios_etablissement_sanitaire_ressources_humaines_builder

from datacrawler.ajoute_le_bloc_ressources_humaines_des_etablissements_sanitaires import (
    ajoute_le_bloc_ressources_humaines_des_etablissement_sanitaires
)
class TestAjouteBlocRessourcesHumainesEtablissementSanitaire:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    @freeze_time("2023-02-16")
    def test_savegarde_les_donnees_des_ressources_humaines( self) -> None:

        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT,NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)
        chemin_du_fichier_quo_san_finance = "data_test/entrée/diamant/QUO_SAN_FINANCE_2023_02_15.csv"

        ajoute_le_bloc_ressources_humaines_des_etablissement_sanitaires(
            chemin_du_fichier_quo_san_finance,
            base_de_données_test,
            mocked_logger
        )

        donnees_ressources_humaine_ej_attendu = pd.DataFrame(
            data = {
                "numero_finess_etablissement_territorial": ["010001261"] * 5,
                "annee": [2022, 2021, 2020, 2019, 2018],
                "nombre_etp_pm": [64.28, 7.63, 54.67, 18.21, 6.82],
                "nombre_etp_pnm": [275.17, 241.39, 321.62, 162.47, 102.18],
                "depenses_interim_pm": [226841.27, 166460.48, 14680.40, 83508.00, 9641.27],
                "jours_absenteisme_pm": [213.25, 341.69, 187.44, 249.60, 283.25],
                "jours_absenteisme_pnm": [1534.90, 8810.76, 12200.12, 916.96, 1434.90],
            }
        )

        donnees_ressources_humaines_enregistrees = pd.read_sql(
            TABLES_DES_RESSOURCES_HUMAINES_ETABLISSEMENT_SANITAIRE,
            base_de_données_test
        )

        pd.testing.assert_frame_equal(donnees_ressources_humaines_enregistrees.sort_index(axis=1),donnees_ressources_humaine_ej_attendu.sort_index(axis=1))

    @freeze_time("2023-02-16")
    def test_sauvegarde_les_dates_de_mise_a_jour_des_indicateurs_ressources_humaines(self) -> None:
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT,NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)

        chemin_du_fichier_quo_san_finance = "data_test/entrée/diamant/QUO_SAN_FINANCE_2023_02_15.csv"

        ajoute_le_bloc_ressources_humaines_des_etablissement_sanitaires(
            chemin_du_fichier_quo_san_finance,
            base_de_données_test,
            mocked_logger
        )

        date_mise_a_jour_fichier_quo_san_finance = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_QUO_SAN_FINANCE.value}'"
        )
        assert date_mise_a_jour_fichier_quo_san_finance.fetchone() == (date(2023, 2, 15), FichierSource.DIAMANT_QUO_SAN_FINANCE.value)


    @freeze_time("2023-02-16")
    def test_supression_donnees_existantes_avant_insertion_des_nouvelles(self) -> None:
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT,NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)

        donnees_avant_suppression_attendu = pd.DataFrame([helios_etablissement_sanitaire_ressources_humaines_builder()])
        sauvegarde_les_indicateurs_ressources_humaines_en_base_etablissement_sanitaire(donnees_avant_suppression_attendu,base_de_données_test)
        donnees_avant_suppression = pd.read_sql(
            TABLES_DES_RESSOURCES_HUMAINES_ETABLISSEMENT_SANITAIRE,
            base_de_données_test
        )


        chemin_du_fichier_quo_san_finance = "data_test/entrée/diamant/QUO_SAN_FINANCE_2023_02_15.csv"

        ajoute_le_bloc_ressources_humaines_des_etablissement_sanitaires(
            chemin_du_fichier_quo_san_finance,
            base_de_données_test,
            mocked_logger
        )

        donnees_ressources_humaine_etsan_attendu = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": ["010001261"] * 5,
                "annee": [2022, 2021, 2020, 2019, 2018],
                "nombre_etp_pm": [64.28, 7.63, 54.67, 18.21, 6.82],
                "nombre_etp_pnm": [275.17, 241.39, 321.62, 162.47, 102.18],
                "depenses_interim_pm": [226841.27, 166460.48, 14680.40, 83508.00, 9641.27],
                "jours_absenteisme_pm": [213.25, 341.69, 187.44, 249.60, 283.25],
                "jours_absenteisme_pnm": [1534.90, 8810.76, 12200.12, 916.96, 1434.90],
            }
        )

        donnees_ressources_humaines_enregistrees = pd.read_sql(
            TABLES_DES_RESSOURCES_HUMAINES_ETABLISSEMENT_SANITAIRE,
            base_de_données_test
        )

        pd.testing.assert_frame_equal(donnees_avant_suppression.sort_index(axis=1),donnees_avant_suppression_attendu.sort_index(axis=1))
        pd.testing.assert_frame_equal(donnees_ressources_humaines_enregistrees.sort_index(axis=1),donnees_ressources_humaine_etsan_attendu.sort_index(axis=1))


    @patch.object(datacrawler, "sauvegarde")
    def test_revient_a_la_situation_initiale_si_l_ecriture_des_indicateurs_ressources_humaines_echoue(self, mocked_sauvegarde: Mock) -> None:
        chemin_du_fichier_quo_san_finance = "data_test/entrée/diamant/QUO_SAN_FINANCE_2023_02_15.csv"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT,NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)

        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", FichierSource.DIAMANT_QUO_SAN_FINANCE, base_de_données_test)
        donnees_table_ressources_humaines_etsan = pd.DataFrame([helios_etablissement_sanitaire_ressources_humaines_builder()])
        sauvegarde_les_indicateurs_ressources_humaines_en_base_etablissement_sanitaire(donnees_table_ressources_humaines_etsan,base_de_données_test)

        mocked_sauvegarde.side_effect = ValueError

        with pytest.raises(ValueError):
            ajoute_le_bloc_ressources_humaines_des_etablissement_sanitaires(
                chemin_du_fichier_quo_san_finance,
                base_de_données_test,
                mocked_logger
            )

        donnees_ressources_humaines_enregistrees = pd.read_sql(
            TABLES_DES_RESSOURCES_HUMAINES_ETABLISSEMENT_SANITAIRE,
            base_de_données_test
        )

        pd.testing.assert_frame_equal(
            donnees_ressources_humaines_enregistrees.sort_index(axis=1),
            donnees_table_ressources_humaines_etsan.sort_index(axis=1)
            )

        date_du_fichier_aquo_san_finance = base_de_données_test.execute(
            f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_QUO_SAN_FINANCE.value}'"""
        )
        assert date_du_fichier_aquo_san_finance.fetchone() == (date(2020, 1, 1), FichierSource.DIAMANT_QUO_SAN_FINANCE.value)

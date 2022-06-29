from unittest.mock import MagicMock, patch

import pandas as pd
import pandas.testing
import pytest
from numpy import NaN

import datacrawler
from datacrawler.ajoute_les_activités_des_établissements_médico_sociaux import \
    ajoute_les_activités_des_établissements_médico_sociaux
from datacrawler.load.activités_des_établissements_médico_sociaux import \
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.test import nettoie_la_base_de_données, sauvegarde_un_établissement_en_base, \
    sauvegarde_une_entité_juridique_en_base, sauvegarde_une_activité_en_base, base_de_données_test


class TestAjouteLesActivitesDesEtablissementsMedicoSociaux:
    def setup_method(self):
        nettoie_la_base_de_données(base_de_données_test)

    def test_sauvegarde_les_données_dans_une_base_de_données_vide(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        logger = MagicMock()

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, base_de_données_test, logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "année": 2018,
                    "numérofinessÉtablissementterritorial": "010003598",
                    "tauxoccupationaccueildejour": 0.48012820512820514,
                    "tauxoccupationhébergementtemporaire": 0.93698630136986305,
                    "tauxoccupationhébergementpermanent": 0.99779299847793002,
                    "tauxréalisationactivité": NaN,
                    "fileactivepersonnesaccompagnées": NaN,
                    "nombremoyenjournéesabsencepersonnesaccompagnées": NaN,
                    "duréemoyenneséjouraccompagnementpersonnessorties": NaN,
                }
            ],
        )

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self):
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        activité = pd.DataFrame({
            "année": [2018, 2019],
            "numérofinessÉtablissementterritorial": ["010003598", "010003598"],
            "tauxoccupationaccueildejour": [0.48012820512820514, NaN],
            "tauxoccupationhébergementtemporaire": [0.93698630136986305, NaN],
            "tauxoccupationhébergementpermanent": [0.99779299847793002, NaN],
            "tauxréalisationactivité": [NaN, NaN],
            "fileactivepersonnesaccompagnées": [NaN, NaN],
            "nombremoyenjournéesabsencepersonnesaccompagnées": [NaN, NaN],
            "duréemoyenneséjouraccompagnementpersonnessorties": [NaN, NaN],
        })
        sauvegarde_une_activité_en_base(activité, base_de_données_test)

        logger = MagicMock()

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, base_de_données_test, logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "année": 2018,
                    "numérofinessÉtablissementterritorial": "010003598",
                    "tauxoccupationaccueildejour": 0.48012820512820514,
                    "tauxoccupationhébergementtemporaire": 0.93698630136986305,
                    "tauxoccupationhébergementpermanent": 0.99779299847793002,
                    "tauxréalisationactivité": NaN,
                    "fileactivepersonnesaccompagnées": NaN,
                    "nombremoyenjournéesabsencepersonnesaccompagnées": NaN,
                    "duréemoyenneséjouraccompagnementpersonnessorties": NaN,
                }
            ],
        )

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

    @patch.object(datacrawler.ajoute_les_activités_des_établissements_médico_sociaux,
                  'sauvegarde_les_activités_des_établissements_médico_sociaux')
    def test_revient_à_la_situation_initale_si_l_écriture_des_activités_échoue(
            self,
            mocked_sauvegarde_les_activités_des_établissements_médico_sociaux
    ):
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        table_activité_existante = pd.DataFrame({
            "année": [2018, 2019],
            "numérofinessÉtablissementterritorial": ["010003598", "010003598"],
            "tauxoccupationaccueildejour": [0.48012820512820514, NaN],
            "tauxoccupationhébergementtemporaire": [0.93698630136986305, NaN],
            "tauxoccupationhébergementpermanent": [0.99779299847793002, NaN],
            "tauxréalisationactivité": [NaN, NaN],
            "fileactivepersonnesaccompagnées": [NaN, NaN],
            "nombremoyenjournéesabsencepersonnesaccompagnées": [NaN, NaN],
            "duréemoyenneséjouraccompagnementpersonnessorties": [NaN, NaN],
        })
        sauvegarde_une_activité_en_base(table_activité_existante, base_de_données_test)

        logger = MagicMock()

        mocked_sauvegarde_les_activités_des_établissements_médico_sociaux.side_effect = ValueError()

        # WHEN
        with pytest.raises(ValueError):
            ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, base_de_données_test, logger)

        # THEN
        table_activité = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pandas.testing.assert_frame_equal(table_activité, table_activité_existante)

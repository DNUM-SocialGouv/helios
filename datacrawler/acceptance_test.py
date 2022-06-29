import logging

import pandas as pd
import pandas.testing
from numpy import NaN
from sqlalchemy import create_engine

from datacrawler.ajoute_les_activités_des_établissements_médico_sociaux import ajoute_les_activités_des_établissements_médico_sociaux
from datacrawler.load.activités_des_établissements_médico_sociaux import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.test import nettoie_la_base_de_données, sauvegarde_un_établissement_en_base, sauvegarde_une_entité_juridique_en_base


class TestAcceptance:
    def setup_method(self):
        self.base_de_données = create_engine("postgresql://helios:h3li0s@localhost:5433/helios")
        nettoie_la_base_de_données(self.base_de_données)

    def sauvegarde_les_données_dans_une_base_de_données_vide(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", self.base_de_données)
        sauvegarde_un_établissement_en_base("010003598", "010008407", self.base_de_données)
        logger = logging.getLogger("Helios")

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, self.base_de_données, logger)

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

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, self.base_de_données)

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

    def supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", self.base_de_données)
        sauvegarde_un_établissement_en_base("010003598", "010008407", self.base_de_données)
        logger = logging.getLogger("Helios")

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, self.base_de_données, logger)

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

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, self.base_de_données)

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

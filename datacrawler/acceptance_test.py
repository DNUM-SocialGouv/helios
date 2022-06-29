import pandas as pd
import pandas.testing
from sqlalchemy import create_engine

from datacrawler.ajoute_les_activités_des_établissements_médico_sociaux import ajoute_les_activités_des_établissements_médico_sociaux
from datacrawler.load.activités_des_établissements_médico_sociaux import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.test import nettoie_la_base_de_données, sauvegarde_un_établissement_en_base, sauvegarde_une_entité_juridique_en_base
from datacrawler.transform.diamant.équivalences_diamant_helios import index_des_activités_médico_sociales


class TestAcceptance:
    def setup_method(self):
        self.base_de_données = create_engine("postgresql://helios:h3li0s@localhost:5433/helios")
        nettoie_la_base_de_données(self.base_de_données)

    def test_bout_en_bout(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("123456789", self.base_de_données)
        sauvegarde_un_établissement_en_base("010001261", "123456789", self.base_de_données)

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, self.base_de_données)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "numérofinessÉtablissementterritorial": "010001261",
                    "année": 2018,
                    "tauxoccupationhébergementpermanent": 0.99779299847793002,
                    "tauxoccupationhébergementtemporaire": 0.93698630136986305,
                    "tauxoccupationaccueildejour": 0.48012820512820514,
                }
            ],
        ).set_index(index_des_activités_médico_sociales)

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, self.base_de_données)

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

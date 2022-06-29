import pandas as pd
from sqlalchemy import create_engine

from datacrawler.extract.lecteur_sql import trouve_les_finess_des_établissements_en_base
from datacrawler.test import sauvegarde_une_entité_juridique_en_base, sauvegarde_un_établissement_en_base, \
    nettoie_la_base_de_données


class TestTrouveLesFinessDesEtablissementsEnBase:
    def setup_method(self):
        self.base_de_données = create_engine("postgresql://helios:h3li0s@localhost:5433/helios")
        nettoie_la_base_de_données(self.base_de_données)

    def test_récupère_les_numéros_finess_des_établissements_en_base(self):
        # GIVEN

        sauvegarde_une_entité_juridique_en_base('123456789', self.base_de_données)
        sauvegarde_un_établissement_en_base('987654321', '123456789', self.base_de_données)

        # WHEN
        données = trouve_les_finess_des_établissements_en_base(self.base_de_données)

        # THEN
        pd.testing.assert_frame_equal(données, pd.DataFrame(
            {
                'numérofinessÉtablissementterritorial': ['987654321'],
            }
        ))

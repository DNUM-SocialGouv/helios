import pandas as pd

from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.test import base_de_données_test, nettoie_la_base_de_données, sauvegarde_un_établissement_en_base, sauvegarde_une_entité_juridique_en_base


class TestTrouveLesFinessDesEtablissementsEnBase:
    def setup_method(self):
        nettoie_la_base_de_données(base_de_données_test)

    def test_récupère_les_numéros_finess_des_établissements_en_base(self):
        # GIVEN

        sauvegarde_une_entité_juridique_en_base("123456789", base_de_données_test)
        sauvegarde_un_établissement_en_base("987654321", "123456789", base_de_données_test)

        # WHEN
        données = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données_test)

        # THEN
        pd.testing.assert_frame_equal(
            données,
            pd.DataFrame(
                {
                    "numero_finess_etablissement_territorial": ["987654321"],
                }
            ),
        )

    def test_récupère_les_numéros_finess_des_établissements_en_base_quand_ils_commencent_par_zéro(self):
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("123456789", base_de_données_test)
        sauvegarde_un_établissement_en_base("098765432", "123456789", base_de_données_test)

        # WHEN
        données = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données_test)

        # THEN
        pd.testing.assert_frame_equal(
            données,
            pd.DataFrame(
                {
                    "numero_finess_etablissement_territorial": ["098765432"],
                }
            ),
        )

import pandas as pd

from datacrawler.load.activités_des_établissements_médico_sociaux import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.load.sauvegarde_les_activités_des_établissements_médico_sociaux import sauvegarde_les_activités_des_établissements_médico_sociaux
from datacrawler.test import base_de_données_test, nettoie_la_base_de_données, sauvegarde_un_établissement_en_base, sauvegarde_une_entité_juridique_en_base
from datacrawler.transform.diamant.équivalences_diamant_helios import index_des_activités_médico_sociales


class TestSauvegardeDesActivitésDesÉtablissementsMédicoSociaux:
    def setup_method(self):
        nettoie_la_base_de_données(base_de_données_test)

    def test_la_sauvegarde_d_une_activité_d_un_établissement_médico_social(self):
        # GIVEN
        numéro_finess_entité_juridique = "111111111"
        numéro_finess_établissement_territorial = "22222222"
        sauvegarde_une_entité_juridique_en_base(numéro_finess_entité_juridique, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_territorial, numéro_finess_entité_juridique, base_de_données_test)

        activités_médico_sociales = pd.DataFrame(
            [
                {
                    "numérofinessÉtablissementterritorial": numéro_finess_établissement_territorial,
                    "année": 2018,
                    "tauxoccupationhébergementpermanent": 0.99779299847793002,
                    "tauxoccupationhébergementtemporaire": 0.93698630136986305,
                    "tauxoccupationaccueildejour": 0.48012820512820514,
                }
            ],
        ).set_index(index_des_activités_médico_sociales)

        # WHEN
        sauvegarde_les_activités_des_établissements_médico_sociaux(base_de_données_test, activités_médico_sociales)

        # THEN
        activités_en_base = pd.read_sql(
            f"SELECT * FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX}", base_de_données_test, index_col=index_des_activités_médico_sociales
        )
        activité_attendue = pd.DataFrame(
            [
                {
                    "numérofinessÉtablissementterritorial": numéro_finess_établissement_territorial,
                    "année": 2018,
                    "tauxoccupationaccueildejour": 0.48012820512820514,
                    "tauxoccupationhébergementtemporaire": 0.93698630136986305,
                    "tauxoccupationhébergementpermanent": 0.99779299847793002,
                    "tauxréalisationactivité": None,
                    "fileactivepersonnesaccompagnées": None,
                    "nombremoyenjournéesabsencepersonnesaccompagnées": None,
                    "duréemoyenneséjouraccompagnementpersonnessorties": None,
                }
            ],
        ).set_index(index_des_activités_médico_sociales)
        pd.testing.assert_frame_equal(activité_attendue, activités_en_base)

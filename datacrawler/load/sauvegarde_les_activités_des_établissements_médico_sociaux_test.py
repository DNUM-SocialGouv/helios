import pandas as pd
from sqlalchemy import create_engine

from datacrawler.load.activités_des_établissements_médico_sociaux import (
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
    TableActivitésDesÉtablissementsMédicoSociaux,
)
from datacrawler.load.sauvegarde_les_activités_des_établissements_médico_sociaux import sauvegarde_les_activités_des_établissements_médico_sociaux
from datacrawler.test import sauvegarde_une_entité_juridique_en_base, sauvegarde_un_établissement_en_base, \
    nettoie_la_base_de_données
from datacrawler.transform.diamant.équivalences_diamant_helios import index_des_activités_médico_sociales


class TestSauvegardeDesActivitésDesÉtablissementsMédicoSociaux:
    def setup_method(self):
        self.base_de_données = create_engine("postgresql://helios:h3li0s@localhost:5433/helios")
        nettoie_la_base_de_données(self.base_de_données)


    def test_la_sauvegarde_d_une_activité_d_un_établissement_médico_social(self):
        # GIVEN
        numéro_finess_entité_juridique = "111111111"
        numéro_finess_établissement_territorial = "22222222"
        sauvegarde_une_entité_juridique_en_base(numéro_finess_entité_juridique, self.base_de_données)
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_territorial, numéro_finess_entité_juridique, self.base_de_données)

        activités_médico_sociales = pd.DataFrame(
            [
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: numéro_finess_établissement_territorial,
                    TableActivitésDesÉtablissementsMédicoSociaux.année: 2018,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: 0.48012820512820514,
                }
            ],
        ).set_index(index_des_activités_médico_sociales)

        # WHEN
        sauvegarde_les_activités_des_établissements_médico_sociaux(self.base_de_données, activités_médico_sociales)

        # THEN
        activités_en_base = pd.read_sql(
            f"SELECT * FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX}", self.base_de_données, index_col=index_des_activités_médico_sociales
        )
        activité_attendue = pd.DataFrame(
            [
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: numéro_finess_établissement_territorial,
                    TableActivitésDesÉtablissementsMédicoSociaux.année: 2018,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: 0.48012820512820514,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_réalisation_activité: None,
                    TableActivitésDesÉtablissementsMédicoSociaux.file_active_personnes_accompagnées: None,
                    TableActivitésDesÉtablissementsMédicoSociaux.nombre_moyen_journées_absence_personnes_accompagnées: None,
                    TableActivitésDesÉtablissementsMédicoSociaux.durée_moyenne_séjour_accompagnement_personnes_sorties: None,
                }
            ],
        ).set_index(index_des_activités_médico_sociales)
        pd.testing.assert_frame_equal(activité_attendue, activités_en_base)

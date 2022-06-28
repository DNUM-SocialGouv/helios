import pandas as pd
import pandas.testing

from datacrawler.load.activités_des_établissements_médico_sociaux import TableActivitésDesÉtablissementsMédicoSociaux
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import transforme_les_activités_des_établissements_médico_sociaux


class TestAcceptance:
    def test_bout_en_bout(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"

        # WHEN
        data_frame = transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: "010001261",
                    TableActivitésDesÉtablissementsMédicoSociaux.année: 2018,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: 0.48012820512820514,
                }
            ],
        ).set_index([TableActivitésDesÉtablissementsMédicoSociaux.année, TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial])

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

    def test_supprime_les_lignes_sans_année(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"

        # WHEN
        data_frame = transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial: "010001261",
                    TableActivitésDesÉtablissementsMédicoSociaux.année: 2018,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent: 0.99779299847793002,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire: 0.93698630136986305,
                    TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour: 0.48012820512820514,
                }
            ],
        ).set_index([TableActivitésDesÉtablissementsMédicoSociaux.année, TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial])

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

import pandas as pd

from datacrawler.extract.lecteur_csv import lis_le_fichier_csv


class TestLisLeFichierCsv:
    def test_lis_les_colonnes_demandées_du_fichier_csv(self):
        # GIVEN
        chemin_du_fichier = 'data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV'
        colonnes = ['Finess', 'MS Résultat net comptable ERRD']
        types_des_colonnes = {
            'Finess': str,
            'MS Résultat net comptable ERRD': float
        }

        # WHEN
        données = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        pd.testing.assert_frame_equal(données, pd.DataFrame(
            {
                'Finess': ['010001261'],
                'MS Résultat net comptable ERRD': [3034.379999999893]
            }
        ))

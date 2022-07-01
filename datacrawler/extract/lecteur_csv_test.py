import pandas as pd
from numpy import NaN

from datacrawler.extract.lecteur_csv import lis_le_fichier_csv


class TestLisLeFichierCsv:
    def test_lis_les_colonnes_demandées_du_fichier_csv(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        colonnes = ["Finess", "MS Résultat net comptable ERRD"]
        types_des_colonnes = {"Finess": str, "MS Résultat net comptable ERRD": float}

        # WHEN
        données = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        pd.testing.assert_frame_equal(
            données,
            pd.DataFrame(
                {
                    "Finess": ["010003598", "010003598", "010003598", "010786259", "010786259", "111111111", "010789717"],
                    "MS Résultat net comptable ERRD": [
                        3034.379999999893,
                        7289.92000000039,
                        28544.47998999985,
                        58726.620000000345,
                        58726.620000000345,
                        NaN,
                        NaN,
                    ],
                }
            ),
        )

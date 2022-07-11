import pandas as pd
from numpy import NaN

from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_ann_errd_ej_et,
    colonnes_à_lire_ann_ms_tdp_et,
    colonnes_à_lire_men_pmsi_annuel,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_errd_ej_et_helios,
    équivalences_diamant_ann_ms_tdp_et_helios,
    équivalences_diamant_men_pmsi_annuel_helios,
)


class TestLisLeFichierCsv:
    def test_lis_les_colonnes_demandées_du_fichier_csv_ann_errd_ej_et(self) -> None:
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        colonnes = colonnes_à_lire_ann_errd_ej_et
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_errd_ej_et_helios)

        # WHEN
        données = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        print(données.columns)
        pd.testing.assert_frame_equal(
            données,
            pd.DataFrame(
                {
                    "Finess": ["010003598", "010003598", "010003598", "010786259", "010786259", "111111111",
                               "010789717"],
                    "Année": [2018, 2019, 2020, 2018, 2018, 2020, 2019],
                    "Taux d'occupation des places autorisées en hébergement permanent": [
                        0.99779299847793,
                        0.9324506094997898,
                        0.9902397260273972,
                        0.9953224189776144,
                        0.3,
                        0.847100319908129,
                        NaN,
                    ],
                    "Taux d'occupation des lits autorisés en hébergement temporaire": [
                        0.936986301369863,
                        0.2513661202185792,
                        0.758904109589041,
                        1.0972602739726027,
                        0.9,
                        0.1397260273972602,
                        0.8136986301369862,
                    ],
                    "Taux d'occupation des lits autorisés en accueil de jour": [
                        0.4801282051282051,
                        0.3615384615384615,
                        0.3397435897435897,
                        0.8486301369863014,
                        1.2,
                        0.181060606060606,
                        NaN,
                    ],
                }
            ),
        )

    def test_lis_les_colonnes_demandées_du_fichier_csv_ann_ms_tdp(self) -> None:
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        colonnes = colonnes_à_lire_ann_ms_tdp_et
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ms_tdp_et_helios)

        # WHEN
        données = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        pd.testing.assert_frame_equal(
            données,
            pd.DataFrame(
                {
                    "Finess": ["010001261", "010001261", "010003598", "010003598", "111111111"],
                    "Année": [2019, 2018, 2019, 2018, 2019],
                    "Durée moyenne de séjour/d'accompagnement": [5729.5, 6008.33, 2226.21, 2359.81, 0.0],
                    "Taux de réalisation de lactivité Tout ESMS (Hors services CAMSP et CMPP)": [1.052, 1.0458, 1.0182,
                                                                                                  0.8993, 0.7772],
                    "Taux de réalisation de lactivité CAMSP et CMPP": [NaN, NaN, NaN, NaN, NaN],
                    "Nombre moyen de journées d'absence des personnes accompagnées sur la période": [31.41, 32.11,
                                                                                                     18.52, 17.86, NaN],
                    "File active des personnes accompagnées sur la période": [59.0, 55.0, 119.0, 121.0, 101.0],
                }
            ),
        )

    def test_lis_les_colonnes_demandées_du_fichier_csv_men_pmsi_annuel(self) -> None:
        # GIVEN
        chemin_du_fichier = "data_set/diamant/MEN_PMSI_ANNUEL_2022_06_07.CSV"
        colonnes = colonnes_à_lire_men_pmsi_annuel
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_pmsi_annuel_helios)

        # WHEN
        men_pmsi_annuel_reçu = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        men_pmsi_annuel_attendu = pd.DataFrame(
            {'Finess': ['010005239', '010005239', '010005239', '010005239', '111111111', '010786259'],
             'Année': [2017, 2018, 2019, 2019, 2017, 2017],
             'Nombre de séjours HTP/AMBU Médecine': [1.0, 3.0, 4.0, 4.0, 14.0, NaN],
             'Nombre de séjours HTP/AMBU Obstétrique': [10.0, NaN, NaN, NaN, NaN, NaN],
             'Nombre de séjours HTP/AMBU Chirurgie': [20.0, NaN, NaN, NaN, NaN, NaN],
             'Nombre de séjours HC Médecine': [255.0, 232.0, 231.0, 231.0, 2.0, NaN],
             'Nombre de séjours HC Chirurgie': [6.0, 10.0, 9.0, 9.0, 8.0, NaN],
             'Nombre de séjours HC Obstétrique': [10.0, NaN, NaN, NaN, NaN, NaN],
             'Nombre de journées hospit complète SSR': [1074.0, 1103.0, 1087.0, NaN, NaN, NaN],
             'Nombre de journées HTP SSR': [100.0, NaN, NaN, NaN, NaN, NaN],
             'Nb journées hospit complète PSY': [200.0, NaN, NaN, NaN, NaN, NaN],
             'Nb journées HTP PSY': [300.0, NaN, NaN, NaN, NaN, NaN]}
        )
        pd.testing.assert_frame_equal(
            men_pmsi_annuel_reçu,
            men_pmsi_annuel_attendu,
        )

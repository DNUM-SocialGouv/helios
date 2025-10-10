import pandas as pd
from numpy import NaN

from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.test_helpers.config_path import get_absolute_file_path
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_à_lire_ann_ms_tdp_et,
    colonnes_à_lire_ann_ms_tdp_et_cpom,
    colonnes_à_lire_ann_rpu,
    colonnes_à_lire_ann_sae,
    colonnes_à_lire_bloc_activités_ann_errd_ej_et,
    colonnes_à_lire_bloc_ressources_humaines_ann_ca_ej_et,
    colonnes_à_lire_bloc_ressources_humaines_ann_errd_ej_et,
    colonnes_à_lire_bloc_ressources_humaines_ann_ms_tdp_et,
    colonnes_à_lire_men_pmsi_annuel,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_ann_ca_ej_et_ressources_humaines_helios,
    équivalences_diamant_ann_errd_ej_et_bloc_activités_helios,
    équivalences_diamant_ann_errd_ej_et_ressources_humaines_helios,
    équivalences_diamant_ann_ms_tdp_et_cpom_helios,
    équivalences_diamant_ann_ms_tdp_et_helios,
    équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios,
    équivalences_diamant_ann_rpu_helios,
    équivalences_diamant_ann_sae_helios,
    équivalences_diamant_men_pmsi_annuel_helios,
    colonnes_a_lire_bloc_budget_finance_entite_juridique,
    équivalences_diamant_quo_san_finance_buget_finance_helios,
)
from datacrawler.test_helpers import CHEMIN_FICHIER_ANN_MS_TDP_ET, CHEMIN_FICHIER_ANN_ERRD_EJ_ET


class TestLisLeFichierCsv:
    def test_lis_les_colonnes_demandees_du_fichier_csv_ann_errd_ej_et(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path(CHEMIN_FICHIER_ANN_ERRD_EJ_ET)
        colonnes = colonnes_à_lire_bloc_activités_ann_errd_ej_et
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_errd_ej_et_bloc_activités_helios)

        # WHEN
        donnees = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        pd.testing.assert_frame_equal(
            donnees,
            pd.DataFrame(
                {
                    "Finess": ["010003598", "010003598", "010003598", "010003598", "010786259", "010786259", "111111111", "010789717"],
                    "Année": [2018, 2019, 2020, 2021, 2018, 2018, 2020, 2019],
                    "Taux d'occupation des places autorisées en hébergement permanent": [
                        0.99779299847793,
                        0.9324506094997898,
                        0.9902397260273972,
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
                        0.3397435897435897,
                        0.8486301369863014,
                        1.2,
                        0.181060606060606,
                        NaN,
                    ],
                    "Taux d'occupation Externat Autres ESMS": [
                        1.000817111271329,
                        1.000817111271329,
                        0.926075462629176,
                        0.926075462629176,
                        0.738503688092729,
                        0.738503688092729,
                        NaN,
                        NaN,
                    ],
                    "Taux d'occupation Semi-internat Autres ESMS": [
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                    ],
                    "Taux d'occupation Internat Autres ESMS": [
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                    ],
                    "Taux d'occupation Autre 1, 2 et 3 Autres ESMS": [
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                        NaN,
                    ],
                }
            ),
        )

    def test_lis_les_colonnes_demandees_du_fichier_csv_ann_ms_tdp(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path(CHEMIN_FICHIER_ANN_MS_TDP_ET)
        colonnes = colonnes_à_lire_ann_ms_tdp_et
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ms_tdp_et_helios)

        # WHEN
        donnees = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        pd.testing.assert_frame_equal(
            donnees,
            pd.DataFrame(
                {
                    "Finess": ["010001261", "010001261", "010003598", "010003598", "010003598", "010003598", "111111111"],
                    "Année": [2019, 2018, 2021, 2020, 2019, 2018, 2019],
                    "Durée moyenne de séjour/d'accompagnement": [5729.5, 6008.33, 2351.81, 2352.81, 2226.21, 2359.81, 0.0],
                    "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": [1.052, 1.0458, 0.8993, 0.8993, 1.0182, 0.8993, 0.7772],
                    "Taux de réalisation de l’activité CAMSP et CMPP": [NaN, NaN, NaN, NaN, NaN, NaN, NaN],
                    "Nombre moyen de journées d'absence des personnes accompagnées sur la période": [31.41, 32.11, 17.86, 17.86, 18.52, 17.86, NaN],
                    "File active des personnes accompagnées sur la période": [59.0, 55.0, 121.0, 121.0, 119.0, 121.0, 101.0],
                }
            ),
        )

    def test_lis_les_colonnes_demandees_du_fichier_csv_men_pmsi_annuel(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path("data_test/entrée/diamant/MEN_PMSI_ANNUEL_2022_06_07.CSV")
        colonnes = colonnes_à_lire_men_pmsi_annuel
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_men_pmsi_annuel_helios)

        # WHEN
        men_pmsi_annuel_recu = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        men_pmsi_annuel_attendu = pd.DataFrame(
            {
                "Finess": ["010005239", "010005239", "010005239", "010005239", "010005239", "010005239", "111111111", "010786259", "010005239", "010786259"],
                "Année": [2016, 2017, 2018, 2019, 2019, 2021, 2017, 2017, 2020, 2020],
                "Nombre de séjours HTP/AMBU Médecine": [4.0, 1.0, 3.0, 4.0, 4.0, 4.0, 14.0, NaN, 4.0, 1.0],
                "Nombre de séjours HTP/AMBU Obstétrique": [NaN, 10.0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
                "Nombre de séjours HTP/AMBU Chirurgie": [NaN, 20.0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 20],
                "Nombre de séjours HC Médecine": [231.0, 255.0, 232.0, 231.0, 231.0, 231.0, 2.0, NaN, 231.0, 255.0],
                "Nombre de séjours HC Chirurgie": [9.0, 6.0, 10.0, 9.0, 9.0, 9.0, 8.0, NaN, 9.0, 6.0],
                "Nombre de séjours HC Obstétrique": [NaN, 10.0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 10.0],
                "Nombre de journées hospit complète SSR": [NaN, 1074.0, 1103.0, 1087.0, NaN, NaN, NaN, NaN, NaN, 1074.0],
                "Nombre de journées HTP SSR": [NaN, 100.0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 100],
                "Nombre total de séjours HAD": [NaN, 1674.0, 1103.0, 1087.0, NaN, NaN, NaN, NaN, NaN, 1674.0],
                "Nb journées hospit complète PSY": [NaN, 200.0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
                "Nb journées HTP PSY": [NaN, 300.0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 300],
                "DMS MCO Médecine": [1, 4, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
                "DMS MCO Chirurgie": [2, 5, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
                "DMS MCO Obstétrique": [3, 6, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
            }
        )
        pd.testing.assert_frame_equal(
            men_pmsi_annuel_recu,
            men_pmsi_annuel_attendu,
        )

    def test_lis_les_colonnes_demandees_du_fichier_csv_ann_rpu(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path("data_test/entrée/diamant/ANN_RPU_2022_06_23.CSV")
        colonnes = colonnes_à_lire_ann_rpu
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_rpu_helios)

        # WHEN
        ann_rpu_recu = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        ann_rpu_attendu = pd.DataFrame(
            {
                "Finess": ["010005239", "010005239", "010005239", "010005239", "010005239", "010005239", "010005239", "2A0000154", "010786259"],
                "Année": [2021, 2020, 2019, 2018, 2018, 2017, 2016, 2017, 2020],
                "Nombre de passages aux urgences": [25987.0, 23087.0, 23987.0, 24032.0, 42792.0, 10296.0, 10200.0, 10296.0, 10000],
            }
        )
        pd.testing.assert_frame_equal(
            ann_rpu_recu,
            ann_rpu_attendu,
        )

    def test_lis_les_colonnes_demandees_du_fichier_ann_sae(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path("data_test/entrée/diamant/ANN_SAE_2022_08_03.CSV")
        colonnes = colonnes_à_lire_ann_sae
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_sae_helios)

        # WHEN
        ann_sae_recu = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        ann_sae_attendu = pd.DataFrame(
            {
                "Finess": ["010005239", "010005239", "010005239", "010005239", "010005239", "2A0000154", "2A0000154", "2A0000154", "2A0000154", "2A0000154"],
                "Année": [2020, 2019, 2018, 2017, 2016, 2020, 2019, 2018, 2017, 2016],
                "Nombre de places de chirurgie": [7.0, 7, 7, 7, 7, 6, 6, 6, 6, 6],
                "Nombre de places d'obstétrique": [1.0, 1, 1, 1, 1, NaN, NaN, NaN, NaN, NaN],
                "Nombre de places de médecine": [7.0, 7, 7, 7, 7, 2, 2, 2, 2, 2],
                "Nombre de places de SSR": [
                    3.0,
                    3,
                    3,
                    3,
                    3,
                    NaN,
                    NaN,
                    NaN,
                    NaN,
                    NaN,
                ],
                "Nombre de lits de chirurgie": [26.0, 21, 26, 26, 26, 12, 30, 30, 30, 30],
                "Nombre de lits d'obstétrique": [20.0, 21, 21, 21, 21, 8, 8, 8, 8, 8],
                "Nombre de lits de médecine": [62.0, 60, 60, 68, 76, 20, 20, 20, 20, 20],
                "Nombre de lits de SSR": [30.0, 30, 30, 30, 30, NaN, NaN, NaN, NaN, NaN],
                "Nombre de lits USLD": [15.0, 15, 15, 15, 15, 10, 10, 10, 10, 10],
                "Nb de lits et places PSY PeC temps complet": [NaN, NaN, NaN, NaN, NaN, 5, 5, 5, 5, 5],
                "Nb de places PSY PeC temps partiel hors ambu": [NaN, NaN, NaN, NaN, NaN, 13, 13, 13, 13, 13],
            }
        )
        pd.testing.assert_frame_equal(
            ann_sae_recu,
            ann_sae_attendu,
        )

    def test_lis_les_dates_d_entree_en_vigueur_des_cpom_du_fichier_csv_ann_ms_tdp_et(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path("data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV")
        colonnes = colonnes_à_lire_ann_ms_tdp_et_cpom
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ms_tdp_et_cpom_helios)

        # WHEN
        donnees = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        pd.testing.assert_frame_equal(
            donnees,
            pd.DataFrame(
                {
                    "Finess": ["010001261", "010001261", "010003598", "010003598", "010003598", "010003598", "111111111"],
                    "Année": [2019, 2018, 2021, 2020, 2019, 2018, 2019],
                    "Date d'entrée en vigueur du CPOM": [NaN, NaN, "21/03/2012", "21/03/2012", "21/03/2012", NaN, "01/01/2015"],
                }
            ),
        )

    def test_lis_les_colonnes_du_bloc_ressources_humaines_du_fichier_ann_ms_tsp_et(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path("data_test/entrée/diamant/ANN_MS_TDP_ET_2022_06_07.CSV")
        colonnes = colonnes_à_lire_bloc_ressources_humaines_ann_ms_tdp_et
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_errd_ej_et_ressources_humaines_helios)

        # WHEN
        donnees_des_ressources_humaines_recues = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        donnees_des_ressources_humaines_attendues = pd.DataFrame(
            {
                "Finess": ["010001261", "010001261", "010003598", "010003598", "010003598", "010003598", "111111111"],
                "Année": [2019, 2018, 2021, 2020, 2019, 2018, 2019],
                "Nombre de CDD de remplacement": [2.0, 19.0, 5.0, 5.0, 5.0, 5.0, NaN],
                "Taux d'ETP vacants au 31/12": [
                    0.1197,
                    0.0483,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0404,
                ],
                "Taux de prestations externes sur les prestations directes": [
                    0.0232,
                    NaN,
                    0.0164,
                    0.0164,
                    0.0082,
                    0.0164,
                    0.0527,
                ],
                "Taux de rotation du personnel sur effectifs réels": [
                    0.1923,
                    0.1429,
                    0.0352,
                    0.0352,
                    0.0141,
                    0.0352,
                    0.0797,
                ],
                "Taux d'absentéisme pour maladie ordinaire/courte durée": [
                    0.0028,
                    0.0021,
                    0.0083,
                    0.0083,
                    0.0125,
                    0.0083,
                    NaN,
                ],
                "Taux d'absentéisme pour maladie moyenne durée": [
                    0.0465,
                    0.0717,
                    0.0166,
                    0.0166,
                    0.0149,
                    0.0166,
                    NaN,
                ],
                "Taux d'absentéisme pour maladie longue durée": [
                    0.0,
                    0.1194,
                    0.0089,
                    0.0089,
                    0.0319,
                    0.0089,
                    NaN,
                ],
                "Taux d'absentéisme pour maternité/paternité": [
                    0.0,
                    0.0,
                    0.0128,
                    0.0128,
                    0.0005,
                    0.0128,
                    NaN,
                ],
                "Taux d'absentéisme pour accident du travail / maladie professionnelle": [
                    0.0008,
                    0.0246,
                    0.0085,
                    0.0085,
                    0.0088,
                    0.0085,
                    NaN,
                ],
                "Taux d'absentéisme pour congés spéciaux dont sans solde": [
                    0.0109,
                    0.0,
                    0.0004,
                    0.0004,
                    0.0,
                    0.0004,
                    NaN,
                ],
                "Taux d'absentéisme (hors formation)": [
                    0.0609,
                    0.2179,
                    0.0554,
                    0.0554,
                    0.0685,
                    0.0554,
                    NaN,
                ],
            }
        )
        pd.testing.assert_frame_equal(
            donnees_des_ressources_humaines_recues,
            donnees_des_ressources_humaines_attendues,
        )

    def test_lis_les_colonnes_du_bloc_ressources_humaines_du_fichier_ann_ca_ej_et(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path("data_test/entrée/diamant/ANN_CA_EJ_ET_2022_09_01.CSV")
        colonnes = colonnes_à_lire_bloc_ressources_humaines_ann_ca_ej_et
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ca_ej_et_ressources_humaines_helios)

        # WHEN
        donnees_des_ressources_humaines_recues = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        donnees_des_ressources_humaines_attendues = pd.DataFrame(
            {
                "Finess": ["010003598", "010002269", "010002269", "010009066", "010009066"],
                "Année": [2021, 2019, 2018, 2020, 2019],
                "Nombre ETP total réalisé CA": [
                    9.2200000000000006,
                    9.7100000000000009,
                    10.34,
                    3.9000000000000004,
                    3.9000000000000004,
                ],
            }
        )
        pd.testing.assert_frame_equal(
            donnees_des_ressources_humaines_recues,
            donnees_des_ressources_humaines_attendues,
        )

    def test_lis_les_colonnes_du_bloc_ressources_humaines_du_fichier_ann_errd_ej_et(self) -> None:
        # GIVEN
        chemin_du_fichier = get_absolute_file_path("data_test/entrée/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV")
        colonnes = colonnes_à_lire_bloc_ressources_humaines_ann_errd_ej_et
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios)

        # WHEN
        donnees_des_ressources_humaines_recues = lis_le_fichier_csv(chemin_du_fichier, colonnes, types_des_colonnes)

        # THEN
        donnees_des_ressources_humaines_attendues = pd.DataFrame(
            {
                "Finess": ["010003598", "010003598", "010003598", "010003598", "010786259", "010786259", "111111111", "010789717"],
                "Année": [2018, 2019, 2020, 2021, 2018, 2018, 2020, 2019],
                "Nombre ETP total réalisé ERRD": [
                    4.5499999999999998,
                    17.190000000000001,
                    50.649999999999991,
                    188.49999999999997,
                    55.249999999999993,
                    142.06,
                    NaN,
                    NaN,
                ],
            }
        )
        pd.testing.assert_frame_equal(
            donnees_des_ressources_humaines_recues,
            donnees_des_ressources_humaines_attendues,
        )

    def test_lis_les_colonnes_demandees_du_fichier_csv_quo_san_finance(self) -> None:
        # GIVEN
        file_path = get_absolute_file_path("data_test/entrée/diamant/QUO_SAN_FINANCE_2023_01_20.CSV")
        colonnes = colonnes_a_lire_bloc_budget_finance_entite_juridique
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_quo_san_finance_buget_finance_helios)

        # WHEN
        donnees_des_quo_san_finance_recues = lis_le_fichier_csv(file_path, colonnes, types_des_colonnes)

        # THEN
        donnees_des_quo_san_finance_attendues = pd.DataFrame(
            {
                "Finess EJ": ["010008407", "010008407", "010008407", "010008407", "010008407"],
                "Finess ET": ["350039574", "010003598", "010005239", NaN, NaN],
                "Année": [2022, 2021, 2020, 2019, 2017],
                "Dépenses Titre I Budget global": [-38315470.489920005, -8855071.9100400023, -39714875.189880006, -6388587.3598799994, -5932308.5200800011],
                "Dépenses Titre II Budget global": [-7262125.2101999987, -1702097.3504400002, -9714938.7098399997, -759828.06984000001, -406173.92999999999],
                "Dépenses Titre III Budget global": [-6790615.4500799999, -2962020.9200400007, -8957482.4900400005, -3129326.580240001, -986091.39984000043],
                "Dépenses Titre IV Budget global": [-4168425.8000400001, -1049973.68988, -5257981.4698800007, -384180.90995999996, -509295.81],
                "Recettes Titre I Budget global": [39297655.289999999, 6782078.2599600004, 39941246.860080004, 5222760.6999600008, 5791403.0000400012],
                "Recettes Titre II Budget global": [4285276.0098000001, 1365243.9400800001, 7469151.2101200018, 855732.74004000006, 687793.28003999987],
                "Recettes Titre III Budget global": [11830378.95984, 5859482.2400399987, 15572406.209999997, 4011375.4700399996, 1235483.1899999999],
                "Recettes Titre IV Budget global": [1147590.1700400002, 312202.34003999998, 175225.28976000001, 218494.86995999998, 0],
                "Dépenses Titre I Budget H": [-30646439.360160001, -2048552.5303200001, -32983079.770080004, -2897982.9500399996, -5932308.5200800011],
                "Dépenses Titre II Budget H": [-6752879.9099999983, -363095.84015999996, -9397192.7499599997, -242136.75, -406173.92999999999],
                "Dépenses Titre III Budget H": [-4136149.9500000002, -1091266.33008, -5860999.4600399993, -888301.09020000021, -986091.39984000043],
                "Dépenses Titre IV Budget H": [-2960018.25, -306963.91992000001, -4707133.2999600004, -349849.98995999998, -509295.81],
                "Recettes Titre I Budget H": [33641669.91996, 1500318.9999600004, 35412455.59008, 1927353.7299600004, 5791403.0000400012],
                "Recettes Titre II Budget H": [2968985.1598800002, 165723.65999999997, 5760820.9600800015, 164517.59999999998, 687793.28003999987],
                "Recettes Titre III Budget H": [7910023.6198800011, 2042000.8801200003, 11185621.609919997, 2322363.7799999998, 1235483.1899999999],
                "SAN Résultat net comptable": [24315.749399994413, -247544.77019999945, -487130.65967999981, -330217.60992000037, -119190.18984000012],
                "SAN Taux de CAF nette": [2.1120000000000003e-2, -9.2399999999999982e-3, 0.00396, -5.7600000000000012e-3, 4.4400000000000004e-3],
                "Ratio de dépendance financière": [0.44184000000000007, 0.34164, 0.72671999999999981, 0, 0.17579999999999998],
            }
        )

        pd.testing.assert_frame_equal(
            donnees_des_quo_san_finance_recues,
            donnees_des_quo_san_finance_attendues,
        )

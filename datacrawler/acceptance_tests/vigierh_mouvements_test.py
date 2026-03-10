from numpy import nan
from freezegun import freeze_time

import pandas as pd
from datacrawler.import_vigie_rh_mouvements_trimestriels import import_donnees_mouvements_rh_trimestriels
from datacrawler.load.nom_des_tables import TABLE_VIGIE_RH_MOUVEMENTS_RH, TABLE_VIGIE_RH_MOUVEMENTS_RH_TRIMESTRIELS
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    supprime_les_données_des_tables,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_entité_juridique_en_base,
)
from datacrawler.import_vigie_rh_mouvements import import_donnees_mouvements_rh

NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "470001702"

class TestImportVigieRhMouvements:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)


    def test_import_vigie_rh_mouvements(self) -> None:
        chemin_local_du_fichier_mouvements = 'data_test/entrée/vigie_rh/vigierh_etablissement_annuel_2025_10_30.parquet'
        import_donnees_mouvements_rh(chemin_local_du_fichier_mouvements, base_de_données_test, mocked_logger )

        mouvements_enregistres = pd.read_sql(TABLE_VIGIE_RH_MOUVEMENTS_RH, base_de_données_test)
        mouvements_attendus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": ["470001702", "470001702"],
                "annee": [2023, 2024],
                "nouveaux_contrats": [10, 3],
                "nouveaux_contrats_ref": [18, 18],
                "fins_contrats": [6, 6],
                "fins_contrats_ref": [15, 16],
                "taux_rotation": [0.21621621621621623, 0.125],
                "taux_rotation_ref": [0.23779819710663033, 0.23906828005469072],
                "departs_prematures_cdi": [8, 7],
            }
        )
        pd.testing.assert_frame_equal(mouvements_enregistres.sort_index(axis=1), mouvements_attendus.sort_index(axis=1))
    @freeze_time("2025-09-09")
    def test_import_vigie_rh_mouvements_trimestriels(self) -> None:
        chemin_local_du_fichier_mouvements = 'data_test/entrée/vigie_rh/vigierh_etablissement_trimestriel_2025_09_09.parquet'
        import_donnees_mouvements_rh_trimestriels(chemin_local_du_fichier_mouvements, base_de_données_test, mocked_logger )
        mouvements_enregistres = pd.read_sql(TABLE_VIGIE_RH_MOUVEMENTS_RH_TRIMESTRIELS, base_de_données_test)
        mouvements_attendus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": ["470001702", 
                                                            "470001702", 
                                                            "470001702",
                                                            "470001702",
                                                            "470001702",
                                                            "470001702", 
                                                            "470001702",
                                                            "470001702",
                                                            "470001702",
                                                            "470001702", 
                                                            "470001702",
                                                            "470001702"],
                "annee": [2023, 2023, 2023, 2023, 2024, 2024, 2024, 2024, 2025, 2025, 2025, 2025],
                "trimestre": [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
                "nouveaux_contrats": [3, 2, 1, 3, 1, 2, 3, 4, 5, 4, 7, nan],
                "nouveaux_contrats_ref": [7,7, 8, 7, 8, 7,8, 8, 7, 7, 7, nan],
                "fins_contrats": [2,1, 0,2,1,2,0, 1,3, 2, 3,  nan],
                "fins_contrats_ref": [5,6, 5, 5, 5, 6, 5, 5, 5, 7, 5, nan],
                "taux_rotation": [0.06578947368421052, 
                                  0.04285714285714286,
                                  0.014285714285714285,
                                  0.06756756756756757,
                                  0.02702702702702703,
                                  0.05405405405405406,
                                  0.04285714285714286,
                                  0.07142857142857142,
                                  0.10810810810810811,
                                  0.08571428571428572,
                                  0.13513513513513514,
                                  nan],
                "taux_rotation_ref": [0.08548067003416823,
                                      0.09569511496691935,
                                      0.09191264198162609,
                                      0.09374879097201824,
                                      0.08982652744713017,
                                      0.09261338996088486,
                                      0.08988518242335894,
                                      0.09797036157094868,
                                      0.0872562824225277,
                                      0.09824909285514648,
                                      0.08661166599514693,
                                      nan]
            }
        )

        pd.testing.assert_frame_equal(mouvements_enregistres.sort_index(axis=1), mouvements_attendus.sort_index(axis=1))

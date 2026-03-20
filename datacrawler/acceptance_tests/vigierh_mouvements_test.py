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
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010006799"

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
                "numero_finess_etablissement_territorial": ["010006799", "010006799"],
                "annee": [2023, 2024],
                "nouveaux_contrats": [24, 19],
                "nouveaux_contrats_ref": [18, 18],
                "fins_contrats": [17, 24],
                "fins_contrats_ref": [15, 16],
                "taux_rotation": [0.21808510638297873, 0.22395833333333334],
                "taux_rotation_ref": [0.23779819710663033, 0.23906828005469072],
                "departs_prematures_cdi": [15, 9],
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
                "numero_finess_etablissement_territorial": ["010006799", 
                                                            "010006799", 
                                                            "010006799",
                                                            "010006799",
                                                            "010006799",
                                                            "010006799", 
                                                            "010006799",
                                                            "010006799",
                                                            "010006799",
                                                            "010006799", 
                                                            "010006799",
                                                            "010006799"],
                "annee": [2023, 2023, 2023, 2023, 2024, 2024, 2024, 2024, 2025, 2025, 2025, 2025],
                "trimestre": [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
                "nouveaux_contrats": [4, 2, 3, 7, 5, 6, 7, 5, 8, 7, 6, nan],
                "nouveaux_contrats_ref": [4,4, 4, 4, 5, 4,4, 4, 4, 4, 4, nan],
                "fins_contrats": [3,7, 5,5,5,3,3, 6,4, 8, 2,  nan],
                "fins_contrats_ref": [3,4, 3, 3, 3, 4, 3, 3, 3, 4, 3, nan],
                "taux_rotation": [0.0660377358490566,
                                    0.08333333333333333,
                                    0.08, 0.11538461538461539,
                                    0.09615384615384616, 
                                    0.08490566037735849, 
                                    0.08771929824561403,
                                    0.09821428571428571, 
                                    0.10526315789473684, 
                                    0.1271186440677966, 
                                    0.07142857142857142, 
                                    nan],
                "taux_rotation_ref": [0.09126998217898374,
                                    0.09561785237259132,
                                    0.08988306838054962,
                                    0.09549675214494868, 
                                    0.09754089964230647, 
                                    0.0978391031263635,
                                    0.091508191458823,
                                    0.09934672096321481, 
                                    0.09584577559539656,
                                    0.10413678532069742, 
                                    0.09241925193148197, 
                                    nan]
            }
        )

        pd.testing.assert_frame_equal(mouvements_enregistres.sort_index(axis=1), mouvements_attendus.sort_index(axis=1))

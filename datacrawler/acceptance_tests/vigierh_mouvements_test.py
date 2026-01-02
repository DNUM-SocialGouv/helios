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
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010002228"

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
                "numero_finess_etablissement_territorial": ["010002228", "010002228"],
                "annee": [2024, 2025],
                "nouveaux_contrats": [751, 597],
                "nouveaux_contrats_ref": [738, 587],
                "fins_contrats": [744, 563],
                "fins_contrats_ref": [746, 593],
                "taux_rotation": [1.7444574095682615, 1.2917594654788418],
                "taux_rotation_ref": [1.6117762806016536, 1.1935099448582995],
                "departs_prematures_cdi": [7, 6],
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
                "numero_finess_etablissement_territorial": ["010002228", 
                                                            "010002228", 
                                                            "010002228",
                                                            "010002228",
                                                            "010002228",
                                                            "010002228", 
                                                            "010002228",
                                                            "010002228",
                                                            "010002228",
                                                            "010002228", 
                                                            "010002228"],
                "annee": [2023, 2023, 2023, 2023, 2024, 2024, 2024, 2024, 2025, 2025, 2025],
                "trimestre": [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3],
                "nouveaux_contrats": [198, 187, 196, 202, 194, 191, 184, 182, 195, 208, 194],
                "nouveaux_contrats_ref": [196,185, 194, 200, 192, 189,182, 180, 193, 206, 192],
                "fins_contrats": [195,181, 181,173, 187, 188,  192, 177, 181, 196, 186],
                "fins_contrats_ref": [201,190, 199, 205, 197, 194, 186, 184, 198, 211, 197],
                "taux_rotation": [0.5261044176706827, 
                                  0.48677248677248675,
                                  0.4851994851994852,
                                  0.45676004872107184,
                                  0.44457409568261375,
                                  0.4371395617070358,
                                  0.4361948955916473,
                                  0.4179278230500582,
                                  0.428246013667426,
                                  0.4469026548672566,
                                  0.41125541125541126],
                "taux_rotation_ref": [0.5002667365492268,
                                      0.4628664485992846,
                                      0.46137069920604373,
                                      0.43432796092350656,
                                      0.4227404760943875,
                                      0.4156710618777313,
                                      0.4147727895599158,
                                      0.3974028370186524,
                                      0.407214287700054,
                                      0.42495467666947595,
                                      0.39105811615848657]
            }
        )

        pd.testing.assert_frame_equal(mouvements_enregistres.sort_index(axis=1), mouvements_attendus.sort_index(axis=1))

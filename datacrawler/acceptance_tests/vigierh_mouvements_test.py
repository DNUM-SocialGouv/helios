import pandas as pd
from datacrawler.load.nom_des_tables import TABLE_VIGIE_RH_MOUVEMENTS_RH
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
        chemin_local_du_fichier_mouvements = 'data_test/entrée/vigie_rh/vigierh_etablissement_annuel_2025_09_09.parquet'
        import_donnees_mouvements_rh(chemin_local_du_fichier_mouvements, base_de_données_test, mocked_logger )

        mouvements_enregistres = pd.read_sql(TABLE_VIGIE_RH_MOUVEMENTS_RH, base_de_données_test)
        mouvements_attendus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": ["010002228", "010002228", "010002228"],
                "annee": [2023, 2024, 2025],
                "nouveaux_contrats": [783, 751, 597],
                "nouveaux_contrats_ref": [788, 756, 601],
                "fins_contrats": [730, 744, 563],
                "fins_contrats_ref": [769, 738, 586],
                "taux_rotation": [1.8983688833124215, 1.7444574095682615, 1.2917594654788418],
                "taux_rotation_ref": [1.935941893600912, 1.7789841639697426, 1.3173263045233183],
            }
        )

        pd.testing.assert_frame_equal(mouvements_enregistres.sort_index(axis=1), mouvements_attendus.sort_index(axis=1))

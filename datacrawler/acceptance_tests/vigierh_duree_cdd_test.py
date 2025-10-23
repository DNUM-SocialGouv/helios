import pandas as pd
from datacrawler.import_vigierh_duree_cdd import import_donnees_duree_cdd
from datacrawler.load.nom_des_tables import TABLE_VIGIE_RH_DUREE_CDD
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    supprime_les_données_des_tables,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_entité_juridique_en_base,
)

NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010002228"

class TestImportVigieRhMouvements:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)


    def test_import_vigie_rh_duree_cdd(self) -> None:
        chemin_local_du_fichier_duree_cdd = 'data_test/entrée/vigie_rh/vigierh_duree_cdd_2025_10_03.parquet'
        chemin_local_du_fichier_ref_duree_cdd = 'data_test/entrée/vigie_rh/vigierh_ref_duree_cdd_2025_10_03.parquet'
        import_donnees_duree_cdd(chemin_local_du_fichier_ref_duree_cdd, chemin_local_du_fichier_duree_cdd, base_de_données_test, mocked_logger )

        duree_cdd_enregistrees = pd.read_sql(TABLE_VIGIE_RH_DUREE_CDD, base_de_données_test)
        assert duree_cdd_enregistrees.shape[0] == 84

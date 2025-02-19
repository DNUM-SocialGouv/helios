import pandas as pd

from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.transform.equivalence_vigierh_helios import ColumMapping

class TestLisLeFichierParquet:
    def test_lis_le_fichier_ref_masque_parquet(self) -> None:
        # GIVEN
        chemin_du_fichier = "data_test/entrée/vigie_rh/vigierh_ref_tarnche_age.parquet"

        # WHEN
        donnees = lis_le_fichier_parquet(chemin_du_fichier, ColumMapping.REF_TRANCHE_AGE.value)

        # THEN
        pd.testing.assert_frame_equal(
            donnees,
            pd.DataFrame(
                {
                    "code_tranche_age":[1,2,3,4,5,6,7,8,9,10,11],
                    "tranche_age": ['15_20','20_25','25_30','30_35','15_20','35_40','40_45','45_50','50_55','55_60','60_65', '65_plus']
                }
            ))

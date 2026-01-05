from freezegun import freeze_time
import numpy as np
import pandas as pd

from datacrawler.import_vigierh_cdd_cdi import filtrer_les_donnees_cdi_cdd, import_donnees_cdi_cdd

from datacrawler.load.nom_des_tables import (
    TABLE_VIGIE_RH_NATURE_CONTRATS ,
)
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    supprime_les_données_des_tables,
    sauvegarde_une_entité_juridique_en_base,
    sauvegarde_un_établissement_en_base,
)


NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010002228"
NUMÉRO_FINESS_ÉTABLISSEMENT_2 = "470001702"


class TestImportVigierhNatureContrats:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(
            NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test
        )
        sauvegarde_un_établissement_en_base(
            NUMÉRO_FINESS_ÉTABLISSEMENT_2, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test
        )
        mocked_logger.reset_mock()

    @freeze_time("2025-10-17")
    def test_import_vigie_rh_duree_cdd(self) -> None:
        chemin_local_du_fichier_cdi_cdd = 'data_test/entrée/vigie_rh/vigierh_nature_contrats_annuel_2025_10_17.parquet'
        chemin_local_du_fichier_ref_cdi_cdd = 'data_test/entrée/vigie_rh/vigierh_ref_nature_contrat_2025_10_17.parquet'
        import_donnees_cdi_cdd(chemin_local_du_fichier_ref_cdi_cdd, chemin_local_du_fichier_cdi_cdd, base_de_données_test, mocked_logger )

        duree_cdd_enregistrees = pd.read_sql(TABLE_VIGIE_RH_NATURE_CONTRATS, base_de_données_test)
        assert duree_cdd_enregistrees.shape[0] == 12

    def test_filtrer_les_donnees_ne_conserve_que_les_lignes_valides(self) -> None:
        donnees = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_1,
                    "annee": "2024",
                    "nature_contrat_code": 1,
                    "effectif": 3,
                    "effectif_ref": 1,
                    "depart_prematures_cdi": 2,
                },
                {
                    "numero_finess_etablissement_territorial": "12345678",
                    "annee": "2024",
                    "nature_contrat_code": 3,
                    "effectif": 5,
                    "effectif_ref": 2,
                    "depart_prematures_cdi": 1,
                },
                {
                    "numero_finess_etablissement_territorial": "999999999",
                    "annee": "2024",
                    "nature_contrat_code": 4,
                    "effectif": 6,
                    "effectif_ref": 3,
                    "depart_prematures_cdi": 0,
                },
            ]
        )

        references = pd.DataFrame(
            [
                {"nature_contrat_code": 1, "nature_contrat": "CDI"},
                {"nature_contrat_code": 2, "nature_contrat": "CDD"},
            ]
        )
        codes =np.array(references['nature_contrat_code'].tolist())

        donnees_filtrees = filtrer_les_donnees_cdi_cdd(donnees, codes, base_de_données_test)

        assert donnees_filtrees.shape[0] == 1
        assert donnees_filtrees.iloc[0]["numero_finess_etablissement_territorial"] == NUMÉRO_FINESS_ÉTABLISSEMENT_1
        assert donnees_filtrees.iloc[0]["nature_contrat_code"] == 1

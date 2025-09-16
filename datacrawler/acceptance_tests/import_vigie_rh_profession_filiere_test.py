import os
import numpy as np
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import FichierSource, TABLE_PROFESSION_FILIERE, TABLE_REF_PROFESSION_FILIERE
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    supprime_les_données_des_tables,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_entité_juridique_en_base,
    compte_nombre_de_lignes
)

from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping
from datacrawler.import_vigie_rh_profession_filiere import filter_profession_filiere_data
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees

NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010002228"
NUMÉRO_FINESS_ÉTABLISSEMENT_2 = "470001702"
NUMÉRO_FINESS_ÉTABLISSEMENT_3 = "470005356"

class TestImportVigiePprofessionFiliere:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_2, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_3, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)


    def test_import_vigie_rh_profession_filiere_test(self) -> None:
        # Initialisations
        vegie_rh_data_path = 'data_test/entrée/vigie_rh'
        fichiers = os.listdir(vegie_rh_data_path)

        chemin_local_du_fichier_profession_filiere = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_PROFESSION_FILIERE.value, mocked_logger)
        )
        assert chemin_local_du_fichier_profession_filiere == 'data_test/entrée/vigie_rh/vigierh_profession1_2025_09_05.parquet'

        chemin_local_du_fichier_ref = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE.value, mocked_logger)
        )
        assert chemin_local_du_fichier_ref == 'data_test/entrée/vigie_rh/vigierh_ref_profession1_2025_09_05.parquet'

        date_de_mise_à_jour_profession_filiere = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_profession_filiere)
        assert date_de_mise_à_jour_profession_filiere == '2025-09-05'

        date_de_mise_à_jour_ref = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
        assert date_de_mise_à_jour_ref == '2025-09-05'

        # Traitements des données
        df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_PROFESSION_FILIERE.value)
        code_list_ref = np.array(df_ref['code'].tolist())

        assert df_ref.shape[0] == 4

        data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_profession_filiere, ColumMapping.PROFESSION_FILIERE.value)
        df_filtré = filter_profession_filiere_data(data_frame, code_list_ref, base_de_données_test).head(200)
        assert df_filtré.shape[0] == 200

        supprimer_donnees_existantes(TABLE_PROFESSION_FILIERE, base_de_données_test, SOURCE, mocked_logger)
        assert compte_nombre_de_lignes(TABLE_PROFESSION_FILIERE, base_de_données_test) == 0

        supprimer_donnees_existantes(TABLE_REF_PROFESSION_FILIERE, base_de_données_test, SOURCE, mocked_logger)
        assert compte_nombre_de_lignes(TABLE_REF_PROFESSION_FILIERE, base_de_données_test) == 0

        inserer_nouvelles_donnees(
            TABLE_REF_PROFESSION_FILIERE,
            base_de_données_test,
            SOURCE,
            df_ref,
            mocked_logger,
            FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE,
            date_de_mise_à_jour_ref
        )
        assert compte_nombre_de_lignes(TABLE_REF_PROFESSION_FILIERE, base_de_données_test) == 4

        inserer_nouvelles_donnees(
            TABLE_PROFESSION_FILIERE,
            base_de_données_test,
            SOURCE, df_filtré,
            mocked_logger,
            FichierSource.VIGIE_RH_PROFESSION_FILIERE,
            date_de_mise_à_jour_profession_filiere
        )
        assert compte_nombre_de_lignes(TABLE_PROFESSION_FILIERE, base_de_données_test) == 200

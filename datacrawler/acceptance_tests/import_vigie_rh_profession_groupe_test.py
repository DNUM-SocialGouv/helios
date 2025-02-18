import os
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import FichierSource
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
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, Table, ColumMapping
from datacrawler.import_vigie_rh_profession_groupe import filter_profession_groupe_data
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees

NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010001261"
NUMÉRO_FINESS_ÉTABLISSEMENT_2 = "010001436"
NUMÉRO_FINESS_ÉTABLISSEMENT_3 = "010001741"

class TestImportVigiePprofessionGroupe:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_2, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_3, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)


    def test_import_vigie_rh_profession_groupe_test(self) -> None:
        # Initialisations
        vegie_rh_data_path = 'data_test/entrée/vigie_rh'
        fichiers = os.listdir(vegie_rh_data_path)

        chemin_local_du_fichier_profession_groupe = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_PROFESSION_GROUPE.value, mocked_logger)
        )

        assert chemin_local_du_fichier_profession_groupe == 'data_test/entrée/vigie_rh/vigierh_profession2_2024_01_01.parquet'

        chemin_local_du_fichier_ref_masque = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_MASQUE.value, mocked_logger)
        )

        assert chemin_local_du_fichier_ref_masque == 'data_test/entrée/vigie_rh/vigierh_ref_masque.parquet'


        chemin_local_du_fichier_ref_profession_groupe = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value, mocked_logger)
        )

        assert chemin_local_du_fichier_ref_profession_groupe == 'data_test/entrée/vigie_rh/vigierh_ref_profession2.parquet'


        chemin_local_du_fichier_ref_qualite = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_QUALITE.value, mocked_logger)
        )

        assert chemin_local_du_fichier_ref_qualite == 'data_test/entrée/vigie_rh/vigierh_ref_qualite.parquet'


        chemin_local_du_fichier_ref_redressement = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_REDRESSEMENT.value, mocked_logger)
        )

        assert chemin_local_du_fichier_ref_redressement == 'data_test/entrée/vigie_rh/vigierh_ref_redressement.parquet'


        date_de_mise_à_jour = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_profession_groupe)

        assert date_de_mise_à_jour == '2024-01-01'


        # Traitements des données
        df_ref_masque = lis_le_fichier_parquet(chemin_local_du_fichier_ref_masque, ColumMapping.REF_MASQUE.value)

        nombre_de_lignes = df_ref_masque.shape[0]
        assert nombre_de_lignes == 1

        df_ref_profession_groupe = lis_le_fichier_parquet(chemin_local_du_fichier_ref_profession_groupe, ColumMapping.REF_PROFESSION_GROUPE.value)

        nombre_de_lignes = df_ref_profession_groupe.shape[0]
        assert nombre_de_lignes == 16

        df_ref_qualite = lis_le_fichier_parquet(chemin_local_du_fichier_ref_qualite, ColumMapping.REF_QUALITE.value)

        nombre_de_lignes = df_ref_qualite.shape[0]
        assert nombre_de_lignes == 1

        df_ref_redressement = lis_le_fichier_parquet(chemin_local_du_fichier_ref_redressement, ColumMapping.REF_REDRESSEMENT.value)

        nombre_de_lignes = df_ref_redressement.shape[0]
        assert nombre_de_lignes == 2

        data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_profession_groupe, ColumMapping.PROFESSION_GROUPE.value)
        df_filtré = filter_profession_groupe_data(data_frame, base_de_données_test)

        nombre_de_lignes = df_filtré.shape[0]
        assert nombre_de_lignes == 198




        supprimer_donnees_existantes(Table.PROFESSION_GROUPE.value, base_de_données_test, SOURCE, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.PROFESSION_GROUPE.value, base_de_données_test)
        assert nb_lignes == 0
 
        supprimer_donnees_existantes(Table.REF_MASQUE.value, base_de_données_test, SOURCE, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.REF_MASQUE.value, base_de_données_test)
        assert nb_lignes == 0

        supprimer_donnees_existantes(Table.REF_PROFESSION_GROUPE.value, base_de_données_test, SOURCE, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.REF_PROFESSION_GROUPE.value, base_de_données_test)
        assert nb_lignes == 0

        supprimer_donnees_existantes(Table.REF_QUALITE.value, base_de_données_test, SOURCE, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.REF_QUALITE.value, base_de_données_test)
        assert nb_lignes == 0

        supprimer_donnees_existantes(Table.REF_REDRESSEMENT.value, base_de_données_test, SOURCE, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.REF_REDRESSEMENT.value, base_de_données_test)
        assert nb_lignes == 0


        inserer_nouvelles_donnees(Table.REF_MASQUE.value, base_de_données_test, SOURCE, df_ref_masque, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.REF_MASQUE.value, base_de_données_test)
        assert nb_lignes == 1

        inserer_nouvelles_donnees(Table.REF_PROFESSION_GROUPE.value, base_de_données_test, SOURCE, df_ref_profession_groupe, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.REF_PROFESSION_GROUPE.value, base_de_données_test)
        assert nb_lignes == 16

        inserer_nouvelles_donnees(Table.REF_QUALITE.value, base_de_données_test, SOURCE, df_ref_qualite, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.REF_QUALITE.value, base_de_données_test)
        assert nb_lignes == 1

        inserer_nouvelles_donnees(Table.REF_REDRESSEMENT.value, base_de_données_test, SOURCE, df_ref_redressement, mocked_logger)

        nb_lignes = compte_nombre_de_lignes(Table.REF_REDRESSEMENT.value, base_de_données_test)
        assert nb_lignes == 2

        inserer_nouvelles_donnees(
            Table.PROFESSION_GROUPE.value,
            base_de_données_test,
            SOURCE,
            df_filtré,
            mocked_logger,
            FichierSource.VIGIE_RH_PROFESSION_GROUPE,
            date_de_mise_à_jour
        )
        nb_lignes = compte_nombre_de_lignes(Table.PROFESSION_GROUPE.value, base_de_données_test)
        assert nb_lignes == 198

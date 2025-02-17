# import os
# from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
# from datacrawler.load.nom_des_tables import FichierSource
# from datacrawler.test_helpers import (
#     base_de_données_test,
#     mocked_logger,
#     supprime_les_données_des_tables,
#     sauvegarde_un_établissement_en_base,
#     sauvegarde_une_entité_juridique_en_base,
#     compte_nombre_de_lignes
# )
from datacrawler.test_helpers import ( base_de_données_test, supprime_les_données_des_tables)
# from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
# from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
# from datacrawler.load.vigie_rh import SOURCE, Table, ColumMapping
# from datacrawler.import_vigie_rh_contrat import filter_contrat_data
# from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees


class TestImportVigieRhContrat:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        # sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        # sauvegarde_un_établissement_en_base("010001261", "010008407", base_de_données_test)
        # sauvegarde_un_établissement_en_base("010001436", "010008407", base_de_données_test)
        # sauvegarde_un_établissement_en_base("010001741", "010008407", base_de_données_test)


    def test_import_vigie_rh_contrat(self) -> None:
        # Initialisations
        vegie_rh_data_path = 'data_test/entrée/vigie_rh'
        # fichiers = os.listdir(vegie_rh_data_path)

        # chemin_local_du_fichier_contrat = os.path.join(
        #     vegie_rh_data_path,
        #     trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_CONTRAT.value, mocked_logger)
        # )

        # assert chemin_local_du_fichier_contrat == 'data_test/entrée/vigie_rh/vigierh_contrat_2024_01_01.parquet'

        # chemin_local_du_fichier_ref = os.path.join(
        #     vegie_rh_data_path,
        #     trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_TYPE_CONTRAT.value, mocked_logger)
        # )

        # assert chemin_local_du_fichier_ref == 'data_test/entrée/vigie_rh/vigierh_ref_nature_contrat.parquet'

        # date_de_mise_à_jour = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_contrat)

        # assert date_de_mise_à_jour == '2024-01-01'

        # # Traitements des données
        # df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_TYPE_CONTRAT.value)

        # nombre_de_lignes = df_ref.shape[0]
        # assert nombre_de_lignes == 3

        # data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_contrat, ColumMapping.CONTRAT.value)
        # df_filtré = filter_contrat_data(data_frame, base_de_données_test)

        # nombre_de_lignes1 = df_filtré.shape[0]
        # assert nombre_de_lignes1 == 190

        # supprimer_donnees_existantes(Table.CONTRAT.value, base_de_données_test, SOURCE, mocked_logger)

        # nb_lignes = compte_nombre_de_lignes(Table.CONTRAT.value, base_de_données_test)
        # assert nb_lignes == 0

        # supprimer_donnees_existantes(Table.REF_TYPE_CONTRAT.value, base_de_données_test, SOURCE, mocked_logger)

        # nb_lignes = compte_nombre_de_lignes(Table.REF_TYPE_CONTRAT.value, base_de_données_test)
        # assert nb_lignes == 0

        # inserer_nouvelles_donnees(Table.REF_TYPE_CONTRAT.value, base_de_données_test, SOURCE, df_ref, mocked_logger)

        # nb_lignes = compte_nombre_de_lignes(Table.REF_TYPE_CONTRAT.value, base_de_données_test)
        # assert nb_lignes == 3

        # inserer_nouvelles_donnees(
        #     Table.CONTRAT.value,
        #     base_de_données_test,
        #     SOURCE,
        #     df_filtré,
        #     mocked_logger,
        #     FichierSource.VIGIE_RH_CONTRAT,
        #     date_de_mise_à_jour
        # )
        # nb_lignes = compte_nombre_de_lignes(Table.CONTRAT.value, base_de_données_test)
        # assert nb_lignes == 190

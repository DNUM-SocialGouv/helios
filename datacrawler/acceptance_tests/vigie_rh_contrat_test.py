import os
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import FichierSource, TABLE_CONTRAT, TABLE_REF_TYPE_CONTRAT
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
from datacrawler.import_vigie_rh_contrat import filter_contrat_data
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees

NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010001261"
NUMÉRO_FINESS_ÉTABLISSEMENT_2 = "010001436"
NUMÉRO_FINESS_ÉTABLISSEMENT_3 = "010001741"

class TestImportVigieRhContrat:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_2, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_3, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)


    def test_import_vigie_rh_contrat(self) -> None:
        # Initialisations
        vegie_rh_data_path = 'data_test/entrée/vigie_rh'
        fichiers = os.listdir(vegie_rh_data_path)

        chemin_local_du_fichier_contrat = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_CONTRAT.value, mocked_logger)
        )
        assert chemin_local_du_fichier_contrat == 'data_test/entrée/vigie_rh/vigierh_contrat_2025_10_17.parquet'

        chemin_local_du_fichier_ref = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_TYPE_CONTRAT.value, mocked_logger)
        )
        assert chemin_local_du_fichier_ref == 'data_test/entrée/vigie_rh/vigierh_ref_nature_contrat_2025_10_17.parquet'

        date_de_mise_à_jour_contrat = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_contrat)
        assert date_de_mise_à_jour_contrat == '2025-10-17'

        date_de_mise_à_jour_ref = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
        assert date_de_mise_à_jour_ref == '2025-10-17'

        # Traitements des données
        df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_TYPE_CONTRAT.value)

        nombre_de_lignes = df_ref.shape[0]
        assert nombre_de_lignes == 2

        data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_contrat, ColumMapping.CONTRAT.value)
        df_filtré = filter_contrat_data(data_frame, base_de_données_test)
        assert df_filtré.shape[0] == 190

        supprimer_donnees_existantes(TABLE_CONTRAT, base_de_données_test, SOURCE, mocked_logger)
        assert compte_nombre_de_lignes(TABLE_CONTRAT, base_de_données_test) == 0

        supprimer_donnees_existantes(TABLE_REF_TYPE_CONTRAT, base_de_données_test, SOURCE, mocked_logger)
        assert compte_nombre_de_lignes(TABLE_REF_TYPE_CONTRAT, base_de_données_test) == 0

        inserer_nouvelles_donnees(
            TABLE_REF_TYPE_CONTRAT,
            base_de_données_test,
            SOURCE,
            df_ref,
            mocked_logger,
            FichierSource.VIGIE_RH_REF_TYPE_CONTRAT,
            date_de_mise_à_jour_ref
        )
        assert compte_nombre_de_lignes(TABLE_REF_TYPE_CONTRAT, base_de_données_test) == 2

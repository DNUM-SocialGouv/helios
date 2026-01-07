import os
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import FichierSource, TABLE_TRANCHE_AGE, TABLE_REF_TRANCHE_AGE
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
from datacrawler.import_vigierh_tranches_ages import filtrer_les_donnees_pyramide
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees

NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010002228"
NUMÉRO_FINESS_ÉTABLISSEMENT_2 = "010004059"
NUMÉRO_FINESS_ÉTABLISSEMENT_3 = "010006799"

class TestImportVigieRhPyramide:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_2, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_3, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)


    def test_import_vigie_rh_pyramide(self) -> None:
        # Initialisations
        vegie_rh_data_path = 'data_test/entrée/vigie_rh'
        fichiers = os.listdir(vegie_rh_data_path)

        chemin_local_du_fichier_pyramide = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_PYRAMIDE.value, mocked_logger)
        )
        assert chemin_local_du_fichier_pyramide == 'data_test/entrée/vigie_rh/vigierh_pyramide_2025_09_19.parquet'

        chemin_local_du_fichier_ref = os.path.join(
            vegie_rh_data_path,
            trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_TRANCHE_AGE.value, mocked_logger)
        )
        assert chemin_local_du_fichier_ref == 'data_test/entrée/vigie_rh/vigierh_ref_tranche_age_2025_09_19.parquet'

        date_de_mise_a_jour_pyramide = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_pyramide)
        assert date_de_mise_a_jour_pyramide == '2025-09-19'

        date_de_mise_a_jour_ref = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
        assert date_de_mise_a_jour_ref == '2025-09-19'

        # Traitements des données
        df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_TRANCHE_AGE.value)

        nombre_de_lignes = df_ref.shape[0]
        assert nombre_de_lignes == 11
        data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_pyramide, ColumMapping.PYRAMIDE_TRANCHE_AGE.value)
        df_filtre = filtrer_les_donnees_pyramide(data_frame, base_de_données_test)
        assert df_filtre.shape[0] == 121
        with base_de_données_test.connect() as connection:
            supprimer_donnees_existantes(TABLE_TRANCHE_AGE, connection, SOURCE, mocked_logger)
            assert compte_nombre_de_lignes(TABLE_TRANCHE_AGE, connection) == 0
            supprimer_donnees_existantes(TABLE_REF_TRANCHE_AGE, connection, SOURCE, mocked_logger)
            assert compte_nombre_de_lignes(TABLE_REF_TRANCHE_AGE, connection) == 0
            inserer_nouvelles_donnees(
                TABLE_REF_TRANCHE_AGE,
                connection,
                base_de_données_test,
                SOURCE,
                df_ref,
                mocked_logger,
                FichierSource.VIGIE_RH_REF_TRANCHE_AGE,
                date_de_mise_a_jour_ref,
            )
            inserer_nouvelles_donnees(
                TABLE_TRANCHE_AGE,
                connection,
                base_de_données_test,
                SOURCE,
                df_filtre,
                mocked_logger,
                FichierSource.VIGIE_RH_PYRAMIDE,
                date_de_mise_a_jour_pyramide,
            )
            assert compte_nombre_de_lignes(TABLE_REF_TRANCHE_AGE, base_de_données_test) == 11

            assert compte_nombre_de_lignes(TABLE_TRANCHE_AGE, base_de_données_test) == 121

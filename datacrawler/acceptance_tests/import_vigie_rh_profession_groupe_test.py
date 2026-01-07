import os
from typing import Dict, Tuple
import pandas as pd
import numpy as np
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
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
from datacrawler.load.nom_des_tables import (
    FichierSource,
    TABLE_PROFESSION_GROUPE,
    TABLE_REF_PROFESSION_GROUPE,
)
from datacrawler.import_vigie_rh_profession_groupe import filter_profession_groupe_data
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees

NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010002228"
NUMÉRO_FINESS_ÉTABLISSEMENT_2 = "470001702"
NUMÉRO_FINESS_ÉTABLISSEMENT_3 = "470005356"

class TestImportVigiePprofessionGroupe:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_2, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_3, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

    def _setup_file_paths(self, vegie_rh_data_path: str) -> Dict[str, str]:
        fichiers = os.listdir(vegie_rh_data_path)
        return {
            'profession_groupe': os.path.join(
                vegie_rh_data_path,
                trouve_le_nom_du_fichier(
                    fichiers,
                    FichierSource.VIGIE_RH_PROFESSION_GROUPE.value,
                    mocked_logger
                )
            ),
            'ref_profession_groupe': os.path.join(
                vegie_rh_data_path, trouve_le_nom_du_fichier(
                    fichiers,
                    FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value,
                    mocked_logger
                )
            ),
            'table_passage_profession': os.path.join(
                vegie_rh_data_path,
                trouve_le_nom_du_fichier(
                    fichiers,
                    FichierSource.VIGIE_RH_REF_PASSAGE_GROUPE_FILIERE.value,
                    mocked_logger
                )
            )
        }

    def _assert_file_paths(self, file_paths: Dict[str, str]) -> None:
        assert file_paths['profession_groupe'] == 'data_test/entrée/vigie_rh/vigierh_profession2_2025_10_30.parquet'
        assert file_paths['ref_profession_groupe'] == 'data_test/entrée/vigie_rh/vigierh_ref_profession2_2025_10_30.parquet'
        assert file_paths['table_passage_profession'] == 'data_test/entrée/vigie_rh/vigierh_table_passage_professions_1_2_2025_10_30.parquet'

    def _extract_dates(self, file_paths: Dict[str, str]) -> Dict[str, str]:
        return {
            'profession_groupe': extrais_la_date_du_nom_de_fichier_vigie_rh(file_paths['profession_groupe']),
            'ref_profession_groupe': extrais_la_date_du_nom_de_fichier_vigie_rh(file_paths['ref_profession_groupe']),
            'table_passage_profession': extrais_la_date_du_nom_de_fichier_vigie_rh(file_paths['table_passage_profession']),
        }

    def _assert_dates(self, dates: Dict[str, str]) -> None:
        assert dates['profession_groupe'] == '2025-10-30'
        assert dates['ref_profession_groupe'] == '2025-10-30'
        assert dates['table_passage_profession'] == '2025-10-30'

    def _read_and_assert_dataframes(self, file_paths: Dict[str, str]) -> Tuple[pd.DataFrame, pd.DataFrame]:
        df_ref_profession_groupe = lis_le_fichier_parquet(file_paths['ref_profession_groupe'], ColumMapping.REF_PROFESSION_GROUPE.value)
        code_list_ref_profession_groupe = np.array(df_ref_profession_groupe['code'].tolist())

        df_passage_profession = lis_le_fichier_parquet(
            file_paths['table_passage_profession'],
            ColumMapping.PASSAGE_GROUPE_FILIERE.value
        )
        df_passage_profession.rename(columns={"profession_code": "code"}, inplace=True)
        df_ref_profession_groupe = df_ref_profession_groupe.merge(df_passage_profession, on="code", how="left")
        df_ref_profession_groupe["code_filiere"] = pd.to_numeric(df_ref_profession_groupe["code_filiere"], errors="coerce").astype("Int64")

        data_frame = lis_le_fichier_parquet(file_paths['profession_groupe'], ColumMapping.PROFESSION_GROUPE.value)
        df_filtré = filter_profession_groupe_data(data_frame, code_list_ref_profession_groupe, base_de_données_test).head(200)

        assert df_ref_profession_groupe.shape[0] == 25
        assert df_filtré.shape[0] == 200

        return df_ref_profession_groupe, df_filtré

    def _clear_existing_data(self) -> None:
        supprimer_donnees_existantes(TABLE_PROFESSION_GROUPE, base_de_données_test, SOURCE, mocked_logger)
        supprimer_donnees_existantes(TABLE_REF_PROFESSION_GROUPE, base_de_données_test, SOURCE, mocked_logger)

        assert compte_nombre_de_lignes(TABLE_PROFESSION_GROUPE, base_de_données_test) == 0
        assert compte_nombre_de_lignes(TABLE_REF_PROFESSION_GROUPE, base_de_données_test) == 0

    def _insert_new_data(self, data_frames: Tuple[pd.DataFrame, pd.DataFrame], dates: Dict[str, str]) -> None:
        inserer_nouvelles_donnees(
            TABLE_REF_PROFESSION_GROUPE,
            base_de_données_test,
            base_de_données_test,
            SOURCE,
            data_frames[0],
            mocked_logger,
            FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE,
            dates['ref_profession_groupe']
        )
        inserer_nouvelles_donnees(
            TABLE_PROFESSION_GROUPE,
            base_de_données_test,
            base_de_données_test,
            SOURCE,
            data_frames[1],
            mocked_logger,
            FichierSource.VIGIE_RH_PROFESSION_GROUPE,
            dates['profession_groupe']
        )

        assert compte_nombre_de_lignes(TABLE_REF_PROFESSION_GROUPE, base_de_données_test) == 25
        assert compte_nombre_de_lignes(TABLE_PROFESSION_GROUPE, base_de_données_test) == 200

    def test_import_vigie_rh_profession_groupe_test(self) -> None:
        vegie_rh_data_path = 'data_test/entrée/vigie_rh'
        file_paths = self._setup_file_paths(vegie_rh_data_path)
        self._assert_file_paths(file_paths)

        dates = self._extract_dates(file_paths)
        self._assert_dates(dates)

        data_frames = self._read_and_assert_dataframes(file_paths)
        self._clear_existing_data()
        self._insert_new_data(data_frames, dates)

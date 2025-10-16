import os
import pandas as pd
from pandas.testing import assert_frame_equal

from datacrawler.import_vigierh_motifs_ruptures_contrats import (
    filtrer_les_donnees,
    import_donnees_motifs_ruptures,
)
from datacrawler.load.nom_des_tables import (
    TABLE_VIGIE_RH_REF_MOTIFS_RUPTURES,
    TABLE_VIGIE_RH_MOTIFS_RUPTURES,
)
from datacrawler.load.nom_des_tables import FichierSource
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    supprime_les_données_des_tables,
    sauvegarde_une_entité_juridique_en_base,
    sauvegarde_un_établissement_en_base,
    compte_nombre_de_lignes,
)
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.transform.equivalence_vigierh_helios import ColumMapping


NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT_1 = "010002228"
NUMÉRO_FINESS_ÉTABLISSEMENT_2 = "470001702"


class TestImportVigierhMotifsRupturesContrats:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
        base_de_données_test.execute(f"DELETE FROM {TABLE_VIGIE_RH_REF_MOTIFS_RUPTURES};")
        base_de_données_test.execute(f"DELETE FROM {TABLE_VIGIE_RH_MOTIFS_RUPTURES};")
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(
            NUMÉRO_FINESS_ÉTABLISSEMENT_1, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test
        )
        sauvegarde_un_établissement_en_base(
            NUMÉRO_FINESS_ÉTABLISSEMENT_2, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test
        )
        mocked_logger.reset_mock()

    def _setup_file_paths(self, vegie_rh_data_path: str) -> dict:
        fichiers = os.listdir(vegie_rh_data_path)
        return {
            "donnees": os.path.join(
                vegie_rh_data_path,
                trouve_le_nom_du_fichier(
                    fichiers,
                    FichierSource.VIGIE_RH_MOTIFS_RUPTURES.value,
                    mocked_logger,
                ),
            ),
            "ref": os.path.join(
                vegie_rh_data_path,
                trouve_le_nom_du_fichier(
                    fichiers,
                    FichierSource.VIGIE_RH_REF_MOTIFS_RUPTURES.value,
                    mocked_logger,
                ),
            ),
        }

    def _assert_file_paths(self, file_paths: dict) -> None:
        assert (
            file_paths["donnees"]
            == "data_test/entrée/vigie_rh/vigierh_motifs_ruptures_2025_07_03.parquet"
        )
        assert (
            file_paths["ref"]
            == "data_test/entrée/vigie_rh/vigierh_ref_motifs_ruptures_2025_07_03.parquet"
        )

    def _extract_dates(self, file_paths: dict) -> dict:
        return {
            "donnees": extrais_la_date_du_nom_de_fichier_vigie_rh(file_paths["donnees"]),
            "ref": extrais_la_date_du_nom_de_fichier_vigie_rh(file_paths["ref"]),
        }

    def _read_and_assert_dataframes(self, file_paths: dict) -> tuple[pd.DataFrame, pd.DataFrame]:
        df_ref = lis_le_fichier_parquet(file_paths["ref"], ColumMapping.REF_MOTIFS_RUPTURES.value)
        df_donnees = lis_le_fichier_parquet(
            file_paths["donnees"],
            ColumMapping.MOTIFS_RUPTURES.value,
        )
        df_filtre = filtrer_les_donnees(df_donnees, df_ref, base_de_données_test)

        assert df_ref.shape[0] == 2
        assert df_filtre.shape[0] == 2

        return df_ref, df_filtre

    def test_filtrer_les_donnees_ne_conserve_que_les_lignes_valides(self) -> None:
        donnees = pd.DataFrame(
            [
                {
                    "finess_et": NUMÉRO_FINESS_ÉTABLISSEMENT_1,
                    "annee": "2024",
                    "trimestre": 1,
                    "motif_code": 1,
                    "effectif": 3,
                    "effectif_ref": 1,
                },
                {
                    "finess_et": NUMÉRO_FINESS_ÉTABLISSEMENT_1,
                    "annee": "20A4",
                    "trimestre": 2,
                    "motif_code": 2,
                    "effectif": 4,
                    "effectif_ref": 2,
                },
                {
                    "finess_et": "12345678",
                    "annee": "2024",
                    "trimestre": 1,
                    "motif_code": 3,
                    "effectif": 5,
                    "effectif_ref": 2,
                },
                {
                    "finess_et": "999999999",
                    "annee": "2024",
                    "trimestre": 3,
                    "motif_code": 4,
                    "effectif": 6,
                    "effectif_ref": 3,
                },
            ]
        )

        references = pd.DataFrame(
            [
                {"code": 1, "motif": "Remplacement"},
                {"code": 2, "motif": "Accroissement"},
            ]
        )

        donnees_filtrees = filtrer_les_donnees(donnees, references, base_de_données_test)

        assert donnees_filtrees.shape[0] == 1
        assert donnees_filtrees.iloc[0]["finess_et"] == NUMÉRO_FINESS_ÉTABLISSEMENT_1
        assert donnees_filtrees.iloc[0]["motif_code"] == 1

    def test_filtrer_les_donnees_exclut_les_motifs_non_reference(self) -> None:
        references = pd.DataFrame(
            [
                {"code": 1, "motif": "Remplacement"},
            ]
        )
        donnees = pd.DataFrame(
            [
                {
                    "finess_et": NUMÉRO_FINESS_ÉTABLISSEMENT_1,
                    "annee": "2024",
                    "trimestre": 1,
                    "motif_code": 1,
                    "effectif": 3,
                    "effectif_ref": 1,
                },
                {
                    "finess_et": NUMÉRO_FINESS_ÉTABLISSEMENT_1,
                    "annee": "2024",
                    "trimestre": 2,
                    "motif_code": 3,
                    "effectif": 4,
                    "effectif_ref": 2,
                },
            ]
        )

        donnees_filtrees = filtrer_les_donnees(donnees, references, base_de_données_test)

        assert donnees_filtrees.shape[0] == 1
        assert donnees_filtrees.iloc[0]["motif_code"] == 1

    def test_filtrer_les_donnees_exclut_les_effectifs_non_renseignes(self) -> None:
        references = pd.DataFrame(
            [
                {"code": 1, "motif": "Remplacement"},
            ]
        )
        donnees = pd.DataFrame(
            [
                {
                    "finess_et": NUMÉRO_FINESS_ÉTABLISSEMENT_1,
                    "annee": "2024",
                    "trimestre": 1,
                    "motif_code": 1,
                    "effectif": 3,
                    "effectif_ref": 1,
                },
                {
                    "finess_et": NUMÉRO_FINESS_ÉTABLISSEMENT_2,
                    "annee": "2024",
                    "trimestre": 1,
                    "motif_code": 1,
                    "effectif": None,
                    "effectif_ref": 1,
                },
            ]
        )

        donnees_filtrees = filtrer_les_donnees(donnees, references, base_de_données_test)

        assert donnees_filtrees.shape[0] == 1
        assert donnees_filtrees.iloc[0]["finess_et"] == NUMÉRO_FINESS_ÉTABLISSEMENT_1

    def test_import_donnees_motifs_ruptures_inseres_les_donnees_filtrees(self) -> None:
        vegie_rh_data_path = "data_test/entrée/vigie_rh"
        file_paths = self._setup_file_paths(vegie_rh_data_path)
        self._assert_file_paths(file_paths)

        dates = self._extract_dates(file_paths)
        assert dates["donnees"] == "2025-07-03"
        assert dates["ref"] == "2025-07-03"

        df_ref, df_filtre = self._read_and_assert_dataframes(file_paths)

        assert compte_nombre_de_lignes(TABLE_VIGIE_RH_REF_MOTIFS_RUPTURES, base_de_données_test) == 0
        assert compte_nombre_de_lignes(TABLE_VIGIE_RH_MOTIFS_RUPTURES, base_de_données_test) == 0

        import_donnees_motifs_ruptures(
            file_paths["ref"],
            file_paths["donnees"],
            base_de_données_test,
            mocked_logger,
        )

        assert compte_nombre_de_lignes(TABLE_VIGIE_RH_REF_MOTIFS_RUPTURES, base_de_données_test) == df_ref.shape[0]
        assert compte_nombre_de_lignes(TABLE_VIGIE_RH_MOTIFS_RUPTURES, base_de_données_test) == df_filtre.shape[0]

        df_ref_en_base = pd.read_sql_table(TABLE_VIGIE_RH_REF_MOTIFS_RUPTURES, base_de_données_test)
        df_ref_attendu = df_ref.sort_values("code").reset_index(drop=True)
        df_ref_en_base = df_ref_en_base.sort_values("code").reset_index(drop=True)
        assert_frame_equal(df_ref_en_base, df_ref_attendu)

        df_motifs = pd.read_sql_table(TABLE_VIGIE_RH_MOTIFS_RUPTURES, base_de_données_test)
        df_motifs = df_motifs.sort_values(["finess_et", "annee", "trimestre", "motif_code"]).reset_index(drop=True)
        df_filtre_attendu = df_filtre.sort_values(
            ["finess_et", "annee", "trimestre", "motif_code"]
        ).reset_index(drop=True)
        assert_frame_equal(df_motifs, df_filtre_attendu)

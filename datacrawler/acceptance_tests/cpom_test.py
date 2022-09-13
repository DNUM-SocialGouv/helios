from unittest.mock import patch, Mock

import pandas as pd
from numpy import NaN

import datacrawler
from datacrawler.ajoute_le_cpom_des_établissements_médico_sociaux import \
    ajoute_le_cpom_des_établissements_médico_sociaux
from datacrawler.load.nom_des_tables import TABLES_DES_CPOM
from datacrawler.test_helpers import sauvegarde_une_entité_juridique_en_base, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, \
    base_de_données_test, sauvegarde_un_établissement_en_base, mocked_logger, \
    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, supprime_les_données_des_tables


class TestAjouteLeCpomDesÉtablissementsMédicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_les_numéros_finess_et_dates_d_entrée_en_vigueur_du_cpom(self) -> None:
        # GIVEN
        chemin_du_fichier_ann_ms_tdp_et = "data_set/diamant/ANN_MS_TDP_ET_2022_06_07.CSV"
        numéro_finess_avec_valeurs_manquantes = "010001261"
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_avec_valeurs_manquantes, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, base_de_données_test)

        # WHEN
        ajoute_le_cpom_des_établissements_médico_sociaux(
            chemin_du_fichier_ann_ms_tdp_et,
            base_de_données_test,
            mocked_logger,
        )

        # THEN
        cpom_attendus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [
                    "010001261",
                    "010003598"
                ],
                "date_d_entree_en_vigueur": [
                    NaN,
                    "21-03-2012",
                ],
            },
        )

        cpoms_enregistrés = pd.read_sql(
            TABLES_DES_CPOM,
            base_de_données_test,
            parse_dates={
                "date_autorisation": {"format": "%y-%m-%d"},
                "date_fin": {"format": "%y-%m-%d"},
                "date_mise_en_oeuvre": {"format": "%y-%m-%d"},
            },
        )

        pd.testing.assert_frame_equal(cpoms_enregistrés, cpom_attendus)

    def test_sauvegarde_la_date_de_mise_à_jour_des_autorisations(self) -> None:
        pass
    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        pass

    @patch.object(datacrawler, "sauvegarde")
    def test_revient_à_la_situation_initiale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde: Mock) -> None:
        pass

import pandas as pd
from numpy import nan

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.finess_builder import xml_contenu_finess_amm_arhgos_builder
from datacrawler.transform.transforme_les_autorisations_et_capacités_des_établissements_sanitaires.transforme_les_données_des_autorisations import (
    transforme_les_donnees_des_autorisations_amm,
)
from datacrawler.transform.équivalences_finess_helios import index_autorisations_amm_sanitaires


class TestTransformeLesDonnéesDesAutorisationsAMM:
    def test_filtre_les_statuts_non_actifs_et_renomme_les_colonnes(self) -> None:
        # GIVEN
        donnees_amm = pd.DataFrame(
            [
                xml_contenu_finess_amm_arhgos_builder(),
                xml_contenu_finess_amm_arhgos_builder(
                    {
                        "codeautorarhgos": "AMM-01-0002",
                        "statut_autorisation_code": "01",
                        "statut_autorisation_lib": "En attente de mise en œuvre",
                    }
                ),
            ]
        )
        numeros_finess_connus = pd.DataFrame([{"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT}])

        # WHEN
        donnees_transformees = transforme_les_donnees_des_autorisations_amm(donnees_amm, numeros_finess_connus, mocked_logger)

        # THEN
        attendu = pd.DataFrame(
            [
                {
                    "code_activite": "QA015",
                    "lib_activite": "Activité QA015",
                    "code_modalite": "MO007",
                    "lib_modalite": "Modalité MO007",
                    "code_mention": "ME023",
                    "lib_mention": "Mention ME023",
                    "code_pratique": "PTS00",
                    "lib_pts": "Pas de pratique therapeutique specifique",
                    "code_declaration": "D01",
                    "lib_declaration": "Hospitalisation a temps complet",
                    "code_autorisation_arhgos": "AMM-01-0001",
                    "date_autorisation": "2024-01-01",
                    "date_fin": nan,
                    "date_mise_en_oeuvre": "2024-01-15",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        ).set_index(index_autorisations_amm_sanitaires)
        pd.testing.assert_frame_equal(donnees_transformees, attendu)

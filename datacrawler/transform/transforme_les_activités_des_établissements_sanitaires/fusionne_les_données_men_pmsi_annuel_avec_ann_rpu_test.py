import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, helios_men_pmsi_annuel_builder, helios_ann_rpu_builder
from datacrawler.transform.transforme_les_activités_des_établissements_sanitaires.fusionne_les_données_men_pmsi_annuel_avec_ann_rpu import (
    fusionne_les_données_men_pmsi_annuel_avec_les_données_ann_rpu,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités


class TestFusionneLesDonnéesMenPmsiAnnuelAvecLesDonnéesAnnRpu:
    def test_fusionne_les_données_men_pmsi_annuel_avec_les_données_ann_rpu_pour_un_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_men_pmsi_annuel_transformées = pd.DataFrame([helios_men_pmsi_annuel_builder()]).set_index(index_des_activités)

        données_ann_rpu_transformées = pd.DataFrame([helios_ann_rpu_builder()]).set_index(index_des_activités)

        # WHEN
        données_fusionnées = fusionne_les_données_men_pmsi_annuel_avec_les_données_ann_rpu(données_men_pmsi_annuel_transformées, données_ann_rpu_transformées)

        # THEN

        pd.testing.assert_frame_equal(
            données_fusionnées,
            pd.DataFrame(
                [
                    {
                        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                        "annee": 2018,
                        "nombre_sejours_partiels_medecine": 1.0,
                        "nombre_sejours_partiels_obstetrique": 1.0,
                        "nombre_sejours_partiels_chirurgie": 1.0,
                        "nombre_sejours_complets_medecine": 255.0,
                        "nombre_sejours_complets_chirurgie": 6.0,
                        "nombre_sejours_complets_obstetrique": 1.0,
                        "nombre_journees_completes_ssr": 1074.0,
                        "nombre_journees_partiels_ssr": 1.0,
                        "nombre_journees_complete_psy": 1.0,
                        "nombre_journées_partielles_psy": 1.0,
                        "nombre_passages_urgences": 100.0,
                    }
                ]
            ).set_index(index_des_activités),
        )

    def test_renvoie_une_ligne_avec_valeurs_manquantes_lorsque_l_activité_n_existe_que_dans_un_seul_fichier(self) -> None:
        # GIVEN
        données_men_pmsi_annuel_transformées = pd.DataFrame(
            [
                helios_men_pmsi_annuel_builder(
                    {
                        "numero_finess_etablissement_territorial": "111111111",
                        "annee": 2018,
                    }
                )
            ]
        ).set_index(index_des_activités)

        données_ann_rpu_transformées = pd.DataFrame(
            [
                helios_ann_rpu_builder(
                    {
                        "numero_finess_etablissement_territorial": "222222222",
                        "annee": 2018,
                    }
                )
            ],
        ).set_index(index_des_activités)

        # WHEN
        données_fusionnées = fusionne_les_données_men_pmsi_annuel_avec_les_données_ann_rpu(données_men_pmsi_annuel_transformées, données_ann_rpu_transformées)

        # THEN
        données_attendues = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": ["111111111", "222222222"],
                "annee": [2018, 2018],
                "nombre_sejours_partiels_medecine": [1.0, NaN],
                "nombre_sejours_partiels_obstetrique": [1.0, NaN],
                "nombre_sejours_partiels_chirurgie": [1.0, NaN],
                "nombre_sejours_complets_medecine": [255.0, NaN],
                "nombre_sejours_complets_chirurgie": [6.0, NaN],
                "nombre_sejours_complets_obstetrique": [1.0, NaN],
                "nombre_journees_completes_ssr": [1074.0, NaN],
                "nombre_journees_partiels_ssr": [1.0, NaN],
                "nombre_journees_complete_psy": [1.0, NaN],
                "nombre_journées_partielles_psy": [1.0, NaN],
                "nombre_passages_urgences": [NaN, 100],
            }
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(
            données_fusionnées,
            données_attendues,
        )

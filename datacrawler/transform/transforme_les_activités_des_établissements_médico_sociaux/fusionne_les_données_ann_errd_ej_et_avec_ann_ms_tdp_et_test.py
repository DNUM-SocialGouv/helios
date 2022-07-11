import pandas as pd
from numpy import NaN

from datacrawler.transform.équivalences_diamant_helios import index_des_activités
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.fusionne_les_données_ann_errd_ej_et_avec_ann_ms_tdp_et import (
    fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et,
)


class TestFusionneLesDonnéesAnnErrdEjEtAvecLesDonnéesAnnMsTdpEt:
    def test_fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et_pour_un_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_transformées = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "010001261",
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                }
            ],
        ).set_index(index_des_activités)

        données_ann_ms_tdp_et_transformées = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "010001261",
                    "annee": 2018,
                    "nombre_moyen_journees_absence_personnes_accompagnees": 58.61,
                    "duree_moyenne_sejour_accompagnement_personnes_sorties": 603.00,
                    "file_active_personnes_accompagnees": 116,
                    "taux_realisation_activite": 1.0458,
                }
            ],
        ).set_index(index_des_activités)

        # WHEN
        données_fusionnées = fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et(
            données_ann_errd_ej_et_transformées, données_ann_ms_tdp_et_transformées
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_fusionnées,
            pd.DataFrame(
                [
                    {
                        "numero_finess_etablissement_territorial": "010001261",
                        "annee": 2018,
                        "taux_occupation_accueil_de_jour": 0.48012820512820514,
                        "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                        "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                        "nombre_moyen_journees_absence_personnes_accompagnees": 58.61,
                        "duree_moyenne_sejour_accompagnement_personnes_sorties": 603.00,
                        "file_active_personnes_accompagnees": 116,
                        "taux_realisation_activite": 1.0458,
                    }
                ]
            ).set_index(index_des_activités),
        )

    def test_renvoie_une_ligne_avec_valeurs_manquantes_lorsque_l_activité_n_existe_que_dans_un_seul_fichier(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_transformées = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "111111111",
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                }
            ],
        ).set_index(index_des_activités)

        données_ann_ms_tdp_et_transformées = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "222222222",
                    "annee": 2018,
                    "nombre_moyen_journees_absence_personnes_accompagnees": 58.61,
                    "duree_moyenne_sejour_accompagnement_personnes_sorties": 603.00,
                    "file_active_personnes_accompagnees": 116,
                    "taux_realisation_activite": 1.0458,
                }
            ],
        ).set_index(index_des_activités)

        # WHEN
        données_fusionnées = fusionne_les_données_ann_errd_ej_et_avec_les_données_ann_ms_tdp_et(
            données_ann_errd_ej_et_transformées, données_ann_ms_tdp_et_transformées
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_fusionnées,
            pd.DataFrame(
                [
                    {
                        "numero_finess_etablissement_territorial": "111111111",
                        "annee": 2018,
                        "taux_occupation_accueil_de_jour": 0.48012820512820514,
                        "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                        "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                        "nombre_moyen_journees_absence_personnes_accompagnees": NaN,
                        "duree_moyenne_sejour_accompagnement_personnes_sorties": NaN,
                        "file_active_personnes_accompagnees": NaN,
                        "taux_realisation_activite": NaN,
                    },
                    {
                        "numero_finess_etablissement_territorial": "222222222",
                        "annee": 2018,
                        "taux_occupation_accueil_de_jour": NaN,
                        "taux_occupation_en_hebergement_temporaire": NaN,
                        "taux_occupation_en_hebergement_permanent": NaN,
                        "nombre_moyen_journees_absence_personnes_accompagnees": 58.61,
                        "duree_moyenne_sejour_accompagnement_personnes_sorties": 603.00,
                        "file_active_personnes_accompagnees": 116,
                        "taux_realisation_activite": 1.0458,
                    },
                ]
            ).set_index(index_des_activités),
        )

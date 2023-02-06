import pandas as pd

import datacrawler
from datacrawler.transform.entite_juridique.bloc_activités.agrège_les_activités_dans_les_entites_juridiques import \
    agrège_les_activités_dans_les_entites_juridiques


class TestAgrègeLesActivitesDansLesEntitesJuridiques:

    def test_renvoit_un_dataframe_vide_si_pas_d_activites_ET_sanitaires(self) -> None:
        # GIVEN
        activites_entite_juridique_sanitaires = pd.DataFrame(
            {"annee": [],
             "numero_finess_entite_juridique": [],
             "numero_finess_etablissement_territorial": [],
             "nombre_sejours_partiels_medecine": [],
             "nombre_passages_urgences": [],
             "nombre_sejours_partiels_obstetrique": [],
             "nombre_sejours_partiels_chirurgie": [],
             "nombre_sejours_complets_medecine": [],
             "nombre_sejours_complets_chirurgie": [],
             "nombre_sejours_complets_obstetrique": [],
             "nombre_journees_completes_ssr": [],
             "nombre_journees_partiels_ssr": [],
             "nombre_journees_complete_psy": [],
             "nombre_journées_partielles_psy": [],
             }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {
                "annee": [],
                "numero_finess_entite_juridique": [],
                "nombre_sejours_partiels_medecine": [],
                "nombre_passages_urgences": [],
                "nombre_sejours_partiels_obstetrique": [],
                "nombre_sejours_partiels_chirurgie": [],
                "nombre_sejours_complets_medecine": [],
                "nombre_sejours_complets_chirurgie": [],
                "nombre_sejours_complets_obstetrique": [],
                "nombre_journees_completes_ssr": [],
                "nombre_journees_partiels_ssr": [],
                "nombre_journees_complete_psy": [],
                "nombre_journées_partielles_psy": [],
            }
        )
        pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

    def test_renvoit_les_activités_d_un_etablissement_pour_une_annee(self) -> None:
        # GIVEN
        activites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "numero_finess_etablissement_territorial": ["222222222"],
                "nombre_sejours_partiels_medecine": [10],
                "nombre_passages_urgences": [1000],
                "nombre_sejours_partiels_obstetrique": [1],
                "nombre_sejours_partiels_chirurgie": [2],
                "nombre_sejours_complets_medecine": [20],
                "nombre_sejours_complets_chirurgie": [10],
                "nombre_sejours_complets_obstetrique": [5],
                "nombre_journees_completes_ssr": [500],
                "nombre_journees_partiels_ssr": [1],
                "nombre_journees_complete_psy": [1],
                "nombre_journées_partielles_psy": [1]
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {"annee": ["2020"],
             "numero_finess_entite_juridique": ["111111111"],
             "nombre_sejours_partiels_medecine": [10],
             "nombre_passages_urgences": [1000],
             "nombre_sejours_partiels_obstetrique": [1],
             "nombre_sejours_partiels_chirurgie": [2],
             "nombre_sejours_complets_medecine": [20],
             "nombre_sejours_complets_chirurgie": [10],
             "nombre_sejours_complets_obstetrique": [5],
             "nombre_journees_completes_ssr": [500],
             "nombre_journees_partiels_ssr": [1],
             "nombre_journees_complete_psy": [1],
             "nombre_journées_partielles_psy": [1]
             })
        pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

    def test_renvoit_les_activites_d_un_etablissement_pour_deux_annees(self) -> None:
        # GIVEN
        activites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2021"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "numero_finess_etablissement_territorial": ["222222222", "222222222"],
                "nombre_sejours_partiels_medecine": [10, 20],
                "nombre_passages_urgences": [1000, 2000],
                "nombre_sejours_partiels_obstetrique": [1, 2],
                "nombre_sejours_partiels_chirurgie": [2, 4],
                "nombre_sejours_complets_medecine": [20, 20],
                "nombre_sejours_complets_chirurgie": [10, 10],
                "nombre_sejours_complets_obstetrique": [5, 15],
                "nombre_journees_completes_ssr": [500, 1000],
                "nombre_journees_partiels_ssr": [1, 1],
                "nombre_journees_complete_psy": [1, 0],
                "nombre_journées_partielles_psy": [1, 2]
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {"annee": ["2020", "2021"],
             "numero_finess_entite_juridique": ["111111111", "111111111"],
             "nombre_sejours_partiels_medecine": [10, 20],
             "nombre_passages_urgences": [1000, 2000],
             "nombre_sejours_partiels_obstetrique": [1, 2],
             "nombre_sejours_partiels_chirurgie": [2, 4],
             "nombre_sejours_complets_medecine": [20, 20],
             "nombre_sejours_complets_chirurgie": [10, 10],
             "nombre_sejours_complets_obstetrique": [5, 15],
             "nombre_journees_completes_ssr": [500, 1000],
             "nombre_journees_partiels_ssr": [1, 1],
             "nombre_journees_complete_psy": [1, 0],
             "nombre_journées_partielles_psy": [1, 2]
             }
        )
        pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

    def test_renvoit_les_activites_de_deux_etablissements_pour_une_annee(self) -> None:
        # GIVEN
        activites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "numero_finess_etablissement_territorial": ["222222222", "333333333"],
                "nombre_sejours_partiels_medecine": [10, 20],
                "nombre_passages_urgences": [1000, 2000],
                "nombre_sejours_partiels_obstetrique": [1, 2],
                "nombre_sejours_partiels_chirurgie": [2, 4],
                "nombre_sejours_complets_medecine": [20, 20],
                "nombre_sejours_complets_chirurgie": [10, 10],
                "nombre_sejours_complets_obstetrique": [5, 15],
                "nombre_journees_completes_ssr": [500, 1000],
                "nombre_journees_partiels_ssr": [1, 1],
                "nombre_journees_complete_psy": [1, 0],
                "nombre_journées_partielles_psy": [1, 2]
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {"annee": ["2020"],
             "numero_finess_entite_juridique": ["111111111"],
             "nombre_sejours_partiels_medecine": [30],
             "nombre_passages_urgences": [3000],
             "nombre_sejours_partiels_obstetrique": [3],
             "nombre_sejours_partiels_chirurgie": [6],
             "nombre_sejours_complets_medecine": [40],
             "nombre_sejours_complets_chirurgie": [20],
             "nombre_sejours_complets_obstetrique": [20],
             "nombre_journees_completes_ssr": [1500],
             "nombre_journees_partiels_ssr": [2],
             "nombre_journees_complete_psy": [1],
             "nombre_journées_partielles_psy": [3]
             })
        pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

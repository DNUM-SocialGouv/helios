from numpy import nan

import pandas as pd

from datacrawler.transform.entite_juridique.bloc_activités.agrège_les_activités_dans_les_entites_juridiques import (
    agrège_les_activités_dans_les_entites_juridiques,
)


class TestAgrègeLesActivitesDansLesEntitesJuridiques:
    def test_renvoit_un_dataframe_vide_si_pas_d_activites_entités_juridiques_sanitaires(self) -> None:
        # GIVEN
        activites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": [],
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
                "nombre_passage_urgence": [],
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
        ).set_index(["annee", "numero_finess_entite_juridique"])
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
                "nombre_journées_partielles_psy": [1],
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "nombre_sejours_partiels_medecine": [10],
                "nombre_passage_urgence": [1000],
                "nombre_sejours_partiels_obstetrique": [1],
                "nombre_sejours_partiels_chirurgie": [2],
                "nombre_sejours_complets_medecine": [20],
                "nombre_sejours_complets_chirurgie": [10],
                "nombre_sejours_complets_obstetrique": [5],
                "nombre_journees_completes_ssr": [500],
                "nombre_journees_partiels_ssr": [1],
                "nombre_journees_complete_psy": [1],
                "nombre_journées_partielles_psy": [1],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
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
                "nombre_journées_partielles_psy": [1, 2],
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020", "2021"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "nombre_sejours_partiels_medecine": [10, 20],
                "nombre_passage_urgence": [1000, 2000],
                "nombre_sejours_partiels_obstetrique": [1, 2],
                "nombre_sejours_partiels_chirurgie": [2, 4],
                "nombre_sejours_complets_medecine": [20, 20],
                "nombre_sejours_complets_chirurgie": [10, 10],
                "nombre_sejours_complets_obstetrique": [5, 15],
                "nombre_journees_completes_ssr": [500, 1000],
                "nombre_journees_partiels_ssr": [1, 1],
                "nombre_journees_complete_psy": [1, 0],
                "nombre_journées_partielles_psy": [1, 2],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
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
                "nombre_journées_partielles_psy": [1, 2],
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "nombre_sejours_partiels_medecine": [30],
                "nombre_passage_urgence": [3000],
                "nombre_sejours_partiels_obstetrique": [3],
                "nombre_sejours_partiels_chirurgie": [6],
                "nombre_sejours_complets_medecine": [40],
                "nombre_sejours_complets_chirurgie": [20],
                "nombre_sejours_complets_obstetrique": [20],
                "nombre_journees_completes_ssr": [1500],
                "nombre_journees_partiels_ssr": [2],
                "nombre_journees_complete_psy": [1],
                "nombre_journées_partielles_psy": [3],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

    def test_renvoit_les_activites_de_deux_etablissements_pour_une_annee_avec_nan(self) -> None:
        # GIVEN
        activites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "numero_finess_etablissement_territorial": ["222222222", "333333333"],
                "nombre_sejours_partiels_medecine": [nan, nan],
                "nombre_passages_urgences": [nan, nan],
                "nombre_sejours_partiels_obstetrique": [nan, nan],
                "nombre_sejours_partiels_chirurgie": [nan, nan],
                "nombre_sejours_complets_medecine": [nan, nan],
                "nombre_sejours_complets_chirurgie": [nan, nan],
                "nombre_sejours_complets_obstetrique": [nan, nan],
                "nombre_journees_completes_ssr": [nan, nan],
                "nombre_journees_partiels_ssr": [nan, nan],
                "nombre_journees_complete_psy": [nan, nan],
                "nombre_journées_partielles_psy": [nan, nan],
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "nombre_sejours_partiels_medecine": [nan],
                "nombre_passage_urgence": [nan],
                "nombre_sejours_partiels_obstetrique": [nan],
                "nombre_sejours_partiels_chirurgie": [nan],
                "nombre_sejours_complets_medecine": [nan],
                "nombre_sejours_complets_chirurgie": [nan],
                "nombre_sejours_complets_obstetrique": [nan],
                "nombre_journees_completes_ssr": [nan],
                "nombre_journees_partiels_ssr": [nan],
                "nombre_journees_complete_psy": [nan],
                "nombre_journées_partielles_psy": [nan],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

    def test_renvoit_les_activites_de_deux_etablissements_pour_une_annee_avec_nan_et_chiffre(self) -> None:
        # GIVEN
        activites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "numero_finess_etablissement_territorial": ["222222222", "333333333"],
                "nombre_sejours_partiels_medecine": [nan, 1],
                "nombre_passages_urgences": [nan, 2],
                "nombre_sejours_partiels_obstetrique": [nan, 3],
                "nombre_sejours_partiels_chirurgie": [nan, 4],
                "nombre_sejours_complets_medecine": [nan, 5],
                "nombre_sejours_complets_chirurgie": [nan, 6],
                "nombre_sejours_complets_obstetrique": [nan, 7],
                "nombre_journees_completes_ssr": [nan, 8],
                "nombre_journees_partiels_ssr": [nan, 9],
                "nombre_journees_complete_psy": [nan, 0],
                "nombre_journées_partielles_psy": [nan, 1],
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "nombre_sejours_partiels_medecine": [1.0],
                "nombre_passage_urgence": [2.0],
                "nombre_sejours_partiels_obstetrique": [3.0],
                "nombre_sejours_partiels_chirurgie": [4.0],
                "nombre_sejours_complets_medecine": [5.0],
                "nombre_sejours_complets_chirurgie": [6.0],
                "nombre_sejours_complets_obstetrique": [7.0],
                "nombre_journees_completes_ssr": [8.0],
                "nombre_journees_partiels_ssr": [9.0],
                "nombre_journees_complete_psy": [0.0],
                "nombre_journées_partielles_psy": [1.0],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

    def test_renvoit_les_activites_de_deux_entités_juridiques(self) -> None:
        # GIVEN
        activites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "111111111", "222222"],
                "numero_finess_etablissement_territorial": ["222222222", "333333333", "44444444"],
                "nombre_sejours_partiels_medecine": [1, 2, 5],
                "nombre_passages_urgences": [1, 2, 5],
                "nombre_sejours_partiels_obstetrique": [1, 2, 5],
                "nombre_sejours_partiels_chirurgie": [1, 2, 5],
                "nombre_sejours_complets_medecine": [1, 2, 5],
                "nombre_sejours_complets_chirurgie": [1, 2, 5],
                "nombre_sejours_complets_obstetrique": [1, 2, 5],
                "nombre_journees_completes_ssr": [1, 2, 5],
                "nombre_journees_partiels_ssr": [1, 2, 5],
                "nombre_journees_complete_psy": [1, 2, 5],
                "nombre_journées_partielles_psy": [1, 2, 5],
            }
        )

        # WHEN
        activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

        # THEN
        activités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "222222"],
                "nombre_sejours_partiels_medecine": [3, 5],
                "nombre_passage_urgence": [3, 5],
                "nombre_sejours_partiels_obstetrique": [3, 5],
                "nombre_sejours_partiels_chirurgie": [3, 5],
                "nombre_sejours_complets_medecine": [3, 5],
                "nombre_sejours_complets_chirurgie": [3, 5],
                "nombre_sejours_complets_obstetrique": [3, 5],
                "nombre_journees_completes_ssr": [3, 5],
                "nombre_journees_partiels_ssr": [3, 5],
                "nombre_journees_complete_psy": [3, 5],
                "nombre_journées_partielles_psy": [3, 5],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

import pandas as pd
from numpy import NaN

from datacrawler.transform.entite_juridique.bloc_autorisations_capacités.agrège_les_capacités_dans_les_entites_juridiques import (
    agrège_les_capacités_dans_les_entites_juridiques,
)


class TestAgrègeLesCapacitésDansLesEntitesJuridiques:
    def test_renvoit_un_dataframe_vide_si_pas_de_capacités_entités_juridiques_sanitaires(self) -> None:
        # GIVEN
        capacites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": [],
                "numero_finess_entite_juridique": [],
                "numero_finess_etablissement_territorial": [],
                "nombre_lits_chirurgie": [],
                "nombre_lits_médecine": [],
                "nombre_lits_obstétrique": [],
                "nombre_lits_ssr": [],
                "nombre_places_chirurgie": [],
                "nombre_places_obstétrique": [],
                "nombre_places_ssr": [],
                "nombre_lits_usld": [],
                "nombre_lits_ou_places_psy_complet": [],
                "nombre_places_psy_partiel": [],
            }
        )

        # WHEN
        capacités_agrégées = agrège_les_capacités_dans_les_entites_juridiques(capacites_entite_juridique_sanitaires)

        # THEN
        capacités_agrégées_attendues = pd.DataFrame(
            {
                "annee": [],
                "numero_finess_entite_juridique": [],
                "nombre_lits_chirurgie": [],
                "nombre_lits_médecine": [],
                "nombre_lits_obstétrique": [],
                "nombre_lits_ssr": [],
                "nombre_places_chirurgie": [],
                "nombre_places_obstétrique": [],
                "nombre_places_ssr": [],
                "nombre_lits_usld": [],
                "nombre_lits_ou_places_psy_complet": [],
                "nombre_places_psy_partiel": [],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(capacités_agrégées, capacités_agrégées_attendues)

    def test_renvoit_les_capacités_d_un_etablissement_pour_une_annee(self) -> None:
        # GIVEN
        capacites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "numero_finess_etablissement_territorial": ["222222222"],
                "nombre_lits_chirurgie": [10],
                "nombre_lits_médecine": [1000],
                "nombre_lits_obstétrique": [1],
                "nombre_lits_ssr": [2],
                "nombre_places_chirurgie": [20],
                "nombre_places_obstétrique": [10],
                "nombre_places_ssr": [5],
                "nombre_lits_usld": [500],
                "nombre_lits_ou_places_psy_complet": [1],
                "nombre_places_psy_partiel": [1],
            }
        )

        # WHEN
        capacités_agrégées = agrège_les_capacités_dans_les_entites_juridiques(capacites_entite_juridique_sanitaires)

        # THEN
        capacités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "nombre_lits_chirurgie": [10],
                "nombre_lits_médecine": [1000],
                "nombre_lits_obstétrique": [1],
                "nombre_lits_ssr": [2],
                "nombre_places_chirurgie": [20],
                "nombre_places_obstétrique": [10],
                "nombre_places_ssr": [5],
                "nombre_lits_usld": [500],
                "nombre_lits_ou_places_psy_complet": [1],
                "nombre_places_psy_partiel": [1],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(capacités_agrégées, capacités_agrégées_attendues)

    def test_renvoit_les_capacites_d_un_etablissement_pour_deux_annees(self) -> None:
        # GIVEN
        capacites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2021"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "numero_finess_etablissement_territorial": ["222222222", "222222222"],
                "nombre_lits_chirurgie": [10, 20],
                "nombre_lits_médecine": [1000, 2000],
                "nombre_lits_obstétrique": [1, 2],
                "nombre_lits_ssr": [2, 4],
                "nombre_places_chirurgie": [20, 20],
                "nombre_places_obstétrique": [10, 10],
                "nombre_places_ssr": [5, 15],
                "nombre_lits_usld": [500, 1000],
                "nombre_lits_ou_places_psy_complet": [1, 1],
                "nombre_places_psy_partiel": [1, 0],
            }
        )

        # WHEN
        capacités_agrégées = agrège_les_capacités_dans_les_entites_juridiques(capacites_entite_juridique_sanitaires)

        # THEN
        capacités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020", "2021"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "nombre_lits_chirurgie": [10, 20],
                "nombre_lits_médecine": [1000, 2000],
                "nombre_lits_obstétrique": [1, 2],
                "nombre_lits_ssr": [2, 4],
                "nombre_places_chirurgie": [20, 20],
                "nombre_places_obstétrique": [10, 10],
                "nombre_places_ssr": [5, 15],
                "nombre_lits_usld": [500, 1000],
                "nombre_lits_ou_places_psy_complet": [1, 1],
                "nombre_places_psy_partiel": [1, 0],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(capacités_agrégées, capacités_agrégées_attendues)

    def test_renvoit_les_capacites_de_deux_etablissements_pour_une_annee(self) -> None:
        # GIVEN
        capacites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "numero_finess_etablissement_territorial": ["222222222", "333333333"],
                "nombre_lits_chirurgie": [10, 20],
                "nombre_lits_médecine": [1000, 2000],
                "nombre_lits_obstétrique": [1, 2],
                "nombre_lits_ssr": [2, 4],
                "nombre_places_chirurgie": [20, 20],
                "nombre_places_obstétrique": [10, 10],
                "nombre_places_ssr": [5, 15],
                "nombre_lits_usld": [500, 1000],
                "nombre_lits_ou_places_psy_complet": [1, 1],
                "nombre_places_psy_partiel": [1, 0],
            }
        )

        # WHEN
        capacités_agrégées = agrège_les_capacités_dans_les_entites_juridiques(capacites_entite_juridique_sanitaires)

        # THEN
        capacités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "nombre_lits_chirurgie": [30],
                "nombre_lits_médecine": [3000],
                "nombre_lits_obstétrique": [3],
                "nombre_lits_ssr": [6],
                "nombre_places_chirurgie": [40],
                "nombre_places_obstétrique": [20],
                "nombre_places_ssr": [20],
                "nombre_lits_usld": [1500],
                "nombre_lits_ou_places_psy_complet": [2],
                "nombre_places_psy_partiel": [1],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(capacités_agrégées, capacités_agrégées_attendues)

    def test_renvoit_les_capacites_de_deux_etablissements_pour_une_annee_avec_nan(self) -> None:
        # GIVEN
        capacites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "numero_finess_etablissement_territorial": ["222222222", "333333333"],
                "nombre_lits_chirurgie": [NaN, NaN],
                "nombre_lits_médecine": [NaN, NaN],
                "nombre_lits_obstétrique": [NaN, NaN],
                "nombre_lits_ssr": [NaN, NaN],
                "nombre_places_chirurgie": [NaN, NaN],
                "nombre_places_obstétrique": [NaN, NaN],
                "nombre_places_ssr": [NaN, NaN],
                "nombre_lits_usld": [NaN, NaN],
                "nombre_lits_ou_places_psy_complet": [NaN, NaN],
                "nombre_places_psy_partiel": [NaN, NaN],
            }
        )

        # WHEN
        capacités_agrégées = agrège_les_capacités_dans_les_entites_juridiques(capacites_entite_juridique_sanitaires)

        # THEN
        capacités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "nombre_lits_chirurgie": [NaN],
                "nombre_lits_médecine": [NaN],
                "nombre_lits_obstétrique": [NaN],
                "nombre_lits_ssr": [NaN],
                "nombre_places_chirurgie": [NaN],
                "nombre_places_obstétrique": [NaN],
                "nombre_places_ssr": [NaN],
                "nombre_lits_usld": [NaN],
                "nombre_lits_ou_places_psy_complet": [NaN],
                "nombre_places_psy_partiel": [NaN],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(capacités_agrégées, capacités_agrégées_attendues)

    def test_renvoit_les_capacites_de_deux_etablissements_pour_une_annee_avec_nan_et_chiffre(self) -> None:
        # GIVEN
        capacites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "111111111"],
                "numero_finess_etablissement_territorial": ["222222222", "333333333"],
                "nombre_lits_chirurgie": [NaN, 1],
                "nombre_lits_médecine": [NaN, 2],
                "nombre_lits_obstétrique": [NaN, 3],
                "nombre_lits_ssr": [NaN, 4],
                "nombre_places_chirurgie": [NaN, 5],
                "nombre_places_obstétrique": [NaN, 6],
                "nombre_places_ssr": [NaN, 7],
                "nombre_lits_usld": [NaN, 8],
                "nombre_lits_ou_places_psy_complet": [NaN, 9],
                "nombre_places_psy_partiel": [NaN, 0],
            }
        )

        # WHEN
        capacités_agrégées = agrège_les_capacités_dans_les_entites_juridiques(capacites_entite_juridique_sanitaires)

        # THEN
        capacités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020"],
                "numero_finess_entite_juridique": ["111111111"],
                "nombre_lits_chirurgie": [1.0],
                "nombre_lits_médecine": [2.0],
                "nombre_lits_obstétrique": [3.0],
                "nombre_lits_ssr": [4.0],
                "nombre_places_chirurgie": [5.0],
                "nombre_places_obstétrique": [6.0],
                "nombre_places_ssr": [7.0],
                "nombre_lits_usld": [8.0],
                "nombre_lits_ou_places_psy_complet": [9.0],
                "nombre_places_psy_partiel": [0.0],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(capacités_agrégées, capacités_agrégées_attendues)

    def test_renvoit_les_capacites_de_deux_entités_juridiques(self) -> None:
        # GIVEN
        capacites_entite_juridique_sanitaires = pd.DataFrame(
            {
                "annee": ["2020", "2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "111111111", "222222"],
                "numero_finess_etablissement_territorial": ["222222222", "333333333", "44444444"],
                "nombre_lits_chirurgie": [1, 2, 5],
                "nombre_lits_médecine": [1, 2, 5],
                "nombre_lits_obstétrique": [1, 2, 5],
                "nombre_lits_ssr": [1, 2, 5],
                "nombre_places_chirurgie": [1, 2, 5],
                "nombre_places_obstétrique": [1, 2, 5],
                "nombre_places_ssr": [1, 2, 5],
                "nombre_lits_usld": [1, 2, 5],
                "nombre_lits_ou_places_psy_complet": [1, 2, 5],
                "nombre_places_psy_partiel": [1, 2, 5],
            }
        )

        # WHEN
        capacités_agrégées = agrège_les_capacités_dans_les_entites_juridiques(capacites_entite_juridique_sanitaires)

        # THEN
        capacités_agrégées_attendues = pd.DataFrame(
            {
                "annee": ["2020", "2020"],
                "numero_finess_entite_juridique": ["111111111", "222222"],
                "nombre_lits_chirurgie": [3, 5],
                "nombre_lits_médecine": [3, 5],
                "nombre_lits_obstétrique": [3, 5],
                "nombre_lits_ssr": [3, 5],
                "nombre_places_chirurgie": [3, 5],
                "nombre_places_obstétrique": [3, 5],
                "nombre_places_ssr": [3, 5],
                "nombre_lits_usld": [3, 5],
                "nombre_lits_ou_places_psy_complet": [3, 5],
                "nombre_places_psy_partiel": [3, 5],
            }
        ).set_index(["annee", "numero_finess_entite_juridique"])
        pd.testing.assert_frame_equal(capacités_agrégées, capacités_agrégées_attendues)

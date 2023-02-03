import pandas as pd

from datacrawler.transform.entite_juridique.bloc_activités.agrège_les_activités_dans_les_entites_juridiques import (
    agrège_les_activités_dans_les_entites_juridiques,
)


def test_renvoit_un_dataframe_vide_si_pas_d_activites_ET_sanitaires():
    # GIVEN
    activites_entite_juridique_sanitaires = pd.DataFrame(
        {"annee": [], "numero_finess_entite_juridique": [], "numero_finess_etablissement_territorial": [], "nombre_sejours_partiels_medecine": []}
    )

    # WHEN
    activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

    # THEN
    activités_agrégées_attendues = pd.DataFrame(
        {
            "annee": [],
            "numero_finess_entite_juridique": [],
            "nombre_sejours_partiels_medecine": [],
        }
    )
    pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)


def test_renvoit_les_activités_d_un_etablissement_pour_une_annee():
    # GIVEN
    activites_entite_juridique_sanitaires = pd.DataFrame(
        {
            "annee": ["2020"],
            "numero_finess_entite_juridique": ["111111111"],
            "numero_finess_etablissement_territorial": ["222222222"],
            "nombre_sejours_partiels_medecine": [10],
        }
    )

    # WHEN
    activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

    # THEN
    activités_agrégées_attendues = pd.DataFrame({"annee": ["2020"], "numero_finess_entite_juridique": ["111111111"], "nombre_sejours_partiels_medecine": [10]})
    pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)


def test_renvoit_les_activites_d_un_etablissement_pour_deux_annees():
    # GIVEN
    activites_entite_juridique_sanitaires = pd.DataFrame(
        {
            "annee": ["2020", "2021"],
            "numero_finess_entite_juridique": ["111111111", "111111111"],
            "numero_finess_etablissement_territorial": ["222222222", "222222222"],
            "nombre_sejours_partiels_medecine": [10, 20],
        }
    )

    # WHEN
    activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

    # THEN
    activités_agrégées_attendues = pd.DataFrame(
        {"annee": ["2020", "2021"], "numero_finess_entite_juridique": ["111111111", "111111111"], "nombre_sejours_partiels_medecine": [10, 20]}
    )
    pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)


def test_renvoit_les_activites_de_deux_etablissements_pour_une_annee():
    # GIVEN
    activites_entite_juridique_sanitaires = pd.DataFrame(
        {
            "annee": ["2020", "2020"],
            "numero_finess_entite_juridique": ["111111111", "111111111"],
            "numero_finess_etablissement_territorial": ["222222222", "333333333"],
            "nombre_sejours_partiels_medecine": [10, 20],
        }
    )

    # WHEN
    activités_agrégées = agrège_les_activités_dans_les_entites_juridiques(activites_entite_juridique_sanitaires)

    # THEN
    activités_agrégées_attendues = pd.DataFrame({"annee": ["2020"], "numero_finess_entite_juridique": ["111111111"], "nombre_sejours_partiels_medecine": [30]})
    pd.testing.assert_frame_equal(activités_agrégées, activités_agrégées_attendues)

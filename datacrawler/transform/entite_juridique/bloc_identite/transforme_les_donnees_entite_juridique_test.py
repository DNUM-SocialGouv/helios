import pandas as pd

from datacrawler.transform.entite_juridique.bloc_identite.transforme_les_donnees_entite_juridique import(
    associe_les_informations_du_statut_juridique,
    extrais_les_entites_juridiques_recemment_fermees,
    conserve_les_entites_juridiques_ouvertes,
)

from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_2,
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_3,
)

from datacrawler.test_helpers.finess_builder import xml_contenu_finess_cs1400101_builder
from datacrawler.test_helpers.helios_builder import helios_entite_juridique_builder

class TestTransformeLesDonneesEntiteJuridique:
    def test_extrais_les_entites_juridiques_recemment_fermees(self) -> None:
        donnees_finess_cs1400101 = pd.DataFrame([xml_contenu_finess_cs1400101_builder(),
                                                 xml_contenu_finess_cs1400101_builder({"nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_2})])
        entite_juridiques_sauvegardees = pd.DataFrame([helios_entite_juridique_builder(),
                                                       helios_entite_juridique_builder({"numero_finess_entite_juridique": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_2}),
                                                       helios_entite_juridique_builder({"numero_finess_entite_juridique": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_3})])
        entites_juridiques_a_supprimer_attendues = NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_3
        entites_juridiques_a_supprimer = extrais_les_entites_juridiques_recemment_fermees(donnees_finess_cs1400101, entite_juridiques_sauvegardees)
        pd.testing.assert_series_equal(pd.Series(entites_juridiques_a_supprimer), pd.Series(entites_juridiques_a_supprimer_attendues))

    def test_conserve_les_entites_juridiques_ouvertes(self) -> None:
        donnees_finess_cs1400101 = pd.DataFrame([xml_contenu_finess_cs1400101_builder(),
                                                 xml_contenu_finess_cs1400101_builder({"nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_2}),
                                                 xml_contenu_finess_cs1400101_builder({"nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_3,
                                                                                       "datefermeture": "2024-01-01"})])
        entites_juridiques_ouvertes_attendues = pd.DataFrame([xml_contenu_finess_cs1400101_builder(),
                                                 xml_contenu_finess_cs1400101_builder({"nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_2})])
        entites_juridiques_ouvertes = conserve_les_entites_juridiques_ouvertes(donnees_finess_cs1400101)
        pd.testing.assert_frame_equal(entites_juridiques_ouvertes, entites_juridiques_ouvertes_attendues, check_dtype=False)

    def test_associe_les_informations_du_statut_juridique(self) -> None:
        entites_juridiques = pd.DataFrame([
            {"nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE, "statutJuridique": "14"},
            {"nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_2, "statutJuridique": "99"},
            {"nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_3, "statutJuridique": "3000"},
        ])

        entites_juridiques_avec_libelles = associe_les_informations_du_statut_juridique(
            entites_juridiques,
            {
                "14": {"libelle": "Etb.Social Communal", "categorisation": "public"},
                "3000": {"libelle": "Personne morale de droit étranger", "categorisation": "personne_morale_droit_etranger"},
            },
        )

        pd.testing.assert_series_equal(
            entites_juridiques_avec_libelles["statutJuridique"],
            pd.Series(["Etb.Social Communal", "99", "Personne morale de droit étranger"], name="statutJuridique"),
        )
        pd.testing.assert_series_equal(
            entites_juridiques_avec_libelles["categorisation"],
            pd.Series(["public", "", "personne_morale_droit_etranger"], name="categorisation"),
        )

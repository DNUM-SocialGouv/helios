import pandas as pd

from datacrawler.transform.transform_les_etablissements_territoriaux.transforme_le_json_des_etablissements_territoriaux import (
    extrais_les_etablissements_territoriaux_recemment_fermes,
    associe_le_libelle_court_depuis_la_categorie,
)

from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ÉTABLISSEMENT,
    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
)

from datacrawler.test_helpers.finess_builder import xml_contenu_finess_cs1400102_builder
from datacrawler.test_helpers.helios_builder import helios_etablissement_territorial_builder

class TestTransformeLesDonneesEtablissementTerritorial:
    def test_extrais_les_etablissements_territoriaux_recemment_fermes(self) -> None:
        donnees_finess_cs1400102 = pd.DataFrame([xml_contenu_finess_cs1400102_builder(),
                                                 xml_contenu_finess_cs1400102_builder({"nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE})])
        etablissements_territoriaux_sauvegardees = pd.DataFrame([helios_etablissement_territorial_builder(),
                    helios_etablissement_territorial_builder({"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL}),
                    helios_etablissement_territorial_builder({"numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT})])
        etablissements_territoriaux_a_supprimer_attendus = NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL
        etablissements_territoriaux_a_supprimer = extrais_les_etablissements_territoriaux_recemment_fermes(donnees_finess_cs1400102,
                                                                            etablissements_territoriaux_sauvegardees)
        pd.testing.assert_series_equal(pd.Series(etablissements_territoriaux_a_supprimer), pd.Series(etablissements_territoriaux_a_supprimer_attendus))

    def test_associe_le_libelle_court_depuis_la_categorie(self) -> None:
        categories_entite_geographique_exercice = {
            "377": {
                "libelle": "Etablissement Expérimental pour Enfance Handicapée",
                "libelle_court": "Etab.Expér.Enf.Hand.",
                "domaine": "SOC",
            }
        }

        libelle_court = associe_le_libelle_court_depuis_la_categorie("377", categories_entite_geographique_exercice)

        assert libelle_court == "Etab.Expér.Enf.Hand."

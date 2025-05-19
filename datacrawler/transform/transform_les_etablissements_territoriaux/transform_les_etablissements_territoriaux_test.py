import pandas as pd
from numpy import NaN

from datacrawler.transform.transform_les_etablissements_territoriaux.transform_les_etablissements_territoriaux import(
    extrais_les_etablissements_territoriaux_recemment_fermes,
    associe_le_domaine
)

from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ÉTABLISSEMENT,
    NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
    NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL,
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE
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

    def test_associe_le_domaine(self) -> None:
        donnees_finess_cs1400102 = pd.DataFrame([xml_contenu_finess_cs1400102_builder({"categetab": '412'}),
                                                 xml_contenu_finess_cs1400102_builder({"nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE})])
        categories = pd.DataFrame([{"code": "001", "libelle": "Autres lits de m.R.","libellecourt": "Autres lits de m.R.","domaine": "SOC"},
                                {"code": "412", "libelle": "Appartement Thérapeutique","libellecourt": "Appartement Thérapeutique","domaine": "SAN"},
                                {"code": "355", "libelle": "Centre Hospitalier","libellecourt": "C.H","domaine": "SAN"}])
        etablissements_territoriaux_attendus = pd.DataFrame([ {
        "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "nofinessej": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
        "rs": "CH DU HAUT BUGEY GEOVREISSET",
        "rslongue": "CH DU HAUT BUGEY GEOVREISSET",
        "numvoie":  "240",
        "typvoie": "R",
        "voie": "GUY DE MAUPASSANT",
        "departement": "01",
        "libcommune": "DIVONNE LES BAINS",
        "libdepartement": "AIN",
        "dateouv": "2009-01-01",
        "datefermeture": NaN,
        "ligneacheminement": "01220 DIVONNE LES BAINS",
        "categetab": "412",
        "codemft": "03",
        "courriel": "test@test.fr",
        "libcategetab": "Centre Hospitalier (C.H.)",
        "libcourtcategetab": "C.H.",
        "libmft": "ARS établissements Publics de santé dotation globale",
        "nofinessppal": NaN,
        "siret": "5483216f6",
        "typeet": "P",
        "telephone": "0450201235",
        "domaine": "Sanitaire"
    },{"nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
        "nofinessej": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
        "rs": "CH DU HAUT BUGEY - GEOVREISSET",
        "rslongue": "CH DU HAUT BUGEY - GEOVREISSET",
        "numvoie":  "240",
        "typvoie": "R",
        "voie": "GUY DE MAUPASSANT",
        "departement": "01",
        "libcommune": "DIVONNE LES BAINS",
        "libdepartement": "AIN",
        "dateouv": "2009-01-01",
        "datefermeture": NaN,
        "ligneacheminement": "01220 DIVONNE LES BAINS",
        "categetab": "355",
        "codemft": "03",
        "courriel": "test@test.fr",
        "libcategetab": "Centre Hospitalier (C.H.)",
        "libcourtcategetab": "C.H.",
        "libmft": "ARS établissements Publics de santé dotation globale",
        "nofinessppal": NaN,
        "siret": "5483216f6",
        "typeet": "P",
        "telephone": "0450201235",
        "domaine": "Sanitaire"
    }])
        etablissements_territoriaux_categorises = associe_le_domaine(donnees_finess_cs1400102, categories)
        pd.testing.assert_frame_equal(etablissements_territoriaux_categorises,
                                      etablissements_territoriaux_attendus,
                                      check_index_type=False,
                                      check_dtype=False)

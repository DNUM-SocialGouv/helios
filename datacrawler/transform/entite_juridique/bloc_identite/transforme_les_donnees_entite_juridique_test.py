import pandas as pd
from numpy import NaN

from datacrawler.transform.entite_juridique.bloc_identite.transforme_les_donnees_entite_juridique import(
    extrais_les_entites_juridiques_recemment_fermees,
    conserve_les_entites_juridiques_ouvertes,
    associe_la_categorisation
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
        print(entites_juridiques_ouvertes)
        print(entites_juridiques_ouvertes_attendues)
        pd.testing.assert_frame_equal(entites_juridiques_ouvertes, entites_juridiques_ouvertes_attendues, check_dtype=False)

    def test_associe_la_categorisation(self) -> None:
        donnees_finess_cs1400101 = pd.DataFrame([xml_contenu_finess_cs1400101_builder({"statutjuridique": '70'}),
                                                 xml_contenu_finess_cs1400101_builder({"nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_2})])
        categories = pd.DataFrame([{"code": '21',"codeagr2": '1200',"codeagr1": "1000"},
                                {"code": '90',"codeagr2": '3100',"codeagr1": '3000'},
                                {"code": '70',"codeagr2": '2200',"codeagr1": '2000'}])
        entites_juridiques_categorisees_attendues = pd.DataFrame([{
        "datecrea": "2009-01-01",
        "datefermeture": NaN,
        "departement": "01",
        "libcommune": "DIVONNE LES BAINS",
        "libdepartement": "AIN",
        "libstatutjuridique": "Etb.Social Communal",
        "ligneacheminement": "01220 DIVONNE LES BAINS",
        "nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
        "numvoie": "240", 
        "rs": "MAISON DE RETRAITE - DIVONNE-LES-BAINS",
        "rslongue": "MAISON DE RETRAITE RESIDENCE DES ANCIENS - DIVONNE-LES-BAINS",
        "siren": "260214644",
        "statutjuridique": "70",
        "telephone": "0450201235",
        "typvoie": "R",
        "voie": "GUY DE MAUPASSANT",
        "statutJuridiqueNiv2": "2200",
        "statutJuridiqueNiv1": "2000",
        "categorisation": "prive_lucratif"
        },{
        "datecrea": "2009-01-01",
        "datefermeture": NaN,
        "departement": "01",
        "libcommune": "DIVONNE LES BAINS",
        "libdepartement": "AIN",
        "libstatutjuridique": "Etb.Social Communal",
        "ligneacheminement": "01220 DIVONNE LES BAINS",
        "nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE_2,
        "numvoie": "240", 
        "rs": "MAISON DE RETRAITE - DIVONNE-LES-BAINS",
        "rslongue": "MAISON DE RETRAITE RESIDENCE DES ANCIENS - DIVONNE-LES-BAINS",
        "siren": "260214644",
        "statutjuridique": "21",
        "telephone": "0450201235",
        "typvoie": "R",
        "voie": "GUY DE MAUPASSANT",
        "statutJuridiqueNiv2": "1200",
        "statutJuridiqueNiv1": "1000",
        "categorisation": "public"
        }])
        entites_juridiques_categorisees = associe_la_categorisation(donnees_finess_cs1400101, categories)
        entites_juridiques_categorisees["statutJuridiqueNiv2"] = pd.to_numeric(
            entites_juridiques_categorisees["statutJuridiqueNiv2"], errors='coerce').astype(int)
        entites_juridiques_categorisees_attendues["statutJuridiqueNiv2"] = pd.to_numeric(
            entites_juridiques_categorisees_attendues["statutJuridiqueNiv2"], errors='coerce').astype(int)
        pd.testing.assert_frame_equal(entites_juridiques_categorisees,
                                      entites_juridiques_categorisees_attendues,
                                      check_index_type=False,
                                      check_dtype=False)


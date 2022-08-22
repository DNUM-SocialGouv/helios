import os
import shutil
from pathlib import Path

import pandas as pd
from numpy import NaN

from datacrawler.extract.lecteur_xml import lis_le_fichier_xml
from datacrawler.test_helpers import crée_le_fichier_xml
from datacrawler.transform.équivalences_finess_helios import XPATH_FINESS_CS1400105


class TestLisLeFichierXml:
    répertoire_des_fichiers: str = "./fake_flux_finess"

    def setup_method(self) -> None:
        Path(os.path.join(self.répertoire_des_fichiers, "enrichi")).mkdir(parents=True, exist_ok=True)

    def teardown_method(self) -> None:
        shutil.rmtree(self.répertoire_des_fichiers)

    def test_lis_le_fichier_xml(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1400105_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<equipementsocial>
  <nofinesset>070020804</nofinesset>
  <de>924</de>
  <libde>Accueil pour Personnes Âgées</libde>
  <libcourtde>Acc. Personnes Âgées</libcourtde>
  <ta>21</ta>
  <libta>Accueil de Jour</libta>
  <libcourtta>Accueil de Jour</libcourtta>
  <client>436</client>
  <libclient>Personnes Alzheimer ou maladies apparentées</libclient>
  <libcourtclient>Alzheimer, mal appar</libcourtclient>
  <sourceinfo>S</sourceinfo>
  <libsourceinfo>Inspection</libsourceinfo>
  <capinstot>3</capinstot>
  <capinstm xsi:nil="true"/>
  <capinstf xsi:nil="true"/>
  <capinsthab xsi:nil="true"/>
  <ageminiinst xsi:nil="true"/>
  <agemaxiinst xsi:nil="true"/>
  <indsupinst>O</indsupinst>
  <datederinst>2009-01-01</datederinst>
  <datepremautor>2006-03-29</datepremautor>
  <capautot>3</capautot>
  <capautm xsi:nil="true"/>
  <capautf xsi:nil="true"/>
  <capauthab>3</capauthab>
  <ageminiaut xsi:nil="true"/>
  <agemaxiaut xsi:nil="true"/>
  <indsupaut>O</indsupaut>
  <dateautor>2006-03-29</dateautor>
  <datemajaut>2012-05-03</datemajaut>
  <datemajinst>2009-06-29</datemajinst>
  </equipementsocial>""",
        )
        xpath = XPATH_FINESS_CS1400105

        # WHEN
        données_lues = lis_le_fichier_xml(chemin_du_fichier, xpath)

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                {
                    "nofinesset": ["070020804"],
                    "de": ["924"],
                    "libde": ["Accueil pour Personnes Âgées"],
                    "libcourtde": ["Acc. Personnes Âgées"],
                    "ta": ["21"],
                    "libta": ["Accueil de Jour"],
                    "libcourtta": ["Accueil de Jour"],
                    "client": ["436"],
                    "libclient": ["Personnes Alzheimer ou maladies apparentées"],
                    "libcourtclient": ["Alzheimer, mal appar"],
                    "sourceinfo": ["S"],
                    "libsourceinfo": ["Inspection"],
                    "capinstot": [3],
                    "capinstm": [NaN],
                    "capinstf": [NaN],
                    "capinsthab": [NaN],
                    "ageminiinst": [NaN],
                    "agemaxiinst": [NaN],
                    "indsupinst": ["O"],
                    "datederinst": ["2009-01-01"],
                    "datepremautor": ["2006-03-29"],
                    "capautot": [3],
                    "capautm": [NaN],
                    "capautf": [NaN],
                    "capauthab": [3],
                    "ageminiaut": [NaN],
                    "agemaxiaut": [NaN],
                    "indsupaut": ["O"],
                    "dateautor": ["2006-03-29"],
                    "datemajaut": ["2012-05-03"],
                    "datemajinst": ["2009-06-29"],
                }
            ),
        )

    def test_respecte_les_codes_numériques_commençant_par_des_zéros(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1400105_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<equipementsocial>
  <nofinesset>070020804</nofinesset>
  <de>023</de>
  <libde>Stérilisation</libde>
  <libcourtde>Stérilisation</libcourtde>
  <ta>03</ta>
  <libta>Hospitalisation Complète</libta>
  <libcourtta>Hospit. Complète</libcourtta>
  <client>020</client>
  <libclient>Toutes Déficiences Physiques (Sans autre indication)</libclient>
  <libcourtclient>Toutes Déf.Physiques</libcourtclient>
  <sourceinfo>S</sourceinfo>
  <libsourceinfo>Inspection</libsourceinfo>
  <capinstot>3</capinstot>
  <capinstm xsi:nil="true"/>
  <capinstf xsi:nil="true"/>
  <capinsthab xsi:nil="true"/>
  <ageminiinst xsi:nil="true"/>
  <agemaxiinst xsi:nil="true"/>
  <indsupinst>O</indsupinst>
  <datederinst>2009-01-01</datederinst>
  <datepremautor>2006-03-29</datepremautor>
  <capautot>3</capautot>
  <capautm xsi:nil="true"/>
  <capautf xsi:nil="true"/>
  <capauthab>3</capauthab>
  <ageminiaut xsi:nil="true"/>
  <agemaxiaut xsi:nil="true"/>
  <indsupaut>O</indsupaut>
  <dateautor>2006-03-29</dateautor>
  <datemajaut>2012-05-03</datemajaut>
  <datemajinst>2009-06-29</datemajinst>
  </equipementsocial>""",
        )
        xpath = XPATH_FINESS_CS1400105

        # WHEN
        données_lues = lis_le_fichier_xml(chemin_du_fichier, xpath)

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                {
                    "nofinesset": ["070020804"],
                    "de": ["023"],
                    "libde": ["Stérilisation"],
                    "libcourtde": ["Stérilisation"],
                    "ta": ["03"],
                    "libta": ["Hospitalisation Complète"],
                    "libcourtta": ["Hospit. Complète"],
                    "client": ["020"],
                    "libclient": ["Toutes Déficiences Physiques (Sans autre indication)"],
                    "libcourtclient": ["Toutes Déf.Physiques"],
                    "sourceinfo": ["S"],
                    "libsourceinfo": ["Inspection"],
                    "capinstot": [3],
                    "capinstm": [NaN],
                    "capinstf": [NaN],
                    "capinsthab": [NaN],
                    "ageminiinst": [NaN],
                    "agemaxiinst": [NaN],
                    "indsupinst": ["O"],
                    "datederinst": ["2009-01-01"],
                    "datepremautor": ["2006-03-29"],
                    "capautot": [3],
                    "capautm": [NaN],
                    "capautf": [NaN],
                    "capauthab": [3],
                    "ageminiaut": [NaN],
                    "agemaxiaut": [NaN],
                    "indsupaut": ["O"],
                    "dateautor": ["2006-03-29"],
                    "datemajaut": ["2012-05-03"],
                    "datemajinst": ["2009-06-29"],
                }
            ),
        )

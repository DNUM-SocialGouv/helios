import os
import shutil
from pathlib import Path
from typing import Dict

import pandas as pd
from numpy import nan

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.extract.lecteur_xml import (
    lis_le_fichier_xml,
    lis_le_fichier_xml_en_stream,
)
from datacrawler.test_helpers import crée_le_fichier_xml
from datacrawler.transform.équivalences_finess_helios import (
    XPATH_FINESS_CS1400103,
    XPATH_FINESS_CS1400104,
    XPATH_FINESS_CS1400105,
    XPATH_FINESS_CS1600101,
    XPATH_FINESS_CS1600102,
    type_des_colonnes_finess_cs1400103,
    type_des_colonnes_finess_cs1400104,
    type_des_colonnes_finess_cs1400105,
    type_des_colonnes_finess_cs1600101,
    type_des_colonnes_finess_cs1600102,
)


class TestLisLeFichierXml:
    logger = crée_le_logger()
    répertoire_des_fichiers: str = "./fake_flux_finess"

    def setup_method(self) -> None:
        Path(os.path.join(self.répertoire_des_fichiers, "enrichi")).mkdir(
            parents=True, exist_ok=True
        )

    def teardown_method(self) -> None:
        shutil.rmtree(self.répertoire_des_fichiers)

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
        données_lues = lis_le_fichier_xml(
            chemin_du_fichier, xpath, type_des_colonnes_finess_cs1400105
        )

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
                    "libclient": [
                        "Toutes Déficiences Physiques (Sans autre indication)"
                    ],
                    "libcourtclient": ["Toutes Déf.Physiques"],
                    "sourceinfo": ["S"],
                    "libsourceinfo": ["Inspection"],
                    "capinstot": [3],
                    "capinstm": [nan],
                    "capinstf": [nan],
                    "capinsthab": [nan],
                    "ageminiinst": [nan],
                    "agemaxiinst": [nan],
                    "indsupinst": ["O"],
                    "datederinst": ["2009-01-01"],
                    "datepremautor": ["2006-03-29"],
                    "capautot": [3],
                    "capautm": [nan],
                    "capautf": [nan],
                    "capauthab": [3],
                    "ageminiaut": [nan],
                    "agemaxiaut": [nan],
                    "indsupaut": ["O"],
                    "dateautor": ["2006-03-29"],
                    "datemajaut": ["2012-05-03"],
                    "datemajinst": ["2009-06-29"],
                }
            ),
        )

    def test_traite_les_valeurs_manquantes(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1400105_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<parent>
            <echappe>670014604</echappe>
            </parent>
            <parent>
                <echappe xsi:nil="true" />
            </parent>""",
        )
        xpath = "./parent"
        type_de_la_colonne = {"echappe": str}

        # WHEN
        données_lues = lis_le_fichier_xml(chemin_du_fichier, xpath, type_de_la_colonne)

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                {
                    "echappe": ["670014604", nan],
                }
            ),
        )

    def test_lis_les_données_du_fichier_finess_cs1400105(self) -> None:
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
        données_lues = lis_le_fichier_xml(
            chemin_du_fichier, xpath, type_des_colonnes_finess_cs1400105
        )

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
                    "capinstm": [nan],
                    "capinstf": [nan],
                    "capinsthab": [nan],
                    "ageminiinst": [nan],
                    "agemaxiinst": [nan],
                    "indsupinst": ["O"],
                    "datederinst": ["2009-01-01"],
                    "datepremautor": ["2006-03-29"],
                    "capautot": [3],
                    "capautm": [nan],
                    "capautf": [nan],
                    "capauthab": [3],
                    "ageminiaut": [nan],
                    "agemaxiaut": [nan],
                    "indsupaut": ["O"],
                    "dateautor": ["2006-03-29"],
                    "datemajaut": ["2012-05-03"],
                    "datemajinst": ["2009-06-29"],
                }
            ),
        )

    def test_lis_les_données_du_fichier_finess_cs1400103(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1400103_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<activiteoffresoin>
                <nofinessej>310781406</nofinessej>
                <rsej>CHU TOULOUSE</rsej>
                <activite>16</activite>
                <libactivite>Traitement de l'insuffisance rénale chronique par épuration extrarénale</libactivite>
                <modalite>40</modalite>
                <libmodalite>Hémodialyse en centre pour adultes</libmodalite>
                <forme>00</forme>
                <libforme>Pas de forme</libforme>
                <noautor>762201955</noautor>
                <dateautor>2004-11-02</dateautor>
                <indnatlien>J</indnatlien>
                <nofinesset>310019351</nofinesset>
                <rset>HOPITAL LARREY CHU TOULOUSE</rset>
                <noligautor>1757</noligautor>
                <noligautoranc xsi:nil="true"/>
                <noautorarhgos>00-00-000</noautorarhgos>
                <noimplarhgos>00-00-000</noimplarhgos>
                <noancautact xsi:nil="true"/>
                <noancauteml xsi:nil="true"/>
                <sectpsy xsi:nil="true"/>
                <libsectpsy xsi:nil="true"/>
                <datemeo>2005-03-22</datemeo>
                <datefin>2027-09-23</datefin>
                <datelimite xsi:nil="true"/>
                <indcaduc>N</indcaduc>
                <daterenouv xsi:nil="true"/>
                <indrenouv xsi:nil="true"/>
                <indsupact>N</indsupact>
                <indsupsite>N</indsupsite>
                <datemajact>2022-08-24</datemajact>
                <datemajsite>2022-08-24</datemajsite>
            </activiteoffresoin>
            <activiteoffresoin>
                <nofinessej>310026075</nofinessej>
                <rsej>SARL ST CYPRIEN RIVE GAUCHE</rsej>
                <activite>02</activite>
                <libactivite>Chirurgie</libactivite>
                <modalite>00</modalite>
                <libmodalite>Pas de modalité</libmodalite>
                <forme>01</forme>
                <libforme>Hospitalisation complète (24 heures consécutives ou plus)</libforme>
                <noautor>762201956</noautor>
                <dateautor>1998-07-07</dateautor>
                <indnatlien>J</indnatlien>
                <nofinesset>310026083</nofinesset>
                <rset>CL RIVE GAUCHE TOULOUSE</rset>
                <noligautor>1758</noligautor>
                <noligautoranc xsi:nil="true"/>
                <noautorarhgos>01-00-000</noautorarhgos>
                <noimplarhgos>01-00-000</noimplarhgos>
                <noancautact xsi:nil="true"/>
                <noancauteml xsi:nil="true"/>
                <sectpsy xsi:nil="true"/>
                <libsectpsy xsi:nil="true"/>
                <datemeo>1999-11-02</datemeo>
                <datefin>2027-04-30</datefin>
                <datelimite xsi:nil="true"/>
                <indcaduc>N</indcaduc>
                <daterenouv xsi:nil="true"/>
                <indrenouv xsi:nil="true"/>
                <indsupact>N</indsupact>
                <indsupsite>N</indsupsite>
                <datemajact>2022-08-24</datemajact>
                <datemajsite>2022-08-24</datemajsite>
            </activiteoffresoin>
            """,
        )
        xpath = XPATH_FINESS_CS1400103

        # WHEN
        données_lues = lis_le_fichier_xml(
            chemin_du_fichier, xpath, type_des_colonnes_finess_cs1400103
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                [
                    {
                        "nofinessej": 310781406,
                        "rsej": "CHU TOULOUSE",
                        "activite": "16",
                        "libactivite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "modalite": "40",
                        "libmodalite": "Hémodialyse en centre pour adultes",
                        "forme": "00",
                        "libforme": "Pas de forme",
                        "noautor": 762201955,
                        "dateautor": "2004-11-02",
                        "indnatlien": "J",
                        "nofinesset": "310019351",
                        "rset": "HOPITAL LARREY CHU TOULOUSE",
                        "noligautor": 1757,
                        "noligautoranc": nan,
                        "noautorarhgos": "00-00-000",
                        "noimplarhgos": "00-00-000",
                        "noancautact": nan,
                        "noancauteml": nan,
                        "sectpsy": nan,
                        "libsectpsy": nan,
                        "datemeo": "2005-03-22",
                        "datefin": "2027-09-23",
                        "datelimite": nan,
                        "indcaduc": "N",
                        "daterenouv": nan,
                        "indrenouv": nan,
                        "indsupact": "N",
                        "indsupsite": "N",
                        "datemajact": "2022-08-24",
                        "datemajsite": "2022-08-24",
                    },
                    {
                        "nofinessej": 310026075,
                        "rsej": "SARL ST CYPRIEN RIVE GAUCHE",
                        "activite": "02",
                        "libactivite": "Chirurgie",
                        "modalite": "00",
                        "libmodalite": "Pas de modalité",
                        "forme": "01",
                        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
                        "noautor": 762201956,
                        "dateautor": "1998-07-07",
                        "indnatlien": "J",
                        "nofinesset": "310026083",
                        "rset": "CL RIVE GAUCHE TOULOUSE",
                        "noligautor": 1758,
                        "noligautoranc": nan,
                        "noautorarhgos": "01-00-000",
                        "noimplarhgos": "01-00-000",
                        "noancautact": nan,
                        "noancauteml": nan,
                        "sectpsy": nan,
                        "libsectpsy": nan,
                        "datemeo": "1999-11-02",
                        "datefin": "2027-04-30",
                        "datelimite": nan,
                        "indcaduc": "N",
                        "daterenouv": nan,
                        "indrenouv": nan,
                        "indsupact": "N",
                        "indsupsite": "N",
                        "datemajact": "2022-08-24",
                        "datemajsite": "2022-08-24",
                    },
                ]
            ),
        )

    def test_lis_les_données_du_fichier_finess_cs1400104(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1400104_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<equipmateriellourd>
                <nofinessej>310781406</nofinessej>
                <rsej>CHU TOULOUSE</rsej>
                <eml>05701</eml>
                <libeml>Caméra à scintillation sans détecteur d'émission de positons</libeml>
                <libcourteml>Cam scin sans détect</libcourteml>
                <noautor>762218998</noautor>
                <noautorarhgos>02-00-000</noautorarhgos>
                <noimplarhgos>02-00-000</noimplarhgos>
                <dateautor>2004-11-02</dateautor>
                <nofinesset>310783055</nofinesset>
                <numserie xsi:nil="true"/>
                <marque>0000</marque>
                <rset>HOPITAL DE RANGUEIL CHU TOULOUSE</rset>
                <datelimite xsi:nil="true"/>
                <indcaduc>N</indcaduc>
                <indnatlien>J</indnatlien>
                <datemeo>2006-11-08</datemeo>
                <datefin>2028-05-29</datefin>
                <indrempl xsi:nil="true"/>
                <noautorremplacement xsi:nil="true"/>
                <indsup>N</indsup>
                <datemaj>2022-08-24</datemaj>
            </equipmateriellourd>
            <equipmateriellourd>
                <nofinessej>310781406</nofinessej>
                <rsej>CHU TOULOUSE</rsej>
                <eml>05602</eml>
                <libeml>Scanographe à utilisation médicale</libeml>
                <libcourteml>Scanographe méd.</libcourteml>
                <noautor>762227966</noautor>
                <noautorarhgos>03-00-000</noautorarhgos>
                <noimplarhgos>03-00-000</noimplarhgos>
                <dateautor>2004-11-02</dateautor>
                <nofinesset>310019351</nofinesset>
                <numserie xsi:nil="true"/>
                <marque>0000</marque>
                <rset>HOPITAL LARREY CHU TOULOUSE</rset>
                <datelimite xsi:nil="true"/>
                <indcaduc>N</indcaduc>
                <indnatlien>J</indnatlien>
                <datemeo>2006-09-15</datemeo>
                <datefin>2023-03-13</datefin>
                <indrempl xsi:nil="true"/>
                <noautorremplacement xsi:nil="true"/>
                <indsup>N</indsup>
                <datemaj>2022-08-24</datemaj>
            </equipmateriellourd>""",
        )
        xpath = XPATH_FINESS_CS1400104

        # WHEN
        données_lues = lis_le_fichier_xml(
            chemin_du_fichier, xpath, type_des_colonnes_finess_cs1400104
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                [
                    {
                        "nofinessej": 310781406,
                        "rsej": "CHU TOULOUSE",
                        "eml": "05701",
                        "libeml": "Caméra à scintillation sans détecteur d'émission de positons",
                        "libcourteml": "Cam scin sans détect",
                        "noautor": 762218998,
                        "noautorarhgos": "02-00-000",
                        "noimplarhgos": "02-00-000",
                        "dateautor": "2004-11-02",
                        "nofinesset": "310783055",
                        "numserie": nan,
                        "marque": 0,
                        "rset": "HOPITAL DE RANGUEIL CHU TOULOUSE",
                        "datelimite": nan,
                        "indcaduc": "N",
                        "indnatlien": "J",
                        "datemeo": "2006-11-08",
                        "datefin": "2028-05-29",
                        "indrempl": nan,
                        "noautorremplacement": nan,
                        "indsup": "N",
                        "datemaj": "2022-08-24",
                    },
                    {
                        "nofinessej": 310781406,
                        "rsej": "CHU TOULOUSE",
                        "eml": "05602",
                        "libeml": "Scanographe à utilisation médicale",
                        "libcourteml": "Scanographe méd.",
                        "noautor": 762227966,
                        "noautorarhgos": "03-00-000",
                        "noimplarhgos": "03-00-000",
                        "dateautor": "2004-11-02",
                        "nofinesset": "310019351",
                        "numserie": nan,
                        "marque": 0,
                        "rset": "HOPITAL LARREY CHU TOULOUSE",
                        "datelimite": nan,
                        "indcaduc": "N",
                        "indnatlien": "J",
                        "datemeo": "2006-09-15",
                        "datefin": "2023-03-13",
                        "indrempl": nan,
                        "noautorremplacement": nan,
                        "indsup": "N",
                        "datemaj": "2022-08-24",
                    },
                ]
            ),
        )

    def test_lis_les_données_du_fichier_finess_cs1600101(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1600101_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """
            <autreactivite>
                <noautor>242202733</noautor>
                <nofinessej>370000028</nofinessej>
                <rsej>SA. CLINIQUE JEANNE D'ARC</rsej>
                <nofinesset>370000051</nofinesset>
                <rset>CLINIQUE JEANNE D'ARC - ST BENOIT</rset>
                <codeautorarhgos>04-00-000</codeautorarhgos>
                <activite>A0</activite>
                <libactivite>Installation de chirurgie esthétique</libactivite>
                <modalite>00</modalite>
                <libmodalite>Pas de modalité</libmodalite>
                <forme>01</forme>
                <libforme>Hospitalisation complète (24 heures consécutives ou plus)</libforme>
                <datedecision>2006-06-26</datedecision>
                <nodecision>0000</nodecision>
                <etatautorisation>6</etatautorisation>
                <libetatautorisation>Renouvellement tacite</libetatautorisation>
                <datevisite>2006-06-26</datevisite>
                <resultatvisite>C</resultatvisite>
                <datefin>2026-06-26</datefin>
                <datemeo>2006-06-26</datemeo>
                <datelimitemeo xsi:nil="true"/>
                <datelimitedepot>2025-10-26</datelimitedepot>
                <datelimvisite xsi:nil="true"/>
                <datemaj>2022-08-24</datemaj>
            </autreactivite>
            <autreactivite>
                <noautor>242202799</noautor>
                <nofinessej>410000087</nofinessej>
                <rsej>CH BLOIS  SIMONE VEIL</rsej>
                <nofinesset>410000020</nofinesset>
                <rset>CH BLOIS SIMONE VEIL</rset>
                <codeautorarhgos>05-00-000</codeautorarhgos>
                <activite>A5</activite>
                <libactivite>Prélèvement d'organes</libactivite>
                <modalite>31</modalite>
                <libmodalite>Multi-organes</libmodalite>
                <forme>21</forme>
                <libforme>Personne décédée assistée par ventilation mécanique et conservant une fonction hémodynamique (mort encéphalique)</libforme>
                <datedecision>2012-02-02</datedecision>
                <nodecision>2012-OSMS-006</nodecision>
                <etatautorisation>7</etatautorisation>
                <libetatautorisation>Renouvellement sur décision DGARS</libetatautorisation>
                <datevisite xsi:nil="true"/>
                <resultatvisite xsi:nil="true"/>
                <datefin>2022-02-01</datefin>
                <datemeo>2012-02-02</datemeo>
                <datelimitemeo xsi:nil="true"/>
                <datelimitedepot>2021-07-01</datelimitedepot>
                <datelimvisite xsi:nil="true"/>
                <datemaj>2022-08-24</datemaj>
            </autreactivite>""",
        )
        xpath = XPATH_FINESS_CS1600101

        # WHEN
        données_lues = lis_le_fichier_xml(
            chemin_du_fichier, xpath, type_des_colonnes_finess_cs1600101
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                [
                    {
                        "noautor": 242202733,
                        "nofinessej": 370000028,
                        "rsej": "SA. CLINIQUE JEANNE D'ARC",
                        "nofinesset": "370000051",
                        "rset": "CLINIQUE JEANNE D'ARC - ST BENOIT",
                        "codeautorarhgos": "04-00-000",
                        "activite": "A0",
                        "libactivite": "Installation de chirurgie esthétique",
                        "modalite": "00",
                        "libmodalite": "Pas de modalité",
                        "forme": "01",
                        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
                        "datedecision": "2006-06-26",
                        "nodecision": "0000",
                        "etatautorisation": 6,
                        "libetatautorisation": "Renouvellement tacite",
                        "datevisite": "2006-06-26",
                        "resultatvisite": "C",
                        "datefin": "2026-06-26",
                        "datemeo": "2006-06-26",
                        "datelimitemeo": nan,
                        "datelimitedepot": "2025-10-26",
                        "datelimvisite": nan,
                        "datemaj": "2022-08-24",
                    },
                    {
                        "noautor": 242202799,
                        "nofinessej": 410000087,
                        "rsej": "CH BLOIS  SIMONE VEIL",
                        "nofinesset": "410000020",
                        "rset": "CH BLOIS SIMONE VEIL",
                        "codeautorarhgos": "05-00-000",
                        "activite": "A5",
                        "libactivite": "Prélèvement d'organes",
                        "modalite": "31",
                        "libmodalite": "Multi-organes",
                        "forme": "21",
                        "libforme": "Personne décédée assistée par ventilation mécanique et conservant une fonction hémodynamique (mort encéphalique)",
                        "datedecision": "2012-02-02",
                        "nodecision": "2012-OSMS-006",
                        "etatautorisation": 7,
                        "libetatautorisation": "Renouvellement sur décision DGARS",
                        "datevisite": nan,
                        "resultatvisite": nan,
                        "datefin": "2022-02-01",
                        "datemeo": "2012-02-02",
                        "datelimitemeo": nan,
                        "datelimitedepot": "2021-07-01",
                        "datelimvisite": nan,
                        "datemaj": "2022-08-24",
                    },
                ]
            ),
        )

    def test_lis_les_données_du_fichier_finess_cs1600102(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1600102_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<activitesoumiseareco>
                <noautor>112234367</noautor>
                <idcpom>06-00-C0000</idcpom>
                <nofinessej>950110015</nofinessej>
                <rsej>CH  VICTOR  DUPOUY  ARGENTEUIL</rsej>
                <nofinesset>950000307</nofinesset>
                <rset>CH VICTOR DUPOUY</rset>
                <dateeffetcpom>2017-12-30</dateeffetcpom>
                <datefincpom>2022-12-29</datefincpom>
                <codeautorarhgos>06-00-RC0000</codeautorarhgos>
                <indicateurregional>N</indicateurregional>
                <activite>R4</activite>
                <libactivite>Soins palliatifs</libactivite>
                <modalite>N2</modalite>
                <libmodalite>Lits identifiés  (Médecine) - adulte</libmodalite>
                <forme>01</forme>
                <libforme>Hospitalisation complète (24 heures consécutives ou plus)</libforme>
                <dateeffetasr>2017-12-30</dateeffetasr>
                <capaciteautorisee>16</capaciteautorisee>
                <regionautorisation>11</regionautorisation>
                <etatautorisation>23</etatautorisation>
                <libetatautorisation>Initiale</libetatautorisation>
                <datemaj>2022-08-24</datemaj>
            </activitesoumiseareco>
            <activitesoumiseareco>
                <noautor>112234368</noautor>
                <idcpom>06-00-C0000</idcpom>
                <nofinessej>950110015</nofinessej>
                <rsej>CH  VICTOR  DUPOUY  ARGENTEUIL</rsej>
                <nofinesset>950000307</nofinesset>
                <rset>CH VICTOR DUPOUY</rset>
                <dateeffetcpom>2017-12-30</dateeffetcpom>
                <datefincpom>2022-12-29</datefincpom>
                <codeautorarhgos>11-11-RC61199</codeautorarhgos>
                <indicateurregional>N</indicateurregional>
                <activite>03</activite>
                <libactivite>Gynécologie, obstétrique, néonatologie, réanimation néonatale</libactivite>
                <modalite>02</modalite>
                <libmodalite>Néonatologie sans soins intensifs</libmodalite>
                <forme>01</forme>
                <libforme>Hospitalisation complète (24 heures consécutives ou plus)</libforme>
                <dateeffetasr>2017-12-30</dateeffetasr>
                <capaciteautorisee>12</capaciteautorisee>
                <regionautorisation>11</regionautorisation>
                <etatautorisation>23</etatautorisation>
                <libetatautorisation>Initiale</libetatautorisation>
                <datemaj>2022-08-24</datemaj>
            </activitesoumiseareco>""",
        )
        xpath = XPATH_FINESS_CS1600102

        # WHEN
        données_lues = lis_le_fichier_xml(
            chemin_du_fichier, xpath, type_des_colonnes_finess_cs1600102
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                [
                    {
                        "noautor": 112234367,
                        "idcpom": "06-00-C0000",
                        "nofinessej": 950110015,
                        "rsej": "CH  VICTOR  DUPOUY  ARGENTEUIL",
                        "nofinesset": "950000307",
                        "rset": "CH VICTOR DUPOUY",
                        "dateeffetcpom": "2017-12-30",
                        "datefincpom": "2022-12-29",
                        "codeautorarhgos": "06-00-RC0000",
                        "indicateurregional": "N",
                        "activite": "R4",
                        "libactivite": "Soins palliatifs",
                        "modalite": "N2",
                        "libmodalite": "Lits identifiés  (Médecine) - adulte",
                        "forme": "01",
                        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
                        "dateeffetasr": "2017-12-30",
                        "capaciteautorisee": 16,
                        "regionautorisation": 11,
                        "etatautorisation": 23,
                        "libetatautorisation": "Initiale",
                        "datemaj": "2022-08-24",
                    },
                    {
                        "noautor": 112234368,
                        "idcpom": "06-00-C0000",
                        "nofinessej": 950110015,
                        "rsej": "CH  VICTOR  DUPOUY  ARGENTEUIL",
                        "nofinesset": "950000307",
                        "rset": "CH VICTOR DUPOUY",
                        "dateeffetcpom": "2017-12-30",
                        "datefincpom": "2022-12-29",
                        "codeautorarhgos": "11-11-RC61199",
                        "indicateurregional": "N",
                        "activite": "03",
                        "libactivite": "Gynécologie, obstétrique, néonatologie, réanimation néonatale",
                        "modalite": "02",
                        "libmodalite": "Néonatologie sans soins intensifs",
                        "forme": "01",
                        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
                        "dateeffetasr": "2017-12-30",
                        "capaciteautorisee": 12,
                        "regionautorisation": 11,
                        "etatautorisation": 23,
                        "libetatautorisation": "Initiale",
                        "datemaj": "2022-08-24",
                    },
                ]
            ),
        )

    def test_lit_un_fichiers_complexe_en_stream(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/test_complexe.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """
                <parent>
                    <integer>1</integer>
                    <float>1</float>
                    <string>1</string>
                </parent>
                <parent>
                    <integer>2</integer>
                    <float>2</float>
                    <string>2</string>
                </parent>
                <parent>
                    <integer>3</integer>
                    <float>3</float>
                    <string>3</string>
                </parent>
                <parent>
                    <integer>4</integer>
                    <float>4</float>
                    <string>4</string>
                </parent>
            """,
        )
        xml_tag = "parent"
        type_de_la_colonne: Dict = {
            "integer": int,
            "float": float,
            "string": "string",
        }
        dataframe_attendue = pd.DataFrame(
            [
                {"integer": 1, "float": 1, "string": "1"},
                {"integer": 2, "float": 2, "string": "2"},
                {"integer": 3, "float": 3, "string": "3"},
                {"integer": 4, "float": 4, "string": "4"},
            ]
        )
        dataframe_attendue = dataframe_attendue.astype(type_de_la_colonne, copy=False)

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            list(type_de_la_colonne.keys()),
            type_de_la_colonne,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            dataframe_attendue,
        )

    def test_respecte_le_typage_configure_en_stream(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/test_typage.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """
                <alltype>
                    <integer>0123456789</integer>
                    <float>01.23456789</float>
                    <string>0123456789</string>
                </alltype>
            """,
        )
        xml_tag = "alltype"
        type_colonnes: Dict = {"integer": int, "float": float, "string": "string"}
        dataframe_attendue = pd.DataFrame(
            [{"integer": 123456789, "float": 1.23456789, "string": "0123456789"}]
        )
        dataframe_attendue = dataframe_attendue.astype(type_colonnes, copy=False)

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            list(type_colonnes.keys()),
            type_colonnes,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            dataframe_attendue,
        )

    def test_traite_les_valeurs_manquantes_en_stream(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/test_manquant.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """
            <parent>
                <echappe>670014604</echappe>
            </parent>
            <parent>
                <echappe xsi:nil="true" />
            </parent>""",
        )
        xml_tag = "parent"
        type_de_la_colonne: Dict = {"echappe": "string"}
        dataframe_attendue = pd.DataFrame(
            {
                "echappe": ["670014604", None],
            }
        ).astype(type_de_la_colonne, copy=False)

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            list(type_de_la_colonne.keys()),
            type_de_la_colonne,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            dataframe_attendue,
        )

    def test_traite_les_valeurs_dans_le_parent_uniquement_en_stream(self) -> None:
        # GIVEN
        chemin_du_fichier = (
            f"{self.répertoire_des_fichiers}/test_colonne_hors_parent.xml"
        )
        crée_le_fichier_xml(
            chemin_du_fichier,
            """
            <child>before</child>
            <parent>
                <child>into</child>
            </parent>
            <child>after</child>
            """,
        )
        xml_tag = "parent"
        type_de_la_colonne: Dict = {"child": "string"}
        dataframe_attendue = pd.DataFrame(
            {
                "child": ["into"],
            }
        ).astype(type_de_la_colonne, copy=False)

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            list(type_de_la_colonne.keys()),
            type_de_la_colonne,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            dataframe_attendue,
        )

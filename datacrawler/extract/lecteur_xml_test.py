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
    XML_TAG_FINESS_CS1400103,
    XML_TAG_FINESS_CS1400104,
    XML_TAG_FINESS_CS1400105,
    XML_TAG_FINESS_CS1600101,
    XML_TAG_FINESS_CS1600102,
    type_des_colonnes_finess_cs1400103,
    colonnes_à_garder_finess_cs1400103,
    type_des_colonnes_finess_cs1400104,
    colonnes_à_garder_finess_cs1400104,
    type_des_colonnes_finess_cs1400105,
    colonnes_à_garder_finess_cs1400105,
    type_des_colonnes_finess_cs1600101,
    colonnes_à_garder_finess_cs1600101,
    type_des_colonnes_finess_cs1600102,
    colonnes_à_garder_finess_cs1600102,
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
                <ta>03</ta>
                <capautot>3</capautot>
                <capinstot>3</capinstot>
                <client>020</client>
                <dateautor>2006-03-29</dateautor>
                <datederinst>2009-01-01</datederinst>
                <datemajaut>2012-05-03</datemajaut>
                <de>023</de>
                <indsupinst>O</indsupinst>
                <indsupaut>O</indsupaut>
                <libta>Hospitalisation Complète</libta>
                <libclient>Toutes Déficiences Physiques (Sans autre indication)</libclient>
                <libde>Stérilisation</libde>
                <nofinesset>070020804</nofinesset>
            </equipementsocial>""",
        )
        xml_tag = XML_TAG_FINESS_CS1400105

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            colonnes_à_garder_finess_cs1400105,
            type_des_colonnes_finess_cs1400105,
        )

        # THEN
        # On ne check pas le Dtype des colonnes car le lecteur fournis des string[python] et non des str (Object)
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                {
                    "ta": ["03"],
                    "capautot": ["3"],
                    "capinstot": ["3"],
                    "client": ["020"],
                    "dateautor": ["2006-03-29"],
                    "datederinst": ["2009-01-01"],
                    "datemajaut": ["2012-05-03"],
                    "de": ["023"],
                    "indsupinst": ["O"],
                    "indsupaut": ["O"],
                    "libta": ["Hospitalisation Complète"],
                    "libclient": [
                        "Toutes Déficiences Physiques (Sans autre indication)"
                    ],
                    "libde": ["Stérilisation"],
                    "nofinesset": ["070020804"],
                }
            ),
            check_dtype=False,
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
                <ta>21</ta>
                <capautot>3</capautot>
                <capinstot>3</capinstot>
                <client>436</client>
                <dateautor>2006-03-29</dateautor>
                <datederinst>2009-01-01</datederinst>
                <datemajaut>2012-05-03</datemajaut>
                <de>924</de>
                <indsupinst>O</indsupinst>
                <indsupaut>O</indsupaut>
                <libta>Accueil de Jour</libta>
                <libclient>Personnes Alzheimer ou maladies apparentées</libclient>
                <libde>Accueil pour Personnes Âgées</libde>
                <nofinesset>070020804</nofinesset>
            </equipementsocial>""",
        )
        xml_tag = XML_TAG_FINESS_CS1400105
        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            colonnes_à_garder_finess_cs1400105,
            type_des_colonnes_finess_cs1400105,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                {
                    "ta": ["21"],
                    "capautot": ["3"],
                    "capinstot": ["3"],
                    "client": ["436"],
                    "dateautor": ["2006-03-29"],
                    "datederinst": ["2009-01-01"],
                    "datemajaut": ["2012-05-03"],
                    "de": ["924"],
                    "indsupinst": ["O"],
                    "indsupaut": ["O"],
                    "libta": ["Accueil de Jour"],
                    "libclient": ["Personnes Alzheimer ou maladies apparentées"],
                    "libde": ["Accueil pour Personnes Âgées"],
                    "nofinesset": ["070020804"],
                }
            ),
            check_dtype=False,
        )

    def test_lis_les_données_du_fichier_finess_cs1400103(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1400103_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<activiteoffresoin>
                <activite>16</activite>
                <dateautor>2004-11-02</dateautor>
                <datefin>2027-09-23</datefin>
                <datemeo>2005-03-22</datemeo>
                <forme>00</forme>
                <libactivite>Traitement de l'insuffisance rénale chronique par épuration extrarénale</libactivite>
                <libforme>Pas de forme</libforme>
                <libmodalite>Hémodialyse en centre pour adultes</libmodalite>
                <modalite>40</modalite>
                <noautorarhgos>00-00-000</noautorarhgos>
                <nofinesset>310019351</nofinesset>
            </activiteoffresoin>
            <activiteoffresoin>
                <activite>02</activite>
                <dateautor>1998-07-07</dateautor>
                <datefin>2027-04-30</datefin>
                <datemeo>1999-11-02</datemeo>
                <forme>01</forme>
                <libactivite>Chirurgie</libactivite>
                <libforme>Hospitalisation complète (24 heures consécutives ou plus)</libforme>
                <libmodalite>Pas de modalité</libmodalite>
                <modalite>00</modalite>
                <noautorarhgos>01-00-000</noautorarhgos>
                <nofinesset>310026083</nofinesset>
            </activiteoffresoin>
            """,
        )
        xml_path = XML_TAG_FINESS_CS1400103

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_path,
            colonnes_à_garder_finess_cs1400103,
            type_des_colonnes_finess_cs1400103,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                [
                    {
                        "activite": "16",
                        "dateautor": "2004-11-02",
                        "datefin": "2027-09-23",
                        "datemeo": "2005-03-22",
                        "forme": "00",
                        "libactivite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
                        "libforme": "Pas de forme",
                        "libmodalite": "Hémodialyse en centre pour adultes",
                        "modalite": "40",
                        "noautorarhgos": "00-00-000",
                        "nofinesset": "310019351",
                    },
                    {
                        "activite": "02",
                        "dateautor": "1998-07-07",
                        "datefin": "2027-04-30",
                        "datemeo": "1999-11-02",
                        "forme": "01",
                        "libactivite": "Chirurgie",
                        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
                        "libmodalite": "Pas de modalité",
                        "modalite": "00",
                        "noautorarhgos": "01-00-000",
                        "nofinesset": "310026083",
                    },
                ]
            ),
            check_dtype=False,
        )

    def test_lis_les_données_du_fichier_finess_cs1400104(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1400104_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<equipmateriellourd>
                <dateautor>2004-11-02</dateautor>
                <datefin>2028-05-29</datefin>
                <datemeo>2006-11-08</datemeo>
                <eml>05701</eml>
                <libeml>Caméra à scintillation sans détecteur d'émission de positons</libeml>
                <noautorarhgos>02-00-000</noautorarhgos>
                <nofinesset>310783055</nofinesset>
            </equipmateriellourd>
            <equipmateriellourd>
                <dateautor>2004-11-02</dateautor>
                <datefin>2023-03-13</datefin>
                <datemeo>2006-09-15</datemeo>
                <eml>05602</eml>
                <libeml>Scanographe à utilisation médicale</libeml>
                <noautorarhgos>03-00-000</noautorarhgos>
                <nofinesset>310019351</nofinesset>
            </equipmateriellourd>""",
        )
        xml_tag = XML_TAG_FINESS_CS1400104

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            colonnes_à_garder_finess_cs1400104,
            type_des_colonnes_finess_cs1400104,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                [
                    {
                        "dateautor": "2004-11-02",
                        "datefin": "2028-05-29",
                        "datemeo": "2006-11-08",
                        "eml": "05701",
                        "libeml": "Caméra à scintillation sans détecteur d'émission de positons",
                        "noautorarhgos": "02-00-000",
                        "nofinesset": "310783055",
                    },
                    {
                        "dateautor": "2004-11-02",
                        "datefin": "2023-03-13",
                        "datemeo": "2006-09-15",
                        "eml": "05602",
                        "libeml": "Scanographe à utilisation médicale",
                        "noautorarhgos": "03-00-000",
                        "nofinesset": "310019351",
                    },
                ]
            ),
            check_dtype=False,
        )

    def test_lis_les_données_du_fichier_finess_cs1600101(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1600101_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """
            <autreactivite>
                <activite>A0</activite>
                <datedecision>2006-06-26</datedecision>
                <datefin>2026-06-26</datefin>
                <datemeo>2006-06-26</datemeo>
                <forme>01</forme>
                <libactivite>Installation de chirurgie esthétique</libactivite>
                <libforme>Hospitalisation complète (24 heures consécutives ou plus)</libforme>
                <libmodalite>Pas de modalité</libmodalite>
                <modalite>00</modalite>
                <nofinesset>370000051</nofinesset>
                <noautor>242202733</noautor>
                <nofinessej>370000028</nofinessej>
                <rsej>SA. CLINIQUE JEANNE D'ARC</rsej>
                <rset>CLINIQUE JEANNE D'ARC - ST BENOIT</rset>
                <codeautorarhgos>04-00-000</codeautorarhgos>
                <nodecision>0000</nodecision>
                <etatautorisation>6</etatautorisation>
                <libetatautorisation>Renouvellement tacite</libetatautorisation>
                <datevisite>2006-06-26</datevisite>
                <resultatvisite>C</resultatvisite>
                <datelimitemeo xsi:nil="true"/>
                <datelimitedepot>2025-10-26</datelimitedepot>
                <datelimvisite xsi:nil="true"/>
                <datemaj>2022-08-24</datemaj>
            </autreactivite>
            <autreactivite>
                <activite>A5</activite>
                <datedecision>2012-02-02</datedecision>
                <datefin>2022-02-01</datefin>
                <datemeo>2012-02-02</datemeo>
                <forme>21</forme>
                <libactivite>Prélèvement d'organes</libactivite>
                <libforme>Personne décédée assistée par ventilation mécanique et conservant une fonction hémodynamique (mort encéphalique)</libforme>
                <libmodalite>Multi-organes</libmodalite>
                <modalite>31</modalite>
                <nofinesset>410000020</nofinesset>
                <noautor>242202799</noautor>
                <nofinessej>410000087</nofinessej>
                <rsej>CH BLOIS  SIMONE VEIL</rsej>
                <rset>CH BLOIS SIMONE VEIL</rset>
                <codeautorarhgos>05-00-000</codeautorarhgos>
                <nodecision>2012-OSMS-006</nodecision>
                <etatautorisation>7</etatautorisation>
                <libetatautorisation>Renouvellement sur décision DGARS</libetatautorisation>
                <datevisite xsi:nil="true"/>
                <resultatvisite xsi:nil="true"/>
                <datelimitemeo xsi:nil="true"/>
                <datelimitedepot>2021-07-01</datelimitedepot>
                <datelimvisite xsi:nil="true"/>
                <datemaj>2022-08-24</datemaj>
            </autreactivite>""",
        )
        xml_tag = XML_TAG_FINESS_CS1600101

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            colonnes_à_garder_finess_cs1600101,
            type_des_colonnes_finess_cs1600101,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                [
                    {
                        "activite": "A0",
                        "datedecision": "2006-06-26",
                        "datefin": "2026-06-26",
                        "datemeo": "2006-06-26",
                        "forme": "01",
                        "libactivite": "Installation de chirurgie esthétique",
                        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
                        "libmodalite": "Pas de modalité",
                        "modalite": "00",
                        "nofinesset": "370000051",
                    },
                    {
                        "activite": "A5",
                        "datedecision": "2012-02-02",
                        "datefin": "2022-02-01",
                        "datemeo": "2012-02-02",
                        "forme": "21",
                        "libactivite": "Prélèvement d'organes",
                        "libforme": "Personne décédée assistée par ventilation mécanique et conservant une fonction hémodynamique (mort encéphalique)",
                        "libmodalite": "Multi-organes",
                        "modalite": "31",
                        "nofinesset": "410000020",
                    },
                ]
            ),
            check_dtype=False,
        )

    def test_lis_les_données_du_fichier_finess_cs1600102(self) -> None:
        # GIVEN
        chemin_du_fichier = f"{self.répertoire_des_fichiers}/enrichi/finess_cs1600102_stock_20211214-0346.xml"
        crée_le_fichier_xml(
            chemin_du_fichier,
            """<activitesoumiseareco>
                <activite>R4</activite>
                <capaciteautorisee>16</capaciteautorisee>
                <codeautorarhgos>06-00-RC0000</codeautorarhgos>
                <dateeffetasr>2017-12-30</dateeffetasr>
                <dateeffetcpom>2017-12-30</dateeffetcpom>
                <datefincpom>2022-12-29</datefincpom>
                <forme>01</forme>
                <idcpom>06-00-C0000</idcpom>
                <libactivite>Soins palliatifs</libactivite>
                <libforme>Hospitalisation complète (24 heures consécutives ou plus)</libforme>
                <libmodalite>Lits identifiés  (Médecine) - adulte</libmodalite>
                <modalite>N2</modalite>
                <nofinesset>950000307</nofinesset>
                <noautor>112234367</noautor>
                <nofinessej>950110015</nofinessej>
                <rsej>CH  VICTOR  DUPOUY  ARGENTEUIL</rsej>
                <rset>CH VICTOR DUPOUY</rset>
                <indicateurregional>N</indicateurregional>
                <regionautorisation>11</regionautorisation>
                <etatautorisation>23</etatautorisation>
                <libetatautorisation>Initiale</libetatautorisation>
                <datemaj>2022-08-24</datemaj>
            </activitesoumiseareco>
            <activitesoumiseareco>
                <activite>03</activite>
                <capaciteautorisee>12</capaciteautorisee>
                <codeautorarhgos>11-11-RC61199</codeautorarhgos>
                <dateeffetasr>2017-12-30</dateeffetasr>
                <dateeffetcpom>2017-12-30</dateeffetcpom>
                <datefincpom>2022-12-29</datefincpom>
                <forme>01</forme>
                <idcpom>06-00-C0000</idcpom>
                <libactivite>Gynécologie, obstétrique, néonatologie, réanimation néonatale</libactivite>
                <libforme>Hospitalisation complète (24 heures consécutives ou plus)</libforme>
                <libmodalite>Néonatologie sans soins intensifs</libmodalite>
                <modalite>02</modalite>
                <nofinesset>950000307</nofinesset>
                <noautor>112234368</noautor>
                <nofinessej>950110015</nofinessej>
                <rsej>CH  VICTOR  DUPOUY  ARGENTEUIL</rsej>
                <rset>CH VICTOR DUPOUY</rset>
                <indicateurregional>N</indicateurregional>
                <regionautorisation>11</regionautorisation>
                <etatautorisation>23</etatautorisation>
                <libetatautorisation>Initiale</libetatautorisation>
                <datemaj>2022-08-24</datemaj>
            </activitesoumiseareco>""",
        )
        xml_tag = XML_TAG_FINESS_CS1600102

        # WHEN
        données_lues = lis_le_fichier_xml_en_stream(
            self.logger,
            chemin_du_fichier,
            xml_tag,
            colonnes_à_garder_finess_cs1600102,
            type_des_colonnes_finess_cs1600102,
        )

        # THEN
        pd.testing.assert_frame_equal(
            données_lues,
            pd.DataFrame(
                [
                    {
                        "activite": "R4",
                        "capaciteautorisee": "16",
                        "codeautorarhgos": "06-00-RC0000",
                        "dateeffetasr": "2017-12-30",
                        "dateeffetcpom": "2017-12-30",
                        "datefincpom": "2022-12-29",
                        "forme": "01",
                        "idcpom": "06-00-C0000",
                        "libactivite": "Soins palliatifs",
                        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
                        "libmodalite": "Lits identifiés  (Médecine) - adulte",
                        "modalite": "N2",
                        "nofinesset": "950000307",
                    },
                    {
                        "activite": "03",
                        "capaciteautorisee": "12",
                        "codeautorarhgos": "11-11-RC61199",
                        "dateeffetasr": "2017-12-30",
                        "dateeffetcpom": "2017-12-30",
                        "datefincpom": "2022-12-29",
                        "forme": "01",
                        "idcpom": "06-00-C0000",
                        "libactivite": "Gynécologie, obstétrique, néonatologie, réanimation néonatale",
                        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
                        "libmodalite": "Néonatologie sans soins intensifs",
                        "modalite": "02",
                        "nofinesset": "950000307",
                    },
                ]
            ),
            check_dtype=False,
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

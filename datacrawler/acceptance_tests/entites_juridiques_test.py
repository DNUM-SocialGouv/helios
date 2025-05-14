from pathlib import Path
import pandas as pd

from datacrawler.load.nom_des_tables import TABLE_ENTITES_JURIDIQUES
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger
)
from datacrawler.import_les_entites_juridiques import import_entites_juridiques
from datacrawler.test_helpers.helios_builder import helios_entite_juridique_builder

class TestSauvegardeLesEntitesJuridiques:
    def test_import_entites_juridiques(self, tmp_path: Path) -> None:
        # GIVEN - Create test XML files
        ej_xml = tmp_path / "finess_cs1400101_stock_20211214-0333.xml"
        ej_xml.write_text("""<?xml version="1.0" encoding="UTF-8"?>
<fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <structureej>
        <nofiness>010008407</nofiness>
        <rs>MAISON DE RETRAITE - DIVONNE-LES-BAINS</rs>
        <rslongue>MAISON DE RETRAITE - DIVONNE-LES-BAINS</rslongue>
        <complrs xsi:nil="true"/>
        <numvoie>240</numvoie>
        <typvoie>R</typvoie>
        <voie>GUY DE MAUPASSANT</voie>
        <compvoie xsi:nil="true"/>
        <compldistrib xsi:nil="true"/>
        <lieuditbp>CS 20100</lieuditbp>
        <libellepays xsi:nil="true"/>
        <commune>283</commune>
        <ligneacheminement>01220 DIVONNE LES BAINS</ligneacheminement>
        <libcommune>DIVONNE LES BAINS</libcommune>
        <departement>01</departement>
        <libdepartement>AIN</libdepartement>
        <codepostal>01117</codepostal>
        <codepays xsi:nil="true"/>
        <telephone>0450201235</telephone>
        <telecopie>0474731002</telecopie>
        <statutjuridique>14</statutjuridique>
        <libstatutjuridique>Etb.Social Communal</libstatutjuridique>
        <libcourtstatutjuridique>Etb.Pub.Intcom.Hosp.</libcourtstatutjuridique>
        <categetab>355</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <siren>260214644</siren>
        <datemodifsiren>2011-02-07</datemodifsiren>
        <originemodifsiren>RMESSMAIA_AUTO</originemodifsiren>
        <codeape>8730A</codeape>
        <datecrea>2009-01-01</datecrea>
        <datemaj>2020-02-04</datemaj>
        <datefermeture xsi:nil="true"/>
        <typefermeture xsi:nil="true"/>
        <qualifcreation>GEN</qualifcreation>
    </structureej>
</fluxfiness>
        """)
        cat_xml = tmp_path / "finess_cs1500107_stock_20230202-03335.xml"
        cat_xml.write_text("""<?xml version="1.0" encoding="UTF-8"?>
<fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <horodatage>
        <emetteur>finess</emetteur>
        <destinataire>finess</destinataire>
        <versionmessage>1</versionmessage>
        <fluxnum>1300</fluxnum>
        <datemaj>2023-02-02</datemaj>
    </horodatage>
    <nomenclstatutavecagr>
        <code>14</code>
        <libelle>Etat</libelle>
        <libellecourt>Etat</libellecourt>
        <datedeb>1979-01-01</datedeb>
        <datefin xsi:nil="true"/>
        <codeagr3>1110</codeagr3>
        <libelleagr3>Etat</libelleagr3>
        <libellecourtagr3>Etat</libellecourtagr3>
        <codeagr2>1100</codeagr2>
        <libelleagr2>Etat et Collectivités Territoriales</libelleagr2>
        <libellecourtagr2>Etat &amp; Col.Territ.</libellecourtagr2>
        <codeagr1>1000</codeagr1>
        <libelleagr1>Organismes et Etablissements Publics</libelleagr1>
        <libellecourtagr1>Orga Etab. Publics</libellecourtagr1>
    </nomenclstatutavecagr>
    <nomenclstatutavecagr>
        <code>02</code>
        <libelle>Département</libelle>
        <libellecourt>Département</libellecourt>
        <datedeb>1979-01-01</datedeb>
        <datefin xsi:nil="true"/>
        <codeagr3>1120</codeagr3>
        <libelleagr3>Collectivité Territoriale</libelleagr3>
        <libellecourtagr3>Col. Territoriale</libellecourtagr3>
        <codeagr2>1100</codeagr2>
        <libelleagr2>Etat et Collectivités Territoriales</libelleagr2>
        <libellecourtagr2>Etat &amp; Col.Territ.</libellecourtagr2>
        <codeagr1>1000</codeagr1>
        <libelleagr1>Organismes et Etablissements Publics</libelleagr1>
        <libellecourtagr1>Orga Etab. Publics</libellecourtagr1>
    </nomenclstatutavecagr>
</fluxfiness>
        """)
        # WHEN
        import_entites_juridiques(
            str(ej_xml),
            str(cat_xml),
            base_de_données_test,
            mocked_logger
        )
        # THEN
        entites_juridiques_attendues = pd.DataFrame([helios_entite_juridique_builder()])
        entites_juridiques_sauvegardees = pd.read_sql(TABLE_ENTITES_JURIDIQUES, base_de_données_test)
        entites_juridiques_sauvegardees = entites_juridiques_sauvegardees.drop('termes_de_recherche', axis=1)
        pd.testing.assert_frame_equal(entites_juridiques_attendues.sort_index(axis=1), entites_juridiques_sauvegardees.sort_index(axis=1), check_dtype=False)

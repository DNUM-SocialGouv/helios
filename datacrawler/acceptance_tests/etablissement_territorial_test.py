from pathlib import Path
import pandas as pd

from datacrawler.load.nom_des_tables import TABLE_ETABLISSEMENTS_TERRITORIAUX, TABLE_ENTITES_JURIDIQUES
from datacrawler.test_helpers import (
    base_de_données_test,
    mocked_logger,
    supprime_les_données_des_tables
)
from datacrawler.import_les_etablissements_territoriaux import import_etablissements_territoriaux
from datacrawler.test_helpers.helios_builder import (
    helios_etablissement_territorial_builder,
    helios_entite_juridique_builder
)

class TestSauvegardeLesEtablissementsTerritoriaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)
    def test_import_etablissements_territoriaux(self, tmp_path: Path) -> None:
        # GIVEN - Create test XML files
        et_xml = tmp_path / "finess_cs1400102_stock_20211214-0333.xml"
        et_xml.write_text("""<?xml version="1.0" encoding="UTF-8"?>
<fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
     <structureet>
        <nofinesset>010005239</nofinesset>
        <nofinessej>010008407</nofinessej>
        <rs>MAISON DE RETRAITE - DIVONNE-LES-BAINS</rs>
        <rslongue>MAISON DE RETRAITE - DIVONNE-LES-BAINS</rslongue>
        <complrs xsi:nil="true"/>
        <compldistrib xsi:nil="true"/>
        <numvoie>240</numvoie>
        <typvoie>R</typvoie>
        <voie>GUY DE MAUPASSANT</voie>
        <compvoie xsi:nil="true"/>
        <lieuditbp xsi:nil="true"/>
        <commune>451</commune>
        <libcommune>DIVONNE LES BAINS</libcommune>
        <departement>01</departement>
        <libdepartement>AIN</libdepartement>
        <codepostal>01440</codepostal>
        <ligneacheminement>01220 DIVONNE LES BAINS</ligneacheminement>
        <codepays xsi:nil="true"/>
        <libellepays xsi:nil="true"/>
        <telephone>0450201235</telephone>
        <telecopie>0474454114</telecopie>
        <courriel>test@test.fr</courriel>
        <categetab>355</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <libcategagretab>Centres Hospitaliers</libcategagretab>
        <libcourtcategagretab>Centres Hospitaliers</libcourtcategagretab>
        <typeet>P</typeet>
        <nofinessppal xsi:nil="true"/>
        <natureet>G</natureet>
        <siret>260214644</siret>
        <datemodifsiret>2011-02-07</datemodifsiret>
        <originemodifsiret>RMESSMAIA_AUTO</originemodifsiret>
        <codeape>8610Z</codeape>
        <codemft>03</codemft>
        <libmft>ARS établissements Publics de santé dotation globale</libmft>
        <libcourtmft>ARS / DG EPS</libcourtmft>
        <codesph>1</codesph>
        <libsph>Etablissement public de santé</libsph>
        <libcourtsph>Etab.public de santé</libcourtsph>
        <dateouv>2009-01-01</dateouv>
        <datelimite xsi:nil="true"/>
        <indcaduc xsi:nil="true"/>
        <typefermeture xsi:nil="true"/>
        <datefermeture xsi:nil="true"/>
        <dateautor>1979-02-13</dateautor>
        <datemaj>2020-02-04</datemaj>
        <numuai xsi:nil="true"/>
    </structureet>
</fluxfiness>
        """)
        cat_xml = tmp_path / "finess_cs1500106_stock_20230202-03335.xml"
        cat_xml.write_text("""<?xml version="1.0" encoding="UTF-8"?>
<fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <horodatage>
        <emetteur>finess</emetteur>
        <destinataire>finess</destinataire>
        <versionmessage>1</versionmessage>
        <fluxnum>1300</fluxnum>
        <datemaj>2023-02-02</datemaj>
    </horodatage>
       <nomenclcategorieETavecagr>
        <code>412</code>
        <libelle>Appartement Thérapeutique</libelle>
        <libellecourt>Appart.Thérapeutique</libellecourt>
        <domaine>SAN</domaine>
        <datedeb>1979-01-01</datedeb>
        <datefin xsi:nil="true"/>
        <codeagr3>1111</codeagr3>
        <libelleagr3>Autres Etablissements de Lutte contre les Maladies Mentales</libelleagr3>
        <libellecourtagr3>Autres Etab.Lut.Ment</libellecourtagr3>
        <codeagr2>1100</codeagr2>
        <libelleagr2>Etablissements Hospitaliers</libelleagr2>
        <libellecourtagr2>Etab.Hospitaliers</libellecourtagr2>
        <codeagr1>1000</codeagr1>
        <libelleagr1>Etablissements Relevant de la Loi Hospitalière</libelleagr1>
        <libellecourtagr1>Etab.Loi Hospital.</libellecourtagr1>
    </nomenclcategorieETavecagr>
     <nomenclcategorieETavecagr>
        <code>355</code>
        <libelle>Centre Hospitalier (C.H.)</libelle>
        <libellecourt>C.H.</libellecourt>
        <domaine>SAN</domaine>
        <datedeb>1979-01-01</datedeb>
        <datefin xsi:nil="true"/>
        <codeagr3>1102</codeagr3>
        <libelleagr3>Centres Hospitaliers</libelleagr3>
        <libellecourtagr3>Centres Hospitaliers</libellecourtagr3>
        <codeagr2>1100</codeagr2>
        <libelleagr2>Etablissements Hospitaliers</libelleagr2>
        <libellecourtagr2>Etab.Hospitaliers</libellecourtagr2>
        <codeagr1>1000</codeagr1>
        <libelleagr1>Etablissements Relevant de la Loi Hospitalière</libelleagr1>
        <libellecourtagr1>Etab.Loi Hospital.</libellecourtagr1>
    </nomenclcategorieETavecagr>
</fluxfiness>
        """)
        entite_juridique = pd.DataFrame([helios_entite_juridique_builder()])
        with base_de_données_test.begin() as connection:
            entite_juridique.to_sql(TABLE_ENTITES_JURIDIQUES, connection, if_exists="append", index=False)
        # WHEN
        import_etablissements_territoriaux(
            str(et_xml),
            str(cat_xml),
            base_de_données_test,
            mocked_logger
        )
        # THEN
        etablissements_territoriaux_attendus = pd.DataFrame([helios_etablissement_territorial_builder()])
        etablissements_territoriaux_sauvegardes = pd.read_sql(TABLE_ETABLISSEMENTS_TERRITORIAUX, base_de_données_test)
        etablissements_territoriaux_sauvegardes = etablissements_territoriaux_sauvegardes.drop('termes_de_recherche', axis=1)
        pd.testing.assert_frame_equal(etablissements_territoriaux_attendus.sort_index(axis=1),
                                      etablissements_territoriaux_sauvegardes.sort_index(axis=1),
                                      check_dtype=False)

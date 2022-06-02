import { mkdirSync, rmSync, writeFileSync } from 'fs'

import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { getFakeDataCrawlerDependencies } from '../../../testHelper'
import { NodeXmlToJs } from '../xml-to-js/NodeXmlToJs'
import { FinessXmlÉtablissementTerritorialLoader } from './FinessXmlÉtablissementTerritorialLoader'

describe('Récupération des établissements territoriaux de la source de données FINESS', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()
  const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`
  const finessLocalPath = `${localPath}/finess/simple`
  const nomenclatureLocalPath = `${localPath}/finess/nomenclature`

  beforeEach(() => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <structureet>
        <nofinesset>010000040</nofinesset>
        <nofinessej>010008407</nofinessej>
        <rs>CH NANTUA</rs>
        <rslongue>CENTRE HOSPITALIER NANTUA</rslongue>
        <complrs xsi:nil="true"/>
        <compldistrib xsi:nil="true"/>
        <numvoie>50</numvoie>
        <typvoie>R</typvoie>
        <voie>PAUL PAINLEVE</voie>
        <compvoie xsi:nil="true"/>
        <lieuditbp>BP 116</lieuditbp>
        <commune>269</commune>
        <libcommune>NANTUA</libcommune>
        <departement>01</departement>
        <libdepartement>AIN</libdepartement>
        <codepostal>01130</codepostal>
        <ligneacheminement>01130 NANTUA</ligneacheminement>
        <codepays xsi:nil="true"/>
        <libellepays xsi:nil="true"/>
        <telephone>0474754800</telephone>
        <telecopie>0774750663</telecopie>
        <courriel xsi:nil="true"/>
        <categetab>355</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <libcategagretab>Centres Hospitaliers</libcategagretab>
        <libcourtcategagretab>Centres Hospitaliers</libcourtcategagretab>
        <typeet>S</typeet>
        <nofinessppal>010000057</nofinessppal>
        <natureet>G</natureet>
        <siret>26011021800047</siret>
        <datemodifsiret>2009-01-01</datemodifsiret>
        <originemodifsiret>SAISIE</originemodifsiret>
        <codeape xsi:nil="true"/>
        <codemft>03</codemft>
        <libmft>ARS établissements Publics de santé dotation globale</libmft>
        <libcourtmft>ARS / DG EPS</libcourtmft>
        <codesph>1</codesph>
        <libsph>Etablissement public de santé</libsph>
        <libcourtsph>Etab.public de santé</libcourtsph>
        <dateouv>1901-01-01</dateouv>
        <datelimite xsi:nil="true"/>
        <indcaduc xsi:nil="true"/>
        <typefermeture>DEF</typefermeture>
        <datefermeture>2007-04-20</datefermeture>
        <dateautor>1901-01-01</dateautor>
        <datemaj>2008-01-17</datemaj>
        <numuai xsi:nil="true"/>
      </structureet>
      <structureet>
        <nofinesset>010000057</nofinesset>
        <nofinessej>010008407</nofinessej>
        <rs>CH OYONNAX</rs>
        <rslongue>CENTRE HOSPITALIER OYONNAX</rslongue>
        <complrs xsi:nil="true"/>
        <compldistrib xsi:nil="true"/>
        <numvoie xsi:nil="true"/>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <compvoie xsi:nil="true"/>
        <lieuditbp xsi:nil="true"/>
        <commune>283</commune>
        <libcommune>OYONNAX</libcommune>
        <departement>01</departement>
        <libdepartement>AIN</libdepartement>
        <codepostal>01100</codepostal>
        <ligneacheminement>01100 OYONNAX</ligneacheminement>
        <codepays xsi:nil="true"/>
        <libellepays xsi:nil="true"/>
        <telephone>0474731001</telephone>
        <telecopie>0774731002</telecopie>
        <courriel xsi:nil="true"/>
        <categetab>111</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <libcategagretab>Centres Hospitaliers</libcategagretab>
        <libcourtcategagretab>Centres Hospitaliers</libcourtcategagretab>
        <typeet>S</typeet>
        <nofinessppal>010005239</nofinessppal>
        <natureet>G</natureet>
        <siret>26011021800013</siret>
        <datemodifsiret>2009-01-01</datemodifsiret>
        <originemodifsiret>SAISIE</originemodifsiret>
        <codeape xsi:nil="true"/>
        <codemft>03</codemft>
        <libmft>ARS établissements Publics de santé dotation globale</libmft>
        <libcourtmft>ARS / DG EPS</libcourtmft>
        <codesph>1</codesph>
        <libsph>Etablissement public de santé</libsph>
        <libcourtsph>Etab.public de santé</libcourtsph>
        <dateouv>1901-01-01</dateouv>
        <datelimite xsi:nil="true"/>
        <indcaduc xsi:nil="true"/>
        <typefermeture>DEF</typefermeture>
        <datefermeture>2007-04-20</datefermeture>
        <dateautor>1901-01-01</dateautor>
        <datemaj>2018-10-26</datemaj>
        <numuai xsi:nil="true"/>
      </structureet>
    </fluxfiness>`
    mkdirSync(finessLocalPath, { recursive: true })
    writeFileSync(`${finessLocalPath}/finess_cs1400102_stock_20211214-0336.xml`, xml)

    mkdirSync(nomenclatureLocalPath, { recursive: true })
    const xmlNomenclature = `<?xml version="1.0" encoding="UTF-8"?>
    <fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
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
      <nomenclcategorieETavecagr>
        <code>111</code>
        <libelle>Centre Hospitalier (C.H.)</libelle>
        <libellecourt>C.H.</libellecourt>
        <domaine>SOC</domaine>
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
    </fluxfiness>`
    writeFileSync(`${nomenclatureLocalPath}/finess_cs1500106_stock_20211214-0417.xml`, xmlNomenclature)
  })

  afterEach(() => {
    rmSync(localPath, { recursive: true })
  })

  it('récupère les établissements territoriaux de la source de données FINESS', () => {
    // WHEN
    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialLoader(new NodeXmlToJs(), localPath)
    const établissementsTerritoriaux = établissementTerritorialFinessLoader.récupèreLesÉtablissementsTerritoriaux()

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual<ÉtablissementTerritorialIdentité[]>(
      [
        {
          adresseAcheminement: '01130 NANTUA',
          adresseNuméroVoie: '50',
          adresseTypeVoie: 'R',
          adresseVoie: 'PAUL PAINLEVE',
          catégorieÉtablissement: '355',
          courriel: '',
          dateMiseAJourSource: '20211214',
          domaine: DomaineÉtablissementTerritorial.SANITAIRE,
          libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
          numéroFinessEntitéJuridique: '010008407',
          numéroFinessÉtablissementPrincipal: '010000057',
          numéroFinessÉtablissementTerritorial: '010000040',
          raisonSociale: 'CH NANTUA',
          typeÉtablissement: 'S',
          téléphone: '0474754800',
        },
        {
          adresseAcheminement: '01100 OYONNAX',
          adresseNuméroVoie: '',
          adresseTypeVoie: 'RTE',
          adresseVoie: 'DE VEYZIAT',
          catégorieÉtablissement: '111',
          courriel: '',
          dateMiseAJourSource: '20211214',
          domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
          libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
          numéroFinessEntitéJuridique: '010008407',
          numéroFinessÉtablissementPrincipal: '010005239',
          numéroFinessÉtablissementTerritorial: '010000057',
          raisonSociale: 'CH OYONNAX',
          typeÉtablissement: 'S',
          téléphone: '0474731001',
        },
      ]
    )
  })
})

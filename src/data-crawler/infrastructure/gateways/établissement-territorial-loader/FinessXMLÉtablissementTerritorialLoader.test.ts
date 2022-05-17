import { mkdirSync, rmSync, writeFileSync } from 'fs'

import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { getFakeDataCrawlerDependencies } from '../../../testHelper'
import { NodeXmlToJs } from '../xml-to-js/NodeXmlToJs'
import { FinessXMLÉtablissementTerritorialLoader } from './FinessXMLÉtablissementTerritorialLoader'

describe('Récupération des établissements territoriaux de la source de données FINESS', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()
  const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`
  const finessLocalPath = `${localPath}/finess/simple`

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
        <categetab>355</categetab>
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
  })

  afterEach(() => {
    rmSync(localPath, { recursive: true })
  })

  it('récupérer les établissements territoriaux de la source de données FINESS', () => {
    // WHEN
    const établissementTerritorialFinessLoader = new FinessXMLÉtablissementTerritorialLoader(new NodeXmlToJs(), localPath)
    const établissementsTerritoriaux = établissementTerritorialFinessLoader.récupérerLesÉtablissementsTerritoriaux()

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
          catégorieÉtablissement: '355',
          courriel: '',
          dateMiseAJourSource: '20211214',
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

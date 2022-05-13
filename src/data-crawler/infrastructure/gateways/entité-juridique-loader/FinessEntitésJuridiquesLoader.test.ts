import { mkdirSync, rmSync, writeFileSync } from 'fs'

import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { fakeDataCrawlerDependencies } from '../../../testHelper'
import { NodeXmlToJs } from '../xml-to-js/NodeXmlToJs'
import { FinessEntitéJuridiqueLoader } from './FinessEntitéJuridiqueLoader'

describe('Récupération des entités juridiques de la source de données FINESS', () => {
  const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_ej`
  const finessLocalPath = `${localPath}/finess/simple`

  beforeEach(() => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <structureej>
        <nofiness>010008407</nofiness>
        <rs>CH DU HAUT BUGEY</rs>
        <rslongue>CENTRE HOSPITALIER DU HAUT BUGEY</rslongue>
        <complrs xsi:nil="true"/>
        <numvoie>1</numvoie>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <compvoie xsi:nil="true"/>
        <compldistrib xsi:nil="true"/>
        <lieuditbp>CS 20100</lieuditbp>
        <libellepays xsi:nil="true"/>
        <commune>283</commune>
        <ligneacheminement>01117 OYONNAX CEDEX</ligneacheminement>
        <libcommune>OYONNAX</libcommune>
        <departement>01</departement>
        <libdepartement>AIN</libdepartement>
        <codepostal>01117</codepostal>
        <codepays xsi:nil="true"/>
        <telephone>0474731001</telephone>
        <telecopie>0474731002</telecopie>
        <statutjuridique>14</statutjuridique>
        <libstatutjuridique>Etablissement Public Intercommunal d'Hospitalisation</libstatutjuridique>
        <libcourtstatutjuridique>Etb.Pub.Intcom.Hosp.</libcourtstatutjuridique>
        <categetab>355</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <siren>260110218</siren>
        <datemodifsiren>2011-02-07</datemodifsiren>
        <originemodifsiren>RMESSMAIA_AUTO</originemodifsiren>
        <codeape>8730A</codeape>
        <datecrea>2001-01-01</datecrea>
        <datemaj>2020-02-04</datemaj>
        <datefermeture xsi:nil="true"/>
        <typefermeture xsi:nil="true"/>
        <qualifcreation>GEN</qualifcreation>
      </structureej>
      <structureej>
        <nofiness>590000741</nofiness>
        <rs>HOPITAL PRIVE DE VILLENEUVE D'ASCQ</rs>
        <rslongue>HOPITAL PRIVE DE VILLENEUVE D'ASCQ</rslongue>
        <complrs xsi:nil="true"/>
        <numvoie>20</numvoie>
        <typvoie>AV</typvoie>
        <voie>DE LA RECONNAISSANCE</voie>
        <compvoie xsi:nil="true"/>
        <compldistrib xsi:nil="true"/>
        <lieuditbp>QUARTIER DU RECUEIL</lieuditbp>
        <libellepays xsi:nil="true"/>
        <commune>009</commune>
        <ligneacheminement>59650 VILLENEUVE D ASCQ</ligneacheminement>
        <libcommune>VILLENEUVE D ASCQ</libcommune>
        <departement>59</departement>
        <libdepartement>NORD</libdepartement>
        <codepostal>59650</codepostal>
        <codepays xsi:nil="true"/>
        <telephone>0826666900</telephone>
        <telecopie>0320995678</telecopie>
        <statutjuridique>73</statutjuridique>
        <libstatutjuridique>Société Anonyme (S.A.)</libstatutjuridique>
        <libcourtstatutjuridique>Société Anonyme</libcourtstatutjuridique>
        <categetab xsi:nil="true"/>
        <libcategetab xsi:nil="true"/>
        <libcourtcategetab xsi:nil="true"/>
        <siren>476780333</siren>
        <datemodifsiren>2012-09-26</datemodifsiren>
        <originemodifsiren>SIRETISATION</originemodifsiren>
        <codeape>8610Z</codeape>
        <datecrea>2001-01-01</datecrea>
        <datemaj>2012-09-14</datemaj>
        <datefermeture xsi:nil="true"/>
        <typefermeture xsi:nil="true"/>
        <qualifcreation>GEN</qualifcreation>
      </structureej>
    </fluxfiness>`
    mkdirSync(finessLocalPath, { recursive: true })
    writeFileSync(`${finessLocalPath}/finess_cs1400101_stock_20211214-0333.xml`, xml)
  })

  afterEach(() => {
    rmSync(localPath, { recursive: true })
  })

  it('récupérer les entités juridiques de la source de données FINESS', () => {
    // WHEN
    const entitéJuridiqueFinessLoader = new FinessEntitéJuridiqueLoader(new NodeXmlToJs(), localPath)
    const entitésJuridiques = entitéJuridiqueFinessLoader.récupérerLesEntitésJuridiques()

    // THEN
    expect(entitésJuridiques).toStrictEqual<EntitéJuridique[]>(
      [
        {
          adresseAcheminement: '01117 OYONNAX CEDEX',
          adresseNuméroVoie: '1',
          adresseTypeVoie: 'RTE',
          adresseVoie: 'DE VEYZIAT',
          dateMiseAJourSource: '20211214',
          libelléStatutJuridique: "Etablissement Public Intercommunal d'Hospitalisation",
          numéroFinessEntitéJuridique: '010008407',
          raisonSociale: 'CH DU HAUT BUGEY',
          téléphone: '0474731001',
        },
        {
          adresseAcheminement: '59650 VILLENEUVE D ASCQ',
          adresseNuméroVoie: '20',
          adresseTypeVoie: 'AV',
          adresseVoie: 'DE LA RECONNAISSANCE',
          dateMiseAJourSource: '20211214',
          libelléStatutJuridique: 'Société Anonyme (S.A.)',
          numéroFinessEntitéJuridique: '590000741',
          raisonSociale: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
          téléphone: '0826666900',
        },
      ]
    )
  })
})

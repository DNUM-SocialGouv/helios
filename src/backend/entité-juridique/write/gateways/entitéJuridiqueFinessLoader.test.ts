import { mkdirSync, rmSync, writeFileSync } from 'fs'

import { environmentVariables } from '../../../../../tests/testHelper'
import { convertXmlToJs } from '../../../shared/gateways/xml-to-js/convertXmlToJs'
import { EntitéJuridique } from '../entities/EntitéJuridique'
import { récupérerLesEntitésJuridiquesLoader } from './entitéJuridiqueFinessLoader'

describe('Récupération des entités juridiques de la source de données FINESS', () => {
  const chemin = `${environmentVariables.SFTP_LOCAL_PATH}/finess/simple`

  beforeEach(() => {
    const contenuXML = `<?xml version="1.0" encoding="UTF-8"?>
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
    mkdirSync(chemin, { recursive: true })
    writeFileSync(`${chemin}/finess_cs1400101_stock_20211214-0333.xml`, contenuXML)
  })

  afterEach(() => {
    rmSync(chemin, { recursive: true })
  })

  it('récupérer les entités juridiques de la source de données FINESS', () => {
    // GIVEN
    const localPath = environmentVariables.SFTP_LOCAL_PATH

    // WHEN
    const entitéJuridique = récupérerLesEntitésJuridiquesLoader(convertXmlToJs, localPath)

    // THEN
    expect(entitéJuridique).toStrictEqual<EntitéJuridique[]>(
      [
        {
          catégorieÉtablissement: '355',
          codeApe: '8730A',
          codePays: '',
          codePostal: '01117',
          commune: '283',
          complémentDistribution: '',
          complémentRaisonSociale: '',
          complémentVoie: '',
          dateCréation: '2001-01-01',
          dateFermeture: '',
          dateMiseAJour: '2020-02-04',
          dateMiseAJourSource: '20211214',
          dateModificationSiren: '2011-02-07',
          département: '01',
          libelléCatégoriÉtablissement: 'Centre Hospitalier (C.H.)',
          libelléCommune: 'OYONNAX',
          libelléCourtCatégoriÉtablissement: 'C.H.',
          libelléCourtStatutJuridique: 'Etb.Pub.Intcom.Hosp.',
          libelléDépartement: 'AIN',
          libelléPays: '',
          libelléStatutJuridique: "Etablissement Public Intercommunal d'Hospitalisation",
          lieuDitBoîtePostale: 'CS 20100',
          ligneAcheminement: '01117 OYONNAX CEDEX',
          numéroFiness: '010008407',
          numéroVoie: '1',
          origineModificationSiren: 'RMESSMAIA_AUTO',
          qualificationCréation: 'GEN',
          raisonSociale: 'CH DU HAUT BUGEY',
          raisonSocialeLongue: 'CENTRE HOSPITALIER DU HAUT BUGEY',
          siren: '260110218',
          statutJuridique: '14',
          typeFermeture: '',
          typeVoie: 'RTE',
          télécopie: '0474731002',
          téléphone: '0474731001',
          voie: 'DE VEYZIAT',
        },
        {
          catégorieÉtablissement: '',
          codeApe: '8610Z',
          codePays: '',
          codePostal: '59650',
          commune: '009',
          complémentDistribution: '',
          complémentRaisonSociale: '',
          complémentVoie: '',
          dateCréation: '2001-01-01',
          dateFermeture: '',
          dateMiseAJour: '2012-09-14',
          dateMiseAJourSource: '20211214',
          dateModificationSiren: '2012-09-26',
          département: '59',
          libelléCatégoriÉtablissement: '',
          libelléCommune: 'VILLENEUVE D ASCQ',
          libelléCourtCatégoriÉtablissement: '',
          libelléCourtStatutJuridique: 'Société Anonyme',
          libelléDépartement: 'NORD',
          libelléPays: '',
          libelléStatutJuridique: 'Société Anonyme (S.A.)',
          lieuDitBoîtePostale: 'QUARTIER DU RECUEIL',
          ligneAcheminement: '59650 VILLENEUVE D ASCQ',
          numéroFiness: '590000741',
          numéroVoie: '20',
          origineModificationSiren: 'SIRETISATION',
          qualificationCréation: 'GEN',
          raisonSociale: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
          raisonSocialeLongue: "HOPITAL PRIVE DE VILLENEUVE D'ASCQ",
          siren: '476780333',
          statutJuridique: '73',
          typeFermeture: '',
          typeVoie: 'AV',
          télécopie: '0320995678',
          téléphone: '0826666900',
          voie: 'DE LA RECONNAISSANCE',
        },
      ]
    )
  })
})

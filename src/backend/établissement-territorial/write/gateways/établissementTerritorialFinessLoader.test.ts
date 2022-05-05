import { mkdirSync, rmSync, writeFileSync } from 'fs'

import { environmentVariables } from '../../../../../tests/testHelper'
import { convertXmlToJs } from '../../../shared/gateways/xml-to-js/convertXmlToJs'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorial'
import { récupérerLesÉtablissementsTerritoriauxLoader } from './établissementTerritorialFinessLoader'

describe('Récupération des établissements territoriaux de la source de données FINESS', () => {
  const chemin = `${environmentVariables.SFTP_LOCAL_PATH}/finess/simple`

  beforeEach(() => {
    const contenuXML = `<?xml version="1.0" encoding="UTF-8"?>
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
    mkdirSync(chemin, { recursive: true })
    writeFileSync(`${chemin}/finess_cs1400102_stock_20211214-0336.xml`, contenuXML)
  })

  afterEach(() => {
    rmSync(chemin, { recursive: true })
  })

  it('récupérer les établissements territoriaux de la source de données FINESS', () => {
    // GIVEN
    const localPath = environmentVariables.SFTP_LOCAL_PATH

    // WHEN
    const établissementsTerritoriaux = récupérerLesÉtablissementsTerritoriauxLoader(convertXmlToJs, localPath)

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual<ÉtablissementTerritorialIdentité[]>(
      [
        {
          catégorieAgrégatÉtablissement: '1102',
          catégorieÉtablissement: '355',
          codeApe: '',
          codeMft: '03',
          codePays: '',
          codePostal: '01130',
          codeSph: '1',
          commune: '269',
          complémentDistribution: '',
          complémentRaisonSociale: '',
          complémentVoie: '',
          courriel: '',
          dateAutorisation: '1901-01-01',
          dateCaducité: '',
          dateFermeture: '2007-04-20',
          dateMaj: '2008-01-17',
          dateMiseAJourSource: '20211214',
          dateModificationSiret: '2009-01-01',
          dateOuverture: '1901-01-01',
          département: '01',
          indicateurCaducité: '',
          libelléCatégorieAgrégatÉtablissement: 'Centres Hospitaliers',
          libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
          libelléCommune: 'NANTUA',
          libelléCourtCatégorieAgrégatÉtablissement: 'Centres Hospitaliers',
          libelléCourtCatégorieÉtablissement: 'C.H.',
          libelléCourtMft: 'ARS / DG EPS',
          libelléCourtSph: 'Etab.public de santé',
          libelléDépartement: 'AIN',
          libelléMft: 'ARS établissements Publics de santé dotation globale',
          libelléPays: '',
          libelléSph: 'Etablissement public de santé',
          lieuDitBoîtePostale: 'BP 116',
          ligneAcheminement: '01130 NANTUA',
          natureÉtablissement: 'G',
          numéroFinessEntitéJuridique: '010008407',
          numéroFinessÉtablissementPrincipal: '010000057',
          numéroFinessÉtablissementTerritorial: '010000040',
          numéroVoie: '50',
          numéroÉducationNationale: '',
          origineModificationSiret: 'SAISIE',
          raisonSociale: 'CH NANTUA',
          raisonSocialeLongue: 'CENTRE HOSPITALIER NANTUA',
          siret: '26011021800047',
          typeFermeture: 'DEF',
          typeVoie: 'R',
          typeÉtablissement: 'S',
          télécopie: '0774750663',
          téléphone: '0474754800',
          voie: 'PAUL PAINLEVE',
        },
        {
          catégorieAgrégatÉtablissement: '1102',
          catégorieÉtablissement: '355',
          codeApe: '',
          codeMft: '03',
          codePays: '',
          codePostal: '01100',
          codeSph: '1',
          commune: '283',
          complémentDistribution: '',
          complémentRaisonSociale: '',
          complémentVoie: '',
          courriel: '',
          dateAutorisation: '1901-01-01',
          dateCaducité: '',
          dateFermeture: '2007-04-20',
          dateMaj: '2018-10-26',
          dateMiseAJourSource: '20211214',
          dateModificationSiret: '2009-01-01',
          dateOuverture: '1901-01-01',
          département: '01',
          indicateurCaducité: '',
          libelléCatégorieAgrégatÉtablissement: 'Centres Hospitaliers',
          libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
          libelléCommune: 'OYONNAX',
          libelléCourtCatégorieAgrégatÉtablissement: 'Centres Hospitaliers',
          libelléCourtCatégorieÉtablissement: 'C.H.',
          libelléCourtMft: 'ARS / DG EPS',
          libelléCourtSph: 'Etab.public de santé',
          libelléDépartement: 'AIN',
          libelléMft: 'ARS établissements Publics de santé dotation globale',
          libelléPays: '',
          libelléSph: 'Etablissement public de santé',
          lieuDitBoîtePostale: '',
          ligneAcheminement: '01100 OYONNAX',
          natureÉtablissement: 'G',
          numéroFinessEntitéJuridique: '010008407',
          numéroFinessÉtablissementPrincipal: '010005239',
          numéroFinessÉtablissementTerritorial: '010000057',
          numéroVoie: '',
          numéroÉducationNationale: '',
          origineModificationSiret: 'SAISIE',
          raisonSociale: 'CH OYONNAX',
          raisonSocialeLongue: 'CENTRE HOSPITALIER OYONNAX',
          siret: '26011021800013',
          typeFermeture: 'DEF',
          typeVoie: 'RTE',
          typeÉtablissement: 'S',
          télécopie: '0774731002',
          téléphone: '0474731001',
          voie: 'DE VEYZIAT',
        },
      ]
    )
  })
})

import { mkdirSync, rmSync, writeFileSync } from 'fs'

import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { getFakeDataCrawlerDependencies } from '../../../testHelper'
import { NodeXmlToJs } from '../xml-to-js/NodeXmlToJs'
import { FinessXmlÉtablissementTerritorialSourceExterneLoader } from './FinessXmlÉtablissementTerritorialSourceExterneLoader'

describe('Récupération des établissements territoriaux de la source de données FINESS', () => {
  const fakeDataCrawlerDependencies = getFakeDataCrawlerDependencies()
  const localPath = `${fakeDataCrawlerDependencies.environmentVariables.SFTP_LOCAL_PATH}/fake_finess_et`
  const finessLocalPath = `${localPath}/finess/simple`
  const nomenclatureLocalPath = `${localPath}/finess/nomenclature`

  beforeEach(() => {
    mkdirSync(nomenclatureLocalPath, { recursive: true })
    const xmlNomenclature = `<?xml version="1.0" encoding="UTF-8"?>
    <fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <nomenclcategorieETavecagr>
        <code>355</code>
        <libelle>Centre Hospitalier (C.H.)</libelle>
        <domaine>SAN</domaine>
      </nomenclcategorieETavecagr>
      <nomenclcategorieETavecagr>
        <code>001</code>
        <libelle>Autres lits de m.R.</libelle>
        <domaine>SOC</domaine>
      </nomenclcategorieETavecagr>
    </fluxfiness>`
    writeFileSync(`${nomenclatureLocalPath}/finess_cs1500106_stock_20211214-0417.xml`, xmlNomenclature)
  })

  afterEach(() => {
    rmSync(localPath, { recursive: true })
  })

  it('récupère les établissements territoriaux de la source de données FINESS uniquement s’ils ne sont pas fermés', () => {
    // GIVEN
    const etOuvert1 = `<structureet>
        <nofinesset>010000040</nofinesset>
        <nofinessej>010008407</nofinessej>
        <rs>CH NANTUA</rs>
        <numvoie>50</numvoie>
        <typvoie>R</typvoie>
        <voie>PAUL PAINLEVE</voie>
        <ligneacheminement>01130 NANTUA</ligneacheminement>
        <telephone>0474754800</telephone>
        <courriel xsi:nil="true"/>
        <categetab>355</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <typeet>S</typeet>
        <nofinessppal>010000057</nofinessppal>
        <indcaduc xsi:nil="true"/>
        <datefermeture xsi:nil="true"/>
      </structureet>`
    const etOuvert2 = `<structureet>
        <nofinesset>010000057</nofinesset>
        <nofinessej>010008407</nofinessej>
        <rs>CH OYONNAX</rs>
        <numvoie xsi:nil="true"/>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <ligneacheminement>01100 OYONNAX</ligneacheminement>
        <telephone>0474731001</telephone>
        <courriel xsi:nil="true"/>
        <categetab>001</categetab>
        <libcategetab>Autres lits de m.R.</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <typeet>S</typeet>
        <nofinessppal>010005239</nofinessppal>
        <indcaduc xsi:nil="true"/>
        <datefermeture xsi:nil="true"/>
      </structureet>`
    const etFermé = `<structureet>
        <nofinesset>010787190</nofinesset>
        <nofinessej>010000164</nofinessej>
        <rs>[Fermé] SMUR POLYCLINIQUE AMBERIEU</rs>
        <numvoie>17</numvoie>
        <typvoie>R</typvoie>
        <voie>AIME VINGTRINIER</voie>
        <ligneacheminement>01500 AMBERIEU EN BUGEY</ligneacheminement>
        <telephone>0474383000</telephone>
        <courriel xsi:nil="true"/>
        <categetab>001</categetab>
        <libcategetab>Unité Mobile Hospitalière</libcategetab>
        <libcourtcategetab>Unité Mobile Hosp.</libcourtcategetab>
        <categagretab>1204</categagretab>
        <typeet>P</typeet>
        <nofinessppal xsi:nil="true"/>
        <indcaduc xsi:nil="true"/>
        <datefermeture>1993-01-01</datefermeture>
      </structureet>`
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      ${etOuvert1}
      ${etOuvert2}
      ${etFermé}
    </fluxfiness>`
    mkdirSync(finessLocalPath, { recursive: true })
    writeFileSync(`${finessLocalPath}/finess_cs1400102_stock_20211214-0336.xml`, xml)
    const mockedRécupèreLeNuméroFinessDesEntitésJuridiques = jest.fn(() => {
      return ['010008407', '010000164']
    })
    const typeOrmEntitéJuridiqueSourceInterneLoader = { récupèreLeNuméroFinessDesEntitésJuridiques: mockedRécupèreLeNuméroFinessDesEntitésJuridiques }

    // WHEN
    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialSourceExterneLoader(
      new NodeXmlToJs(), localPath, typeOrmEntitéJuridiqueSourceInterneLoader
    )
    const établissementsTerritoriaux = établissementTerritorialFinessLoader.récupèreLesÉtablissementsTerritoriauxOuverts()

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
          catégorieÉtablissement: '001',
          courriel: '',
          dateMiseAJourSource: '20211214',
          domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
          libelléCatégorieÉtablissement: 'Autres lits de m.R.',
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

  it('récupère les établissements territoriaux de la source de données FINESS uniquement s’ils ne sont pas caducs', () => {
    // GIVEN
    const etOuvert1 = `<structureet>
        <nofinesset>010000040</nofinesset>
        <nofinessej>010008407</nofinessej>
        <rs>CH NANTUA</rs>
        <numvoie>50</numvoie>
        <typvoie>R</typvoie>
        <voie>PAUL PAINLEVE</voie>
        <ligneacheminement>01130 NANTUA</ligneacheminement>
        <telephone>0474754800</telephone>
        <courriel xsi:nil="true"/>
        <categetab>355</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <typeet>S</typeet>
        <nofinessppal>010000057</nofinessppal>
        <indcaduc xsi:nil="true"/>
        <datefermeture xsi:nil="true"/>
      </structureet>`
    const etOuvert2 = `<structureet>
        <nofinesset>010000057</nofinesset>
        <nofinessej>010008407</nofinessej>
        <rs>CH OYONNAX</rs>
        <numvoie xsi:nil="true"/>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <ligneacheminement>01100 OYONNAX</ligneacheminement>
        <telephone>0474731001</telephone>
        <courriel xsi:nil="true"/>
        <categetab>001</categetab>
        <libcategetab>Autres lits de m.R.</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <typeet>S</typeet>
        <nofinessppal>010005239</nofinessppal>
        <indcaduc xsi:nil="true"/>
        <datefermeture xsi:nil="true"/>
      </structureet>`
    const etCaduc = `<structureet>
        <nofinesset>100007012</nofinesset>
        <nofinessej>100000983</nofinessej>
        <rs>[Caduque] MAISON DE REPOS ET DE CONVALESCENCE</rs>
        <numvoie xsi:nil="true"/>
        <typvoie xsi:nil="true"/>
        <voie xsi:nil="true"/>
        <ligneacheminement>10400 PONT SUR SEINE</ligneacheminement>
        <telephone xsi:nil="true"/>
        <courriel xsi:nil="true"/>
        <categetab>001</categetab>
        <libcategetab>Unité Mobile Hospitalière</libcategetab>
        <libcourtcategetab>Unité Mobile Hosp.</libcourtcategetab>
        <categagretab>1204</categagretab>
        <typeet>P</typeet>
        <nofinessppal xsi:nil="true"/>
        <indcaduc>O</indcaduc>
        <datefermeture xsi:nil="true"/>
      </structureet>`
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      ${etOuvert1}
      ${etOuvert2}
      ${etCaduc}
    </fluxfiness>`
    mkdirSync(finessLocalPath, { recursive: true })
    writeFileSync(`${finessLocalPath}/finess_cs1400102_stock_20211214-0336.xml`, xml)
    const mockedRécupèreLeNuméroFinessDesEntitésJuridiques = jest.fn(() => {
      return ['010008407', '100000983']
    })
    const typeOrmEntitéJuridiqueSourceInterneLoader = { récupèreLeNuméroFinessDesEntitésJuridiques: mockedRécupèreLeNuméroFinessDesEntitésJuridiques }

    // WHEN
    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialSourceExterneLoader(
      new NodeXmlToJs(), localPath, typeOrmEntitéJuridiqueSourceInterneLoader
    )
    const établissementsTerritoriaux = établissementTerritorialFinessLoader.récupèreLesÉtablissementsTerritoriauxOuverts()

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
          catégorieÉtablissement: '001',
          courriel: '',
          dateMiseAJourSource: '20211214',
          domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
          libelléCatégorieÉtablissement: 'Autres lits de m.R.',
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

  it('récupère les établissements territoriaux de la source de données FINESS uniquement si leur EJ associé est ouvert donc existe en base', () => {
    // GIVEN
    const numéroFinessDeLEjEnBase = '010008407'
    const numéroFinessDeLEjFermé = '010008408'
    const mockedRécupèreLeNuméroFinessDesEntitésJuridiques = jest.fn(() => {
      return [numéroFinessDeLEjEnBase]
    })
    const typeOrmEntitéJuridiqueSourceInterneLoader = { récupèreLeNuméroFinessDesEntitésJuridiques: mockedRécupèreLeNuméroFinessDesEntitésJuridiques }
    const etOuvertAssociéÀLEjExistant = `<structureet>
        <nofinesset>010000040</nofinesset>
        <nofinessej>${numéroFinessDeLEjEnBase}</nofinessej>
        <rs>CH NANTUA</rs>
        <numvoie>50</numvoie>
        <typvoie>R</typvoie>
        <voie>PAUL PAINLEVE</voie>
        <ligneacheminement>01130 NANTUA</ligneacheminement>
        <telephone>0474754800</telephone>
        <courriel xsi:nil="true"/>
        <categetab>355</categetab>
        <libcategetab>Centre Hospitalier (C.H.)</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <typeet>S</typeet>
        <nofinessppal>010000057</nofinessppal>
        <indcaduc xsi:nil="true"/>
        <datefermeture xsi:nil="true"/>
      </structureet>`
    const etOuvertAssociéÀUnEjNonExistant = `<structureet>
        <nofinesset>010000057</nofinesset>
        <nofinessej>${numéroFinessDeLEjFermé}</nofinessej>
        <rs>CH OYONNAX</rs>
        <numvoie xsi:nil="true"/>
        <typvoie>RTE</typvoie>
        <voie>DE VEYZIAT</voie>
        <ligneacheminement>01100 OYONNAX</ligneacheminement>
        <telephone>0474731001</telephone>
        <courriel xsi:nil="true"/>
        <categetab>001</categetab>
        <libcategetab>Autres lits de m.R.</libcategetab>
        <libcourtcategetab>C.H.</libcourtcategetab>
        <categagretab>1102</categagretab>
        <typeet>S</typeet>
        <nofinessppal>010005239</nofinessppal>
        <indcaduc xsi:nil="true"/>
        <datefermeture xsi:nil="true"/>
      </structureet>`
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      ${etOuvertAssociéÀLEjExistant}
      ${etOuvertAssociéÀUnEjNonExistant}
    </fluxfiness>`
    mkdirSync(finessLocalPath, { recursive: true })
    writeFileSync(`${finessLocalPath}/finess_cs1400102_stock_20211214-0336.xml`, xml)

    const établissementTerritorialFinessLoader = new FinessXmlÉtablissementTerritorialSourceExterneLoader(
      new NodeXmlToJs(), localPath, typeOrmEntitéJuridiqueSourceInterneLoader
    )

    // WHEN
    const établissementsTerritoriaux = établissementTerritorialFinessLoader.récupèreLesÉtablissementsTerritoriauxOuverts()

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
      ]
    )
  })

})

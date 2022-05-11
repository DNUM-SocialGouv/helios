import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { fakeDataCrawlerDependencies } from '../../../testHelper'
import { FinessÉtablissementTerritorialRepository } from './FinessÉtablissementTerritialRepository'

describe('Sauvegarde de l’établissement territorial', () => {
  beforeEach(async () => {
    await fakeDataCrawlerDependencies.database.raw('DELETE FROM EntitéJuridique')
    await fakeDataCrawlerDependencies.database.raw('DELETE FROM ÉtablissementTerritorialIdentité')
    await fakeDataCrawlerDependencies.database.raw('DELETE FROM DateMiseÀJourSource')
  })

  afterAll(async () => {
    await fakeDataCrawlerDependencies.database.destroy()
  })

  it('sauvegarder une établissement territorial et sa date de mise à jour FINESS même s’il existe déjà', async () => {
    // GIVEN
    await fakeDataCrawlerDependencies.database.raw('INSERT INTO EntitéJuridique (adresseAcheminement, adresseNuméroVoie, adresseTypeVoie, adresseVoie, numéroFinessEntitéJuridique, raisonSociale, libelléStatutJuridique, téléphone) VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'fake',
        'fake',
        'fake',
        'fake',
        '010018407',
        'fake',
        'fake',
        'fake',
        'fake',
        'fake',
        'fake',
        'fake',
        '590000741',
        'fake',
        'fake',
        'fake',
      ])
    await fakeDataCrawlerDependencies.database.raw('INSERT INTO ÉtablissementTerritorialIdentité (adresseAcheminement, adresseNuméroVoie, adresseTypeVoie, adresseVoie, catégorieÉtablissement, courriel, numéroFinessEntitéJuridique, numéroFinessÉtablissementPrincipal, numéroFinessÉtablissementTerritorial, raisonSociale, téléphone, typeÉtablissement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'fake',
        'fake',
        'fak',
        'fake',
        'fak',
        'fake',
        '010018407',
        'fake',
        '010000040',
        'fake',
        'fake',
        'f',
      ])
    await fakeDataCrawlerDependencies.database.raw('INSERT INTO DateMiseÀJourSource (dernièreMiseÀJour, source) VALUES (?, ?)',
      [
        '20200102',
        'FINESS',
      ])
    const finessÉtablissementTerritorialRepository = new FinessÉtablissementTerritorialRepository(fakeDataCrawlerDependencies.database)
    const établissementTerritorial1: ÉtablissementTerritorialIdentité = {
      adresseAcheminement: '01130 NANTUA',
      adresseNuméroVoie: '50',
      adresseTypeVoie: 'R',
      adresseVoie: 'PAUL PAINLEVE',
      catégorieÉtablissement: '355',
      courriel: 'a@example.com',
      dateMiseAJourSource: '20220203',
      numéroFinessEntitéJuridique: '010018407',
      numéroFinessÉtablissementPrincipal: '010000057',
      numéroFinessÉtablissementTerritorial: '010000040',
      raisonSociale: 'CH NANTUA',
      typeÉtablissement: 'S',
      téléphone: '0102030405',
    }
    const établissementTerritorial2: ÉtablissementTerritorialIdentité = {
      adresseAcheminement: '59650 VILLENEUVE D ASCQ',
      adresseNuméroVoie: '20',
      adresseTypeVoie: 'AV',
      adresseVoie: 'DE LA RECONNAISSANCE',
      catégorieÉtablissement: '365',
      courriel: 'b@example.com',
      dateMiseAJourSource: '20220203',
      numéroFinessEntitéJuridique: '590000741',
      numéroFinessÉtablissementPrincipal: '',
      numéroFinessÉtablissementTerritorial: '590782553',
      raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      typeÉtablissement: 'P',
      téléphone: '0102030406',
    }
    const établissementsTerritoriaux = [établissementTerritorial1, établissementTerritorial2]

    // WHEN
    await finessÉtablissementTerritorialRepository.save(établissementsTerritoriaux)

    // THEN
    const établissementsTerritoriauxQuery = await fakeDataCrawlerDependencies.database.raw('SELECT * FROM ÉtablissementTerritorialIdentité ORDER BY numéroFinessEntitéJuridique')
    expect(établissementsTerritoriauxQuery.rows).toStrictEqual([
      {
        adresseacheminement: '01130 NANTUA',
        adressenumérovoie: '50',
        adressetypevoie: 'R',
        adressevoie: 'PAUL PAINLEVE',
        catégorieÉtablissement: '355',
        courriel: 'a@example.com',
        numérofinessentitéjuridique: '010018407',
        numérofinessÉtablissementprincipal: '010000057',
        numérofinessÉtablissementterritorial: '010000040',
        raisonsociale: 'CH NANTUA',
        typeÉtablissement: 'S',
        téléphone: '0102030405',
      },
      {
        adresseacheminement: '59650 VILLENEUVE D ASCQ',
        adressenumérovoie: '20',
        adressetypevoie: 'AV',
        adressevoie: 'DE LA RECONNAISSANCE',
        catégorieÉtablissement: '365',
        courriel: 'b@example.com',
        numérofinessentitéjuridique: '590000741',
        numérofinessÉtablissementprincipal: '',
        numérofinessÉtablissementterritorial: '590782553',
        raisonsociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        typeÉtablissement: 'P',
        téléphone: '0102030406',
      },
    ])
    const dateMiseÀJourSourceQuery = await fakeDataCrawlerDependencies.database.raw('SELECT * FROM DateMiseÀJourSource WHERE source = ?', 'FINESS')
    expect(dateMiseÀJourSourceQuery.rows[0]).toStrictEqual({
      dernièremiseÀjour: new Date('2022-02-02T23:00:00.000Z'),
      source: 'FINESS',
    })
  })
})

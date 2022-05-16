import { DateMiseÀJourSourceEntity } from '../../../../../migrations/entities/DateMiseÀJourSourceEntity'
import { EntitéJuridiqueEntity } from '../../../../../migrations/entities/EntitéJuridiqueEntity'
import { ÉtablissementTerritorialIdentitéEntity } from '../../../../../migrations/entities/ÉtablissementTerritorialIdentitéEntity'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { fakeDataCrawlerDependencies } from '../../../testHelper'
import { FinessÉtablissementTerritorialRepository } from './FinessÉtablissementTerritialRepository'

describe('Sauvegarde de l’établissement territorial', () => {
  let dataSource: any

  beforeAll(async () => {
    dataSource = await fakeDataCrawlerDependencies.dataSourceInit()
  })

  beforeEach(async () => {
    await dataSource.remove(ÉtablissementTerritorialIdentitéEntity)
    await dataSource.remove(EntitéJuridiqueEntity)
    await dataSource.remove(DateMiseÀJourSourceEntity)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it.skip('sauvegarder une établissement territorial et sa date de mise à jour FINESS même s’il existe déjà', async () => {
    // GIVEN
    await dataSource
      .getRepository(EntitéJuridiqueEntity)
      .insert([
        {
          adresseAcheminement: 'fake',
          adresseNuméroVoie: 'fake',
          adresseTypeVoie: 'fake',
          adresseVoie: 'fake',
          libelléStatutJuridique: 'fake',
          numéroFinessEntitéJuridique: '010018407',
          raisonSociale: 'fake',
          téléphone: 'fake',
        },
        {
          adresseAcheminement: 'fake',
          adresseNuméroVoie: 'fake',
          adresseTypeVoie: 'fake',
          adresseVoie: 'fake',
          libelléStatutJuridique: 'fake',
          numéroFinessEntitéJuridique: '590000741',
          raisonSociale: 'fake',
          téléphone: 'fake',
        },
      ])
    await dataSource
      .getRepository(ÉtablissementTerritorialIdentitéEntity)
      .insert([
        {
          adresseAcheminement: 'fake',
          adresseNuméroVoie: 'fake',
          adresseTypeVoie: 'fake',
          adresseVoie: 'fake',
          catégorieÉtablissement: 'fake',
          courriel: 'fake',
          numéroFinessEntitéJuridique: '010018407',
          numéroFinessÉtablissementPrincipal: 'fake',
          numéroFinessÉtablissementTerritorial: '010000040',
          raisonSociale: 'fake',
          typeÉtablissement: 'fake',
          téléphone: 'fake',
        },
      ])
    await dataSource
      .getRepository(DateMiseÀJourSourceEntity)
      .insert([
        {
          dernièreMiseÀJour: '20200102',
          source: 'FINESS',
        },
      ])
    const finessÉtablissementTerritorialRepository = new FinessÉtablissementTerritorialRepository(dataSource)
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
    const établissementsTerritoriauxQuery = await dataSource
      .getRepository(DateMiseÀJourSourceEntity)
      .find({ order: { numéroFinessEntitéJuridique: 'ASC' } })
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
    const dateMiseÀJourSourceQuery = await dataSource
      .getRepository(DateMiseÀJourSourceEntity)
      .find({ where: { source: 'FINESS' } })
    expect(dateMiseÀJourSourceQuery.rows[0]).toStrictEqual({
      dernièremiseÀjour: new Date('2022-02-02T23:00:00.000Z'),
      source: 'FINESS',
    })
  })
})

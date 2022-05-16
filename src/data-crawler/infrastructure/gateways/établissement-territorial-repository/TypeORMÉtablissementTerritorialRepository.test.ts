import { DataSource, Repository } from 'typeorm'

import { DateMiseÀJourSourceEntity, SourceDeDonnées } from '../../../../../migrations/entities/DateMiseÀJourSourceEntity'
import { EntitéJuridiqueEntity } from '../../../../../migrations/entities/EntitéJuridiqueEntity'
import { ÉtablissementTerritorialIdentitéEntity } from '../../../../../migrations/entities/ÉtablissementTerritorialIdentitéEntity'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { getFakeDataCrawlerDependencies } from '../../../testHelper'
import { Dependencies } from '../../dependencies'
import { TypeORMÉtablissementTerritorialRepository } from './TypeORMÉtablissementTerritorialRepository'

describe('Sauvegarde de l’établissement territorial', () => {
  let fakeDataCrawlerDependencies: Dependencies
  let database: DataSource
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueEntity>
  let établissementTerritorialIdentitéRepository: Repository<ÉtablissementTerritorialIdentitéEntity>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceEntity>

  beforeAll(async () => {
    fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies()
    database = fakeDataCrawlerDependencies.database
    entitéJuridiqueRepository = fakeDataCrawlerDependencies.database.getRepository(EntitéJuridiqueEntity)
    établissementTerritorialIdentitéRepository = fakeDataCrawlerDependencies.database.getRepository(ÉtablissementTerritorialIdentitéEntity)
    dateMiseÀJourSourceRepository = fakeDataCrawlerDependencies.database.getRepository(DateMiseÀJourSourceEntity)
  })

  beforeEach(async () => {
    await établissementTerritorialIdentitéRepository.query('DELETE FROM ÉtablissementTerritorialIdentité;')
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
    await dateMiseÀJourSourceRepository.query('DELETE FROM DateMiseÀJourSource;')
  })

  afterAll(async () => {
    await database.destroy()
  })

  it('sauvegarder une établissement territorial et sa date de mise à jour FINESS même s’il existe déjà', async () => {
    // GIVEN
    const entitéJuridique1 = new EntitéJuridiqueEntity()
    entitéJuridique1.adresseAcheminement = 'fake'
    entitéJuridique1.adresseNuméroVoie = 'fake'
    entitéJuridique1.adresseTypeVoie = 'fake'
    entitéJuridique1.adresseVoie = 'fake'
    entitéJuridique1.libelléStatutJuridique = 'fake'
    entitéJuridique1.numéroFinessEntitéJuridique = '010018407'
    entitéJuridique1.raisonSociale = 'fake'
    entitéJuridique1.téléphone = 'fake'

    const entitéJuridique2 = new EntitéJuridiqueEntity()
    entitéJuridique2.adresseAcheminement = 'fake'
    entitéJuridique2.adresseNuméroVoie = 'fake'
    entitéJuridique2.adresseTypeVoie = 'fake'
    entitéJuridique2.adresseVoie = 'fake'
    entitéJuridique2.libelléStatutJuridique = 'fake'
    entitéJuridique2.numéroFinessEntitéJuridique = '590000741'
    entitéJuridique2.raisonSociale = 'fake'
    entitéJuridique2.téléphone = 'fake'
    await entitéJuridiqueRepository.insert([entitéJuridique1, entitéJuridique2])

    const établissementTerritorialIdentité1 = new ÉtablissementTerritorialIdentitéEntity()
    établissementTerritorialIdentité1.adresseAcheminement = 'fake',
    établissementTerritorialIdentité1.adresseNuméroVoie = 'fake',
    établissementTerritorialIdentité1.adresseTypeVoie = 'fake',
    établissementTerritorialIdentité1.adresseVoie = 'fake',
    établissementTerritorialIdentité1.catégorieÉtablissement = 'fak',
    établissementTerritorialIdentité1.courriel = 'fake',
    établissementTerritorialIdentité1.numéroFinessEntitéJuridique = entitéJuridique1.numéroFinessEntitéJuridique,
    établissementTerritorialIdentité1.numéroFinessÉtablissementPrincipal = 'fake',
    établissementTerritorialIdentité1.numéroFinessÉtablissementTerritorial = '010000040',
    établissementTerritorialIdentité1.raisonSociale = 'fake',
    établissementTerritorialIdentité1.typeÉtablissement = 'F',
    établissementTerritorialIdentité1.téléphone = 'fake',
    await établissementTerritorialIdentitéRepository.insert([établissementTerritorialIdentité1])

    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20200102',
        source: SourceDeDonnées.FINESS,
      },
    ])
    const finessÉtablissementTerritorialRepository = new TypeORMÉtablissementTerritorialRepository(database)
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
    const établissementsTerritoriauxSauvés = await établissementTerritorialIdentitéRepository
      .find({ order: { numéroFinessÉtablissementTerritorial: 'ASC' } })

    const établissementTerritorial1MisAJourAttendu = new ÉtablissementTerritorialIdentitéEntity()
    établissementTerritorial1MisAJourAttendu.adresseAcheminement = '01130 NANTUA'
    établissementTerritorial1MisAJourAttendu.adresseNuméroVoie = '50'
    établissementTerritorial1MisAJourAttendu.adresseTypeVoie = 'R'
    établissementTerritorial1MisAJourAttendu.adresseVoie = 'PAUL PAINLEVE'
    établissementTerritorial1MisAJourAttendu.catégorieÉtablissement = '355'
    établissementTerritorial1MisAJourAttendu.courriel = 'a@example.com'
    établissementTerritorial1MisAJourAttendu.numéroFinessEntitéJuridique = '010018407'
    établissementTerritorial1MisAJourAttendu.numéroFinessÉtablissementPrincipal = '010000057'
    établissementTerritorial1MisAJourAttendu.numéroFinessÉtablissementTerritorial = '010000040'
    établissementTerritorial1MisAJourAttendu.raisonSociale = 'CH NANTUA'
    établissementTerritorial1MisAJourAttendu.typeÉtablissement = 'S'
    établissementTerritorial1MisAJourAttendu.téléphone = '0102030405'
    const établissementTerritorial2MisAJourAttendu = new ÉtablissementTerritorialIdentitéEntity()
    établissementTerritorial2MisAJourAttendu.adresseAcheminement = '59650 VILLENEUVE D ASCQ'
    établissementTerritorial2MisAJourAttendu.adresseNuméroVoie = '20'
    établissementTerritorial2MisAJourAttendu.adresseTypeVoie = 'AV'
    établissementTerritorial2MisAJourAttendu.adresseVoie = 'DE LA RECONNAISSANCE'
    établissementTerritorial2MisAJourAttendu.catégorieÉtablissement = '365'
    établissementTerritorial2MisAJourAttendu.courriel = 'b@example.com'
    établissementTerritorial2MisAJourAttendu.numéroFinessEntitéJuridique = '590000741'
    établissementTerritorial2MisAJourAttendu.numéroFinessÉtablissementPrincipal = ''
    établissementTerritorial2MisAJourAttendu.numéroFinessÉtablissementTerritorial = '590782553'
    établissementTerritorial2MisAJourAttendu.raisonSociale = 'HOPITAL PRIVE DE VILLENEUVE DASCQ'
    établissementTerritorial2MisAJourAttendu.typeÉtablissement = 'P'
    établissementTerritorial2MisAJourAttendu.téléphone = '0102030406'

    expect(établissementsTerritoriauxSauvés).toStrictEqual(
      [établissementTerritorial1MisAJourAttendu, établissementTerritorial2MisAJourAttendu]
    )
    // const dateMiseÀJourSourceQuery = await dataSource
    //   .getRepository(DateMiseÀJourSourceEntity)
    //   .find({ where: { source: 'FINESS' } })
    // expect(dateMiseÀJourSourceQuery.rows[0]).toStrictEqual({
    //   dernièremiseÀjour: new Date('2022-02-02T23:00:00.000Z'),
    //   source: 'FINESS',
    // })
  })
})

import { DataSource, Repository } from 'typeorm'

import { DateMiseÀJourSourceEntity, SourceDeDonnées } from '../../../../../database/entities/DateMiseÀJourSourceEntity'
import { EntitéJuridiqueEntity } from '../../../../../database/entities/EntitéJuridiqueEntity'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { getFakeDataCrawlerDependencies } from '../../../testHelper'
import { Dependencies } from '../../dependencies'
import { TypeORMEntitéJuridiqueRepository } from './TypeORMEntitéJuridiqueRepository'

describe('Sauvegarde de l’entité juridique', () => {
  let fakeDataCrawlerDependencies: Dependencies
  let database: DataSource
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueEntity>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceEntity>

  beforeAll(async () => {
    fakeDataCrawlerDependencies = await getFakeDataCrawlerDependencies()
    database = fakeDataCrawlerDependencies.database
    entitéJuridiqueRepository = fakeDataCrawlerDependencies.database.getRepository(EntitéJuridiqueEntity)
    dateMiseÀJourSourceRepository = fakeDataCrawlerDependencies.database.getRepository(DateMiseÀJourSourceEntity)
  })

  beforeEach(async () => {
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
    await dateMiseÀJourSourceRepository.query('DELETE FROM DateMiseÀJourSource;')
  })

  afterAll(async () => {
    await database.destroy()
  })

  it('sauvegarder une entité juridique et sa date de mise à jour FINESS même si elle existe déjà', async () => {
    // GIVEN
    const entitéJuridique = new EntitéJuridiqueEntity()
    entitéJuridique.adresseAcheminement = 'fake'
    entitéJuridique.adresseNuméroVoie = 'fake'
    entitéJuridique.adresseTypeVoie = 'fake'
    entitéJuridique.adresseVoie = 'fake'
    entitéJuridique.libelléStatutJuridique = 'fake'
    entitéJuridique.numéroFinessEntitéJuridique = '010018407'
    entitéJuridique.raisonSociale = 'fake'
    entitéJuridique.téléphone = 'fake'
    await entitéJuridiqueRepository.insert(entitéJuridique)

    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20200102',
        source: SourceDeDonnées.FINESS,
      },
    ])

    const finessEntitéJuridiqueRepository = new TypeORMEntitéJuridiqueRepository(database)
    const entitéJuridique1: EntitéJuridique = {
      adresseAcheminement: '01117 OYONNAX CEDEX',
      adresseNuméroVoie: '1',
      adresseTypeVoie: 'RTE',
      adresseVoie: 'DE VEYZIAT',
      dateMiseAJourSource: '20220203',
      libelléStatutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
      numéroFinessEntitéJuridique: '010018407',
      raisonSociale: 'CH DU HAUT BUGEY',
      téléphone: '0102030406',
    }
    const entitéJuridique2: EntitéJuridique = {
      adresseAcheminement: '59650 VILLENEUVE D ASCQ',
      adresseNuméroVoie: '20',
      adresseTypeVoie: 'AV',
      adresseVoie: 'DE LA RECONNAISSANCE',
      dateMiseAJourSource: '20220203',
      libelléStatutJuridique: 'Société Anonyme (S.A.)',
      numéroFinessEntitéJuridique: '590001741',
      raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      téléphone: '0102030405',
    }
    const entitésJuridiques = [entitéJuridique1, entitéJuridique2]

    // WHEN
    await finessEntitéJuridiqueRepository.save(entitésJuridiques)

    // THEN
    const entitésJuridiquesQuery = await entitéJuridiqueRepository.find({ order: { numéroFinessEntitéJuridique: 'ASC' } })
    const entitéJuridiqueMisÀJourAttendu1 = new EntitéJuridiqueEntity()
    entitéJuridiqueMisÀJourAttendu1.adresseAcheminement = '01117 OYONNAX CEDEX'
    entitéJuridiqueMisÀJourAttendu1.adresseNuméroVoie = '1'
    entitéJuridiqueMisÀJourAttendu1.adresseTypeVoie = 'RTE'
    entitéJuridiqueMisÀJourAttendu1.adresseVoie = 'DE VEYZIAT'
    entitéJuridiqueMisÀJourAttendu1.libelléStatutJuridique = 'Etablissement Public Intercommunal dHospitalisation'
    entitéJuridiqueMisÀJourAttendu1.numéroFinessEntitéJuridique = '010018407'
    entitéJuridiqueMisÀJourAttendu1.raisonSociale = 'CH DU HAUT BUGEY'
    entitéJuridiqueMisÀJourAttendu1.téléphone = '0102030406'
    const entitéJuridiqueMisÀJourAttendu2 = new EntitéJuridiqueEntity()
    entitéJuridiqueMisÀJourAttendu2.adresseAcheminement = '59650 VILLENEUVE D ASCQ'
    entitéJuridiqueMisÀJourAttendu2.adresseNuméroVoie = '20'
    entitéJuridiqueMisÀJourAttendu2.adresseTypeVoie = 'AV'
    entitéJuridiqueMisÀJourAttendu2.adresseVoie = 'DE LA RECONNAISSANCE'
    entitéJuridiqueMisÀJourAttendu2.libelléStatutJuridique = 'Société Anonyme (S.A.)'
    entitéJuridiqueMisÀJourAttendu2.numéroFinessEntitéJuridique = '590001741'
    entitéJuridiqueMisÀJourAttendu2.raisonSociale = 'HOPITAL PRIVE DE VILLENEUVE DASCQ'
    entitéJuridiqueMisÀJourAttendu2.téléphone = '0102030405'
    expect(entitésJuridiquesQuery).toStrictEqual([
      entitéJuridiqueMisÀJourAttendu1,
      entitéJuridiqueMisÀJourAttendu2,
    ])
  })
})

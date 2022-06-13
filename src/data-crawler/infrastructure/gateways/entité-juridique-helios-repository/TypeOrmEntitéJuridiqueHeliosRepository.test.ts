import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../database/test-factories/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../database/test-factories/ÉtablissementTerritorialIdentitéModelTestFactory'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { fakeLogger, getOrm } from '../../../testHelper'
import { TypeOrmEntitéJuridiqueHeliosRepository } from './TypeOrmEntitéJuridiqueHeliosRepository'

describe('Sauvegarde des entités juridiques', () => {
  const orm = getOrm()
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let établissementTerritorialIdentitéRepository: Repository<ÉtablissementTerritorialIdentitéModel>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceModel>

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    établissementTerritorialIdentitéRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    dateMiseÀJourSourceRepository = (await orm).getRepository(DateMiseÀJourSourceModel)
  })

  beforeEach(async () => {
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
    await établissementTerritorialIdentitéRepository.query('DELETE FROM ÉtablissementTerritorialIdentité;')
    await dateMiseÀJourSourceRepository.query('DELETE FROM DateMiseÀJourSource;')
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('sauvegarde une entité juridique et sa date de mise à jour FINESS même si elle existe déjà', async () => {
    // GIVEN
    const entitéJuridique = new EntitéJuridiqueModel()
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

    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger)
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
    await typeOrmEntitéJuridiqueRepository.sauvegarde(entitésJuridiques)

    // THEN
    const entitésJuridiquesQuery = await entitéJuridiqueRepository.find({ order: { numéroFinessEntitéJuridique: 'ASC' } })
    const entitéJuridiqueMisÀJourAttendu1 = new EntitéJuridiqueModel()
    entitéJuridiqueMisÀJourAttendu1.adresseAcheminement = '01117 OYONNAX CEDEX'
    entitéJuridiqueMisÀJourAttendu1.adresseNuméroVoie = '1'
    entitéJuridiqueMisÀJourAttendu1.adresseTypeVoie = 'RTE'
    entitéJuridiqueMisÀJourAttendu1.adresseVoie = 'DE VEYZIAT'
    entitéJuridiqueMisÀJourAttendu1.libelléStatutJuridique = 'Etablissement Public Intercommunal dHospitalisation'
    entitéJuridiqueMisÀJourAttendu1.numéroFinessEntitéJuridique = '010018407'
    entitéJuridiqueMisÀJourAttendu1.raisonSociale = 'CH DU HAUT BUGEY'
    entitéJuridiqueMisÀJourAttendu1.téléphone = '0102030406'
    const entitéJuridiqueMisÀJourAttendu2 = new EntitéJuridiqueModel()
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

  it('supprime une entité juridique quand celle-ci est en base', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '010018407'
    const entitéJuridique = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert([entitéJuridique])

    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger)

    // WHEN
    await typeOrmEntitéJuridiqueRepository.supprime([numéroFinessEntitéJuridique])

    // THEN
    await expect(entitéJuridiqueRepository.count()).resolves.toBe(0)
  })

  it('ne lève pas d’alerte si l’entité juridique à supprimer n’est pas en base', async () => {
    // GIVEN
    const numéroFinessEntitéJuridiquePasEnBase = '123456789'

    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger)

    // WHEN
    await typeOrmEntitéJuridiqueRepository.supprime([numéroFinessEntitéJuridiquePasEnBase])

    // THEN
    await expect(entitéJuridiqueRepository.count()).resolves.toBe(0)
  })

  it('supprime une entité juridique avec ses établissements territoriaux rattachés', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '010018407'
    await entitéJuridiqueRepository.insert([EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique })])

    await établissementTerritorialIdentitéRepository.insert([
      ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel({ numéroFinessEntitéJuridique }),
      ÉtablissementTerritorialIdentitéModelTestFactory.créeAutreÉtablissementTerritorialIdentitéModel({ numéroFinessEntitéJuridique }),
    ])

    const typeOrmEntitéJuridiqueRepository = new TypeOrmEntitéJuridiqueHeliosRepository(orm, fakeLogger)

    // WHEN
    await typeOrmEntitéJuridiqueRepository.supprime([numéroFinessEntitéJuridique])

    // THEN
    await expect(établissementTerritorialIdentitéRepository.count()).resolves.toBe(0)
  })
})

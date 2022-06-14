import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../database/test-factories/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../database/test-factories/ÉtablissementTerritorialIdentitéModelTestFactory'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialTestFactory } from '../../../test-factories/ÉtablissementTerritorialTestFactory'
import { getOrm } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialSanitaireLoader } from './TypeOrmÉtablissementTerritorialSanitaireLoader'

describe('Établissement territorial sanitaire loader', () => {
  const orm = getOrm()
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceModel>

  beforeAll(async () => {
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    dateMiseÀJourSourceRepository = (await orm).getRepository(DateMiseÀJourSourceModel)
  })

  beforeEach(async () => {
    await établissementTerritorialRepository.query('DELETE FROM ÉtablissementTerritorialIdentité;')
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
    await dateMiseÀJourSourceRepository.query('DELETE FROM DateMiseÀJourSource;')
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('charge par numéro FINESS quand l’établissement territorial est en base et son domaine est sanitaire', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '111222333'
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20220514',
        source: SourceDeDonnées.FINESS,
      },
    ])

    const numéroFinessÉtablissementTerritorial = '123456789'
    const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel(
      {
        catégorieÉtablissement: '161',
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      }
    )
    await établissementTerritorialRepository.insert(établissementTerritorialModel)

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

    // WHEN
    const établissementTerritorialChargée = await typeOrmÉtablissementTerritorialLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorial)

    // THEN
    const établissementTerritorialAttendu: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeÉtablissementTerritorial(
      {
        catégorieÉtablissement: '161',
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      }
    )
    expect(établissementTerritorialChargée).toStrictEqual(établissementTerritorialAttendu)
  })

  it('signale que l’établissement territorial n’a pas été trouvé lorsque l’établissement territorial n’existe pas', async () => {
    // GIVEN
    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20220514',
        source: SourceDeDonnées.FINESS,
      },
    ])
    const numéroFiness = '012345678'
    const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

    // WHEN
    const exceptionReçue = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeParNuméroFiness(numéroFiness)

    // THEN
    const exceptionAttendue = new ÉtablissementTerritorialSanitaireNonTrouvée('012345678')
    expect(exceptionReçue).toStrictEqual(exceptionAttendue)
  })

  it('signale que l’établissement territorial n’a pas été trouvé lorsque celui-ci est médico-social', async () => {
    // GIVEN
    const numéroFinessEntitéJuridique = '123456789'
    const numéroFinessÉtablissementTerritorial = '012345678'
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20220514',
        source: SourceDeDonnées.FINESS,
      },
    ])
    const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel(
      {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      }
    )
    await établissementTerritorialRepository.insert(établissementTerritorialModel)

    const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

    // WHEN
    const exceptionReçue = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorial)

    // THEN
    const exceptionAttendue = new ÉtablissementTerritorialSanitaireNonTrouvée('012345678')
    expect(exceptionReçue).toStrictEqual(exceptionAttendue)
  })
})

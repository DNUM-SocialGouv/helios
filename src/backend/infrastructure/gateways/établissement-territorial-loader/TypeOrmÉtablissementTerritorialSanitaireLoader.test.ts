import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DateMiseÀJourSourceModelTestFactory } from '../../../../../database/test-factories/DateMiseÀJourSourceModelTestFactory'
import { EntitéJuridiqueModelTestFactory } from '../../../../../database/test-factories/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../../database/test-factories/ÉtablissementTerritorialIdentitéModelTestFactory'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialTestFactory } from '../../../test-factories/ÉtablissementTerritorialTestFactory'
import { clearAllTables, getOrm, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../../testHelper'
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
    await clearAllTables(await orm)
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('charge par numéro FINESS quand l’établissement territorial est en base et son domaine est sanitaire', async () => {
    // GIVEN
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
    await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])

    const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeSanitaire(
      {
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      }
    )
    await établissementTerritorialRepository.insert(établissementTerritorialModel)

    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

    // WHEN
    const établissementTerritorialChargée = await typeOrmÉtablissementTerritorialLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorial)

    // THEN
    const établissementTerritorialAttendu: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeUneIdentitéSanitaire(
      {
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      }
    )
    expect(établissementTerritorialChargée).toStrictEqual(établissementTerritorialAttendu)
  })

  it('signale que l’établissement territorial n’a pas été trouvé lorsque l’établissement territorial n’existe pas', async () => {
    // GIVEN
    await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])
    const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

    // WHEN
    const exceptionReçue = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeParNuméroFiness(numéroFinessEntitéJuridique)

    // THEN
    const exceptionAttendue = new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessEntitéJuridique)
    expect(exceptionReçue).toStrictEqual(exceptionAttendue)
  })

  it('signale que l’établissement territorial n’a pas été trouvé lorsque celui-ci est médico-social', async () => {
    // GIVEN
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
    await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])

    const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeMédicoSocial(
      {
        numéroFinessEntitéJuridique,
        numéroFinessÉtablissementTerritorial,
      }
    )
    await établissementTerritorialRepository.insert(établissementTerritorialModel)

    const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

    // WHEN
    const exceptionReçue = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorial)

    // THEN
    const exceptionAttendue = new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial)
    expect(exceptionReçue).toStrictEqual(exceptionAttendue)
  })
})

import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { DateMiseÀJourSourceModelTestFactory } from '../../../../../database/test-factories/DateMiseÀJourSourceModelTestFactory'
import { EntitéJuridiqueModelTestFactory } from '../../../../../database/test-factories/EntitéJuridiqueModelTestFactory'
import { EntitéJuridiqueNonTrouvée } from '../../../métier/entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueDeRattachement } from '../../../métier/entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { EntitéJuridiqueTestFactory } from '../../../test-factories/EntitéJuridiqueTestFactory'
import { clearAllTables, getOrm, numéroFinessEntitéJuridique } from '../../../testHelper'
import { TypeOrmEntitéJuridiqueLoader } from './TypeOrmEntitéJuridiqueLoader'

describe('Entité juridique loader', () => {
  const orm = getOrm()
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceModel>

  beforeAll(async () => {
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    dateMiseÀJourSourceRepository = (await orm).getRepository(DateMiseÀJourSourceModel)
  })

  beforeEach(async () => {
    await clearAllTables(await orm)
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  describe('charge une fiche identité d’une entité juridique', () => {
    it('charge par numéro FINESS lorsque l’entité juridique est en base', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])

      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm)

      // WHEN
      const entitéJuridiqueChargée = await typeOrmEntitéJuridiqueLoader.chargeParNuméroFiness(numéroFinessEntitéJuridique)

      // THEN
      const entitéJuridiqueAttendue = EntitéJuridiqueTestFactory.créeEntitéJuridique()
      expect(entitéJuridiqueChargée).toStrictEqual(entitéJuridiqueAttendue)
    })

    it('signale que l’entité juridique n’a pas été trouvée lorsque l’entité juridique n’existe pas', async () => {
      // GIVEN
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])

      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmEntitéJuridiqueLoader.chargeParNuméroFiness(numéroFinessEntitéJuridique)

      // THEN
      const exceptionAttendue = new EntitéJuridiqueNonTrouvée(numéroFinessEntitéJuridique)
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })
  })

  it('charge l’entité juridique de rattachement par numéro FINESS lorsque l’entité juridique est en base', async () => {
    // GIVEN
    const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
    await entitéJuridiqueRepository.insert(entitéJuridiqueModel)

    const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm)

    // WHEN
    const entitéJuridiqueChargée = await typeOrmEntitéJuridiqueLoader.chargeLEntitéJuridiqueDeRattachement(numéroFinessEntitéJuridique)

    // THEN
    const entitéJuridiqueDeRattachementAttendue: EntitéJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement: 'CH DU HAUT BUGEY',
      statutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
    }
    expect(entitéJuridiqueChargée).toStrictEqual(entitéJuridiqueDeRattachementAttendue)
  })
})

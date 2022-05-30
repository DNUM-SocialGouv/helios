import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../database/test/EntitéJuridiqueModelTestFactory'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../../../métier/entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueDeRattachement } from '../../../métier/entities/ÉtablissementTerritorialMédicoSocial/EntitéJuridiqueDeRattachement'
import { EntitéJuridiqueTestFactory } from '../../../test/EntitéJuridiqueTestFactory'
import { getOrm } from '../../../testHelper'
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
    await entitéJuridiqueRepository.query('DELETE FROM EntitéJuridique;')
    await dateMiseÀJourSourceRepository.query('DELETE FROM DateMiseÀJourSource;')
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  describe('charge une fiche identité d’une entité juridique', () => {
    it('charge par numéro FINESS lorsque l’entité juridique est en base', async () => {
      // GIVEN
      const numéroFiness = '010018407'
      const entitéJuridique = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique: numéroFiness })
      await entitéJuridiqueRepository.insert(entitéJuridique)
      await dateMiseÀJourSourceRepository.insert([
        {
          dernièreMiseÀJour: '20220514',
          source: SourceDeDonnées.FINESS,
        },
      ])

      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm)
      const entitéJuridiqueAttendue: EntitéJuridique = EntitéJuridiqueTestFactory.créeEntitéJuridique()

      // WHEN
      const entitéJuridiqueChargée = await typeOrmEntitéJuridiqueLoader.chargeParNuméroFiness(numéroFiness)

      // THEN
      expect(entitéJuridiqueChargée).toStrictEqual(entitéJuridiqueAttendue)
    })

    it('signale que l’entité juridique n’a pas été trouvée lorsque l’entité juridique n’existe pas', async () => {
      // GIVEN
      await dateMiseÀJourSourceRepository.insert([
        {
          dernièreMiseÀJour: '20220514',
          source: SourceDeDonnées.FINESS,
        },
      ])

      const numéroFiness = '012345678'
      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm)
      const exceptionAttendue = new EntitéJuridiqueNonTrouvée('012345678')

      // WHEN
      const exceptionReçue = await typeOrmEntitéJuridiqueLoader.chargeParNuméroFiness(numéroFiness)

      // THEN
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })
  })

  describe('charge les informations d’une entité juridique de rattachement', () => {
    it('charge l’entité juridique de rattachement par numéro FINESS lorsque l’entité juridique est en base', async () => {
      // GIVEN
      const numéroFiness = '010018407'
      const entitéJuridique = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique: numéroFiness })
      await entitéJuridiqueRepository.insert(entitéJuridique)

      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm)

      // WHEN
      const entitéJuridiqueChargée = await typeOrmEntitéJuridiqueLoader.chargeLEntitéJuridiqueDeRattachement(numéroFiness)

      // THEN
      const entitéJuridiqueDeRattachementAttendue: EntitéJuridiqueDeRattachement = {
        raisonSociale: 'CH DU HAUT BUGEY',
        statutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
      }
      expect(entitéJuridiqueChargée).toStrictEqual(entitéJuridiqueDeRattachementAttendue)
    })

    it('signale que l’entité juridique n’a pas été trouvée lorsque l’entité juridique n’existe pas', async () => {
      // GIVEN
      const numéroFiness = '012345678'
      const typeOrmEntitéJuridiqueLoader = new TypeOrmEntitéJuridiqueLoader(orm)
      const exceptionAttendue = new EntitéJuridiqueNonTrouvée('012345678')

      // WHEN
      const exceptionReçue = await typeOrmEntitéJuridiqueLoader.chargeLEntitéJuridiqueDeRattachement(numéroFiness)

      // THEN
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })
  })
})

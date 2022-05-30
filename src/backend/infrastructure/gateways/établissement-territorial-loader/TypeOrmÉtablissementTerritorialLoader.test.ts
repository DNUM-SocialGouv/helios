import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../database/test/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../database/test/ÉtablissementTerritorialIdentitéModelTestFactory'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialNonTrouvée'
import { ÉtablissementTerritorialTestFactory } from '../../../test/ÉtablissementTerritorialTestFactory'
import { getOrm } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialLoader } from './TypeOrmÉtablissementTerritorialLoader'

describe('Établissement territorial loader', () => {
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

  it('charge par numéro FINESS quand l’établissement territorial est en base', async () => {
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
      { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
    )
    await établissementTerritorialRepository.insert(établissementTerritorialModel)

    const établissementTerritorialAttendue: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeÉtablissementTerritorial(
      { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
    )
    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialLoader(orm)

    // WHEN
    const établissementTerritorialChargée = await typeOrmÉtablissementTerritorialLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorial)

    // THEN
    expect(établissementTerritorialChargée).toStrictEqual(établissementTerritorialAttendue)
  })

  it('signale que l’établissement territorial n’a pas été trouvée lorsque l’établissement territorial n’existe pas', async () => {
    // GIVEN
    await dateMiseÀJourSourceRepository.insert([
      {
        dernièreMiseÀJour: '20220514',
        source: SourceDeDonnées.FINESS,
      },
    ])

    const numéroFiness = '012345678'
    const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialLoader(orm)
    const exceptionAttendue = new ÉtablissementTerritorialNonTrouvée('012345678')

    // WHEN
    const exceptionReçue = await typeOrmÉtablissementTerritorialLoader.chargeParNuméroFiness(numéroFiness)

    // THEN
    expect(exceptionReçue).toStrictEqual(exceptionAttendue)
  })

  describe('permet de savoir si un établissement est le seul affilié à son entité juridique', () => {
    it('quand plusieurs établissements sont rattachés à la même entité juridique', async () => {
      // GIVEN
      const numéroFinessEntitéJuridique = '111222333'
      const autreNuméroFinessEntitéJuridique = '333222111'

      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique })
      const entitéJuridiqueSansÉtablissementsModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel(
        { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique }
      )
      await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel])

      const établissementTerritorial1AffiliéModel =
        ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel({ numéroFinessEntitéJuridique })
      const établissementTerritorial2AffiliéModel =
        ÉtablissementTerritorialIdentitéModelTestFactory.créeAutreÉtablissementTerritorialIdentitéModel({ numéroFinessEntitéJuridique })
      const établissementTerritorialNonAffiliéModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel(
        { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial: '321654987' }
      )
      await établissementTerritorialRepository.insert(
        [établissementTerritorial1AffiliéModel, établissementTerritorial2AffiliéModel, établissementTerritorialNonAffiliéModel]
      )

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialLoader(orm)

      // WHEN
      const estUnMonoÉtablissement = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique)

      // THEN
      expect(estUnMonoÉtablissement).toBeFalsy()
    })

    it('quand un seul établissement est rattaché à la même entité juridique', async () => {
      // GIVEN
      const numéroFinessEntitéJuridique = '111222333'
      const autreNuméroFinessEntitéJuridique = '333222111'

      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel({ numéroFinessEntitéJuridique })
      const entitéJuridiqueSansÉtablissementsModel = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel(
        { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique }
      )
      await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel])

      const établissementTerritorial1AffiliéModel =
        ÉtablissementTerritorialIdentitéModelTestFactory.créeÉtablissementTerritorialIdentitéModel({ numéroFinessEntitéJuridique })
      await établissementTerritorialRepository.insert(établissementTerritorial1AffiliéModel)

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialLoader(orm)

      // WHEN
      const estUnMonoÉtablissement = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique)

      // THEN
      expect(estUnMonoÉtablissement).toBeTruthy()
    })
  })
})

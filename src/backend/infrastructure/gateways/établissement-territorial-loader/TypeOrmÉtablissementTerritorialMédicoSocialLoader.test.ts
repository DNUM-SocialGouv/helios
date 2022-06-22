import { Repository } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EntitéJuridiqueModelTestFactory } from '../../../../../database/test-factories/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../../database/test-factories/ÉtablissementTerritorialIdentitéModelTestFactory'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { ÉtablissementTerritorialTestFactory } from '../../../test-factories/ÉtablissementTerritorialTestFactory'
import { getOrm } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialMédicoSocialLoader } from './TypeOrmÉtablissementTerritorialMédicoSocialLoader'

describe('Établissement territorial médico-social loader', () => {
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

  describe('Permet de charger un établissement médico-social par son numéro FINESS', () => {
    it('quand l’établissement territorial est en base et son domaine est médico-social', async () => {
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

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const établissementTerritorialChargée = await typeOrmÉtablissementTerritorialLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorial)

      // THEN
      const établissementTerritorialAttendu: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeÉtablissementTerritorial(
        {
          catégorieÉtablissement: '159',
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        }
      )
      expect(établissementTerritorialChargée).toStrictEqual(établissementTerritorialAttendu)
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
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmÉtablissementTerritorialLoader.chargeParNuméroFiness(numéroFiness)

      // THEN
      const exceptionAttendue = new ÉtablissementTerritorialMédicoSocialNonTrouvée('012345678')
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })

    it('signale que l’établissement territorial n’a pas été trouvé lorsque celui-ci est sanitaire', async () => {
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
          catégorieÉtablissement: '161',
          domaine: DomaineÉtablissementTerritorial.SANITAIRE,
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        }
      )
      await établissementTerritorialRepository.insert(établissementTerritorialModel)

      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorial)

      // THEN
      const exceptionAttendue = new ÉtablissementTerritorialMédicoSocialNonTrouvée('012345678')
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })
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

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const monoÉtablissement = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique)

      // THEN
      expect(monoÉtablissement.estMonoÉtablissement).toBeFalsy()
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

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const monoÉtablissement = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique)

      // THEN
      expect(monoÉtablissement.estMonoÉtablissement).toBeTruthy()
    })
  })
})

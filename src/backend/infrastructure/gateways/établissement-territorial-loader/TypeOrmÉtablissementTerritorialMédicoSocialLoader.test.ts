import { Repository } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { DateMiseÀJourSourceModel } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DateMiseÀJourSourceModelTestFactory } from '../../../../../database/test-factories/DateMiseÀJourSourceModelTestFactory'
import { EntitéJuridiqueModelTestFactory } from '../../../../../database/test-factories/EntitéJuridiqueModelTestFactory'
import { ÉtablissementTerritorialActivitéModelTestFactory } from '../../../../../database/test-factories/ÉtablissementTerritorialActivitéModelTestFactory'
import { ÉtablissementTerritorialIdentitéModelTestFactory } from '../../../../../database/test-factories/ÉtablissementTerritorialIdentitéModelTestFactory'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { ÉtablissementTerritorialTestFactory } from '../../../test-factories/ÉtablissementTerritorialTestFactory'
import { clearAllTables, getOrm, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialMédicoSocialLoader } from './TypeOrmÉtablissementTerritorialMédicoSocialLoader'

describe('Établissement territorial médico-social loader', () => {
  const orm = getOrm()
  let activitéMédicoSocialModelRepository: Repository<ActivitéMédicoSocialModel>
  let établissementTerritorialIdentitéRepository: Repository<ÉtablissementTerritorialIdentitéModel>
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceModel>

  beforeAll(async () => {
    activitéMédicoSocialModelRepository = (await orm).getRepository(ActivitéMédicoSocialModel)
    établissementTerritorialIdentitéRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    dateMiseÀJourSourceRepository = (await orm).getRepository(DateMiseÀJourSourceModel)
  })

  beforeEach(async () => {
    await clearAllTables(await orm)
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  describe('Permet de charger l’identité d’un établissement médico-social par son numéro FINESS', () => {
    it('charge l’identité d’un établissement territorial médico-social', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeMédicoSocial(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
      await établissementTerritorialIdentitéRepository.insert(établissementTerritorialModel)

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const établissementTerritorialChargé = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      const établissementTerritorialAttendu = ÉtablissementTerritorialTestFactory.créeUneIdentitéMédicoSocial(
        {
          catégorieÉtablissement: '159',
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        }
      )
      expect(établissementTerritorialChargé).toStrictEqual(établissementTerritorialAttendu)
    })

    it('signale que l’identité n’a pas été trouvée lorsque l’établissement territorial n’existe pas', async () => {
      // GIVEN
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      const exceptionAttendue = new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial)
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })

    it('signale que l’établissement territorial n’a pas été trouvé lorsque celui-ci est sanitaire', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])
      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeSanitaire(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
      await établissementTerritorialIdentitéRepository.insert(établissementTerritorialModel)

      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      const exceptionAttendue = new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial)
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })
  })

  describe('Permet de charger l’activité d’un établissement médico-social par son numéro FINESS', () => {
    it('charge l’activité d’un établissement territorial médico-social', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeMédicoSocial(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
      await établissementTerritorialIdentitéRepository.insert(établissementTerritorialModel)

      const activitéMédicoSocialModel2019 = ÉtablissementTerritorialActivitéModelTestFactory.crée({ année: 2019, numéroFinessÉtablissementTerritorial })
      const activitéMédicoSocialModel2020 = ÉtablissementTerritorialActivitéModelTestFactory.crée({ année: 2020, numéroFinessÉtablissementTerritorial })
      const activitéMédicoSocialModel2021 = ÉtablissementTerritorialActivitéModelTestFactory.crée({ année: 2021, numéroFinessÉtablissementTerritorial })
      await activitéMédicoSocialModelRepository.insert(activitéMédicoSocialModel2019)
      await activitéMédicoSocialModelRepository.insert(activitéMédicoSocialModel2020)
      await activitéMédicoSocialModelRepository.insert(activitéMédicoSocialModel2021)

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const activitéChargée = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial)

      // THEN
      const activitéAttendue = [
        ÉtablissementTerritorialTestFactory.créeUneActivitéMédicoSocial({ année: 2019, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestFactory.créeUneActivitéMédicoSocial({ année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestFactory.créeUneActivitéMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial }),
      ]
      expect(activitéChargée).toStrictEqual(activitéAttendue)
    })

    it('signale que l’activité n’a pas été trouvée lorsque l’établissement territorial n’existe pas', async () => {
      // GIVEN
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestFactory.crée()])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial)

      // THEN
      const exceptionAttendue = new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial)
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })
  })

  describe('permet de savoir si un établissement est le seul affilié à son entité juridique', () => {
    it('quand plusieurs établissements sont rattachés à la même entité juridique', async () => {
      // GIVEN
      const autreNuméroFinessEntitéJuridique = '333222111'
      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
      const entitéJuridiqueSansÉtablissementsModel = EntitéJuridiqueModelTestFactory.crée(
        { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique }
      )
      await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel])

      const établissementTerritorial1AffiliéModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeMédicoSocial({ numéroFinessEntitéJuridique })
      const établissementTerritorial2AffiliéModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeSanitaire({ numéroFinessEntitéJuridique })
      const établissementTerritorialNonAffiliéModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeMédicoSocial(
        { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial: '321654987' }
      )
      await établissementTerritorialIdentitéRepository.insert(
        [établissementTerritorial1AffiliéModel, établissementTerritorial2AffiliéModel, établissementTerritorialNonAffiliéModel]
      )

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique)

      // THEN
      expect(établissementTerritorial.estMonoÉtablissement).toBeFalsy()
    })

    it('quand un seul établissement est rattaché à la même entité juridique', async () => {
      // GIVEN
      const autreNuméroFinessEntitéJuridique = '333222111'
      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestFactory.crée({ numéroFinessEntitéJuridique })
      const entitéJuridiqueSansÉtablissementsModel = EntitéJuridiqueModelTestFactory.crée(
        { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique }
      )
      await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel])

      const établissementTerritorial1AffiliéModel = ÉtablissementTerritorialIdentitéModelTestFactory.créeMédicoSocial({ numéroFinessEntitéJuridique })
      await établissementTerritorialIdentitéRepository.insert(établissementTerritorial1AffiliéModel)

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique)

      // THEN
      expect(établissementTerritorial.estMonoÉtablissement).toBeTruthy()
    })
  })
})

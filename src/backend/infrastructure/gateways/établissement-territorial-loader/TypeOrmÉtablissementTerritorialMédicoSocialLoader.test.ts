import { Repository } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { DateMiseÀJourSourceModel } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DateMiseÀJourSourceModelTestBuilder } from '../../../../../database/test-builder/DateMiseÀJourSourceModelTestBuilder'
import { EntitéJuridiqueModelTestBuilder } from '../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder'
import { ÉtablissementTerritorialActivitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialActivitéModelTestBuilder'
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { ÉtablissementTerritorialTestBuilder } from '../../../test-builder/ÉtablissementTerritorialTestBuilder'
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

      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
      await établissementTerritorialIdentitéRepository.insert(établissementTerritorialModel)

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const établissementTerritorialChargé = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      const établissementTerritorialAttendu = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial(
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
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      const exceptionAttendue = new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial)
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })

    it('signale que l’établissement territorial n’a pas été trouvé lorsque celui-ci est sanitaire', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])
      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire(
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
    it('charge l’activité d’un établissement territorial médico-social rangé par année', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
      await établissementTerritorialIdentitéRepository.insert(établissementTerritorialModel)

      const activitéMédicoSocialModel2019 = ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial(
        { année: 2019, numéroFinessÉtablissementTerritorial }
      )
      const activitéMédicoSocialModel2020 = ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial(
        { année: 2020, numéroFinessÉtablissementTerritorial }
      )
      const activitéMédicoSocialModel2021 = ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial(
        { année: 2021, numéroFinessÉtablissementTerritorial }
      )
      await activitéMédicoSocialModelRepository.insert(activitéMédicoSocialModel2021)
      await activitéMédicoSocialModelRepository.insert(activitéMédicoSocialModel2020)
      await activitéMédicoSocialModelRepository.insert(activitéMédicoSocialModel2019)

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const activitéChargée = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial)

      // THEN
      const activitéAttendue = [
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({ année: 2019, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({ année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial }),
      ]
      expect(activitéChargée).toStrictEqual(activitéAttendue)
    })
  })

  describe('permet de savoir si un établissement est le seul affilié à son entité juridique', () => {
    it('quand plusieurs établissements sont rattachés à la même entité juridique', async () => {
      // GIVEN
      const autreNuméroFinessEntitéJuridique = '333222111'
      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      const entitéJuridiqueSansÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée(
        { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique }
      )
      await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel])

      const établissementTerritorial1AffiliéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique })
      const établissementTerritorial2AffiliéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique })
      const établissementTerritorialNonAffiliéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial(
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
      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      const entitéJuridiqueSansÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée(
        { numéroFinessEntitéJuridique: autreNuméroFinessEntitéJuridique }
      )
      await entitéJuridiqueRepository.insert([entitéJuridiqueAyantDesÉtablissementsModel, entitéJuridiqueSansÉtablissementsModel])

      const établissementTerritorial1AffiliéModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique })
      await établissementTerritorialIdentitéRepository.insert(établissementTerritorial1AffiliéModel)

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessEntitéJuridique)

      // THEN
      expect(établissementTerritorial.estMonoÉtablissement).toBeTruthy()
    })
  })
})

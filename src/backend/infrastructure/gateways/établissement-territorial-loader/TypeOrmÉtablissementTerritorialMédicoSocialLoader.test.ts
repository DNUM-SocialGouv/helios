import { Repository } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { DateMiseÀJourSourceModel } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DateMiseÀJourFichierSourceModelTestBuilder } from '../../../../../database/test-builder/DateMiseÀJourFichierSourceModelTestBuilder'
import { DateMiseÀJourSourceModelTestBuilder } from '../../../../../database/test-builder/DateMiseÀJourSourceModelTestBuilder'
import { EntitéJuridiqueModelTestBuilder } from '../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder'
import { ÉtablissementTerritorialActivitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialActivitéModelTestBuilder'
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder'
import { ÉtablissementTerritorialMédicoSocial } from '../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
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
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>

  beforeAll(async () => {
    activitéMédicoSocialModelRepository = (await orm).getRepository(ActivitéMédicoSocialModel)
    établissementTerritorialIdentitéRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    dateMiseÀJourSourceRepository = (await orm).getRepository(DateMiseÀJourSourceModel)
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel)
  })

  afterEach(async () => {
    await clearAllTables(await orm)
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  describe('Charge l’identité d’un établissement médico-social', () => {
    it('charge par numéro FINESS et domaine médico-social', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '20220514',
          fichier: FichierSource.FINESS_CS1400102,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(établissementTerritorial).toStrictEqual(ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial(
        {
          numéroFinessEntitéJuridique: {
            dateMiseAJourSource: '2022-05-14',
            value: numéroFinessEntitéJuridique,
          },
          numéroFinessÉtablissementTerritorial: {
            dateMiseAJourSource: '2022-05-14',
            value: numéroFinessÉtablissementTerritorial,
          },
        }
      ))
    })

    it('signale que l’établissement territorial n’a pas été trouvée quand celui-ci n’existe pas', async () => {
      // GIVEN
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const exception = await typeOrmÉtablissementTerritorialLoader.chargeIdentité('numéro-finess-non-existant')

      // THEN
      expect(exception).toStrictEqual(new ÉtablissementTerritorialMédicoSocialNonTrouvée('numéro-finess-non-existant'))
    })

    it('signale que l’établissement territorial n’a pas été trouvé quand celui-ci est sanitaire', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      const typeOrmÉtablissementTerritorialMédicoSocialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const exception = await typeOrmÉtablissementTerritorialMédicoSocialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(exception).toStrictEqual(new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial))
    })
  })

  describe('Charge l’activité d’un établissement médico-social', () => {
    it('charge par numéro FINESS rangé par année ascendante', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '20220514',
          fichier: FichierSource.DIAMANT_ANN_MS_TDP_ET,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '20220515',
          fichier: FichierSource.DIAMANT_ANN_ERRD_EJ_ET,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      await activitéMédicoSocialModelRepository.insert([
        ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeMédicoSocial({ année: 2019, numéroFinessÉtablissementTerritorial }),
      ])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialMédicoSocialLoader(orm)

      // WHEN
      const activité = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(activité).toStrictEqual<ÉtablissementTerritorialMédicoSocial['activités']>([
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
          année: 2019,
          nombreMoyenJournéesAbsencePersonnesAccompagnées: {
            dateMiseAJourSource: '2022-05-14',
            value: 80,
          },
          numéroFinessÉtablissementTerritorial,
          tauxOccupationAccueilDeJour: {
            dateMiseAJourSource: '2022-05-15',
            value: 80,
          },
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
          année: 2020,
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({
          année: 2021,
          numéroFinessÉtablissementTerritorial,
        }),
      ])
    })
  })

  describe('permet de savoir si un établissement est le seul affilié à son entité juridique', () => {
    it('quand plusieurs établissements sont rattachés à la même entité juridique', async () => {
      // GIVEN
      const autreNuméroFinessEntitéJuridique = '333222111'
      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '20220514',
          fichier: FichierSource.FINESS_CS1400102,
        }),
      ])
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
      expect(établissementTerritorial.estMonoÉtablissement).toStrictEqual({
        dateMiseAJourSource: '2022-05-14',
        value: false,
      })
    })

    it('quand un seul établissement est rattaché à la même entité juridique', async () => {
      // GIVEN
      const autreNuméroFinessEntitéJuridique = '333222111'
      const entitéJuridiqueAyantDesÉtablissementsModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '20220514',
          fichier: FichierSource.FINESS_CS1400102,
        }),
      ])
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
      expect(établissementTerritorial.estMonoÉtablissement).toStrictEqual({
        dateMiseAJourSource: '2022-05-14',
        value: true,
      })
    })
  })
})

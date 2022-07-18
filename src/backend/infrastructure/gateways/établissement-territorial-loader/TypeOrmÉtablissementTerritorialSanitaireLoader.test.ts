import { Repository } from 'typeorm'

import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { DateMiseÀJourSourceModel } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DateMiseÀJourSourceModelTestBuilder } from '../../../../../database/test-builder/DateMiseÀJourSourceModelTestBuilder'
import { EntitéJuridiqueModelTestBuilder } from '../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder'
import { ÉtablissementTerritorialActivitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialActivitéModelTestBuilder'
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialTestBuilder } from '../../../test-builder/ÉtablissementTerritorialTestBuilder'
import { clearAllTables, getOrm, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialSanitaireLoader } from './TypeOrmÉtablissementTerritorialSanitaireLoader'

describe('Établissement territorial sanitaire loader', () => {
  const orm = getOrm()
  let activitéSanitaireModelRepository: Repository<ActivitéSanitaireModel>
  let établissementTerritorialRepository: Repository<ÉtablissementTerritorialIdentitéModel>
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let dateMiseÀJourSourceRepository: Repository<DateMiseÀJourSourceModel>

  beforeAll(async () => {
    activitéSanitaireModelRepository = (await orm).getRepository(ActivitéSanitaireModel)
    établissementTerritorialRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    dateMiseÀJourSourceRepository = (await orm).getRepository(DateMiseÀJourSourceModel)
  })

  afterEach(async () => {
    await clearAllTables(await orm)
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  describe('Permet de charger l’identité d’un établissement sanitaire par son numéro FINESS', () => {
    it('charge par numéro FINESS quand l’établissement territorial est en base et son domaine est sanitaire', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire(
        {
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        }
      )
      await établissementTerritorialRepository.insert(établissementTerritorialModel)

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const établissementTerritorialChargée = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      const établissementTerritorialAttendu: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire(
        {
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        }
      )
      expect(établissementTerritorialChargée).toStrictEqual(établissementTerritorialAttendu)
    })

    it('signale que l’établissement territorial n’a pas été trouvé lorsque l’établissement territorial n’existe pas', async () => {
      // GIVEN
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])
      const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeIdentité(numéroFinessEntitéJuridique)

      // THEN
      const exceptionAttendue = new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessEntitéJuridique)
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })

    it('signale que l’établissement territorial n’a pas été trouvé lorsque celui-ci est médico-social', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial(
        {
          numéroFinessEntitéJuridique,
          numéroFinessÉtablissementTerritorial,
        }
      )
      await établissementTerritorialRepository.insert(établissementTerritorialModel)

      const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const exceptionReçue = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      const exceptionAttendue = new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial)
      expect(exceptionReçue).toStrictEqual(exceptionAttendue)
    })
  })

  describe('Permet de charger l’activité d’un établissement sanitaire par son numéro FINESS', () => {
    it('charge l’activité d’un établissement territorial sanitaire rangé par année', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
      await établissementTerritorialRepository.insert(établissementTerritorialModel)

      const activitéSanitaireModel2016 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2016, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2017 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2017, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2018 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2018, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2019 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2019, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2020 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2020, numéroFinessÉtablissementTerritorial }
      )
      await activitéSanitaireModelRepository.insert(
        [activitéSanitaireModel2016, activitéSanitaireModel2017, activitéSanitaireModel2018, activitéSanitaireModel2019, activitéSanitaireModel2020]
      )

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const activitéChargée = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial)

      // THEN
      const activitéAttendue: ÉtablissementTerritorialSanitaireActivité[] = [
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2016, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2017, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2018, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2019, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2020, numéroFinessÉtablissementTerritorial }),
      ]
      expect(activitéChargée).toStrictEqual(activitéAttendue)
    })

    it('charge les 5 dernières années de l’activité d’un établissement territorial sanitaire', async () => {
      // GIVEN
      const entitéJuridiqueModel = EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique })
      await entitéJuridiqueRepository.insert(entitéJuridiqueModel)
      await dateMiseÀJourSourceRepository.insert([DateMiseÀJourSourceModelTestBuilder.crée()])

      const établissementTerritorialModel = ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire(
        { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
      )
      await établissementTerritorialRepository.insert(établissementTerritorialModel)

      const activitéSanitaireModel2016 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2016, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2017 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2017, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2018 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2018, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2019 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2019, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2020 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2020, numéroFinessÉtablissementTerritorial }
      )
      const activitéSanitaireModel2021 = ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire(
        { année: 2021, numéroFinessÉtablissementTerritorial }
      )
      await activitéSanitaireModelRepository.insert(
        [
          activitéSanitaireModel2016,
          activitéSanitaireModel2017,
          activitéSanitaireModel2018,
          activitéSanitaireModel2019,
          activitéSanitaireModel2020,
          activitéSanitaireModel2021,
        ]
      )

      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const activitéChargée = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial)

      // THEN
      const activitéAttendue: ÉtablissementTerritorialSanitaireActivité[] = [
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2017, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2018, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2019, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({ année: 2021, numéroFinessÉtablissementTerritorial }),
      ]
      expect(activitéChargée).toStrictEqual(activitéAttendue)
    })
  })
})

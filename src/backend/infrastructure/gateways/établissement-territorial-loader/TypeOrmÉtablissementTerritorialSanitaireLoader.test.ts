import { Repository } from 'typeorm'

import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { AutorisationSanitaireModel } from '../../../../../database/models/AutorisationSanitaireModel'
import { AutreActivitéSanitaireModel } from '../../../../../database/models/AutreActivitéSanitaireModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { ReconnaissanceContractuelleSanitaireModel } from '../../../../../database/models/ReconnaissanceContractuelleSanitaireModel'
import { ÉquipementMatérielLourdModel } from '../../../../../database/models/ÉquipementMatérielLourdModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DateMiseÀJourFichierSourceModelTestBuilder } from '../../../../../database/test-builder/DateMiseÀJourFichierSourceModelTestBuilder'
import { EntitéJuridiqueModelTestBuilder } from '../../../../../database/test-builder/EntitéJuridiqueModelTestBuilder'
import { ÉtablissementTerritorialActivitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialActivitéModelTestBuilder'
import { ÉtablissementTerritorialAutorisationModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialAutorisationModelTestBuilder'
import { ÉtablissementTerritorialIdentitéModelTestBuilder } from '../../../../../database/test-builder/ÉtablissementTerritorialIdentitéModelTestBuilder'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialTestBuilder } from '../../../test-builder/ÉtablissementTerritorialTestBuilder'
import { clearAllTables, getOrm, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../../testHelper'
import { TypeOrmÉtablissementTerritorialSanitaireLoader } from './TypeOrmÉtablissementTerritorialSanitaireLoader'

describe('Établissement territorial sanitaire loader', () => {
  const orm = getOrm()
  let activitéSanitaireModelRepository: Repository<ActivitéSanitaireModel>
  let établissementTerritorialIdentitéRepository: Repository<ÉtablissementTerritorialIdentitéModel>
  let entitéJuridiqueRepository: Repository<EntitéJuridiqueModel>
  let dateMiseÀJourFichierSourceRepository: Repository<DateMiseÀJourFichierSourceModel>
  let autorisationSanitaireRepository: Repository<AutorisationSanitaireModel>
  let équipementMatérielLourdRepository: Repository<ÉquipementMatérielLourdModel>
  let autreActivitéSanitaireRepository: Repository<AutreActivitéSanitaireModel>
  let reconnaissanceContractuelleSanitaireRepository: Repository<ReconnaissanceContractuelleSanitaireModel>

  beforeAll(async () => {
    activitéSanitaireModelRepository = (await orm).getRepository(ActivitéSanitaireModel)
    établissementTerritorialIdentitéRepository = (await orm).getRepository(ÉtablissementTerritorialIdentitéModel)
    entitéJuridiqueRepository = (await orm).getRepository(EntitéJuridiqueModel)
    dateMiseÀJourFichierSourceRepository = (await orm).getRepository(DateMiseÀJourFichierSourceModel)
    autorisationSanitaireRepository = (await orm).getRepository(AutorisationSanitaireModel)
    équipementMatérielLourdRepository = (await orm).getRepository(ÉquipementMatérielLourdModel)
    autreActivitéSanitaireRepository = (await orm).getRepository(AutreActivitéSanitaireModel)
    reconnaissanceContractuelleSanitaireRepository = (await orm).getRepository(ReconnaissanceContractuelleSanitaireModel)
  })

  afterEach(async () => {
    await clearAllTables(await orm)
  })

  afterAll(async () => {
    await (await orm).destroy()
  })

  describe('Charge l’identité d’un établissement sanitaire', () => {
    it('charge par numéro FINESS et domaine sanitaire', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-05-14',
          fichier: FichierSource.FINESS_CS1400102,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const établissementTerritorial = await typeOrmÉtablissementTerritorialLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(établissementTerritorial).toStrictEqual(ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire(
        {
          numéroFinessEntitéJuridique: {
            dateMiseÀJourSource: '2022-05-14',
            value: numéroFinessEntitéJuridique,
          },
          numéroFinessÉtablissementTerritorial: {
            dateMiseÀJourSource: '2022-05-14',
            value: numéroFinessÉtablissementTerritorial,
          },
        }
      ))
    })

    it('signale que l’établissement territorial n’a pas été trouvé quand celui-ci n’existe pas', async () => {
      // GIVEN
      const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const exception = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeIdentité('numéro-finess-non-existant')

      // THEN
      expect(exception).toStrictEqual(new ÉtablissementTerritorialSanitaireNonTrouvée('numéro-finess-non-existant'))
    })

    it('signale que l’établissement territorial n’a pas été trouvé quand celui-ci est médico-social', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeMédicoSocial({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      const typeOrmÉtablissementTerritorialSanitaireLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const exception = await typeOrmÉtablissementTerritorialSanitaireLoader.chargeIdentité(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(exception).toStrictEqual(new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial))
    })
  })

  describe('Charge l’activité d’un établissement sanitaire', () => {
    it('charge par numéro FINESS rangé par année ascendante', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-05-14',
          fichier: FichierSource.DIAMANT_ANN_RPU,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-05-15',
          fichier: FichierSource.DIAMANT_MEN_PMSI_ANNUEL,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      await activitéSanitaireModelRepository.insert([
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2020, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2019, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2018, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2017, numéroFinessÉtablissementTerritorial }),
        ÉtablissementTerritorialActivitéModelTestBuilder.créeSanitaire({ année: 2016, numéroFinessÉtablissementTerritorial }),
      ])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const activité = await typeOrmÉtablissementTerritorialLoader.chargeActivité(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(activité).toStrictEqual<ÉtablissementTerritorialSanitaireActivité[]>([
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2016,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2022-05-15',
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2017,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2022-05-15',
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2018,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2022-05-15',
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2019,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2022-05-15',
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire({
          année: 2020,
          nombreDePassagesAuxUrgences: {
            dateMiseÀJourSource: '2022-05-15',
            value: 60_000,
          },
          numéroFinessÉtablissementTerritorial,
        }),
      ])
    })
  })

  describe('Charge les autorisations et capacités d’un établissement sanitaire', () => {
    it.only('charge les autorisations triés par activité, modalité puis forme', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400103,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      await autorisationSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          activité: '16',
          forme: '14',
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: 'Non saisonnier',
          libelléModalité: 'Hémodialyse en unité médicalisée',
          modalité: '42',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          activité: '16',
          forme: '00',
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: 'Pas de forme',
          libelléModalité: 'Hémodialyse en unité médicalisée',
          modalité: '42',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          activité: '50',
          forme: '00',
          libelléActivité: 'Soins de suite et de réadaptation non spécialisés',
          libelléForme: 'Pas de forme',
          libelléModalité: 'Dialyse péritonéale à domicile',
          modalité: '46',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          activité: '16',
          forme: '14',
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: 'Non saisonnier',
          libelléModalité: 'Hémodialyse à domicile',
          modalité: '45',
          numéroFinessÉtablissementTerritorial,
        }),
      ])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const { autorisations } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(autorisations).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité['autorisations']>({
        activités: [
          {
            code: '16',
            libellé: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
            modalités: [
              {
                code: '42',
                formes: [
                  {
                    code: '00',
                    dates: {
                      dateDAutorisation: '2005-10-11',
                      dateDeFin: '2026-05-03',
                      dateDeMiseEnOeuvre: '2008-12-04',
                      numéroArhgos: '01-00-000',
                    },
                    libellé: 'Pas de forme',
                  },
                  {
                    code: '14',
                    dates: {
                      dateDAutorisation: '2005-10-11',
                      dateDeFin: '2026-05-03',
                      dateDeMiseEnOeuvre: '2008-12-04',
                      numéroArhgos: '01-00-000',
                    },
                    libellé: 'Non saisonnier',
                  },
                ],
                libellé: 'Hémodialyse en unité médicalisée',
              },
              {
                code: '45',
                formes: [
                  {
                    code: '14',
                    dates: {
                      dateDAutorisation: '2005-10-11',
                      dateDeFin: '2026-05-03',
                      dateDeMiseEnOeuvre: '2008-12-04',
                      numéroArhgos: '01-00-000',
                    },
                    libellé: 'Non saisonnier',
                  },
                ],
                libellé: 'Hémodialyse à domicile',
              },
            ],
          },
          {
            code: '50',
            libellé: 'Soins de suite et de réadaptation non spécialisés',
            modalités: [
              {
                code: '46',
                formes: [
                  {
                    code: '00',
                    dates: {
                      dateDAutorisation: '2005-10-11',
                      dateDeFin: '2026-05-03',
                      dateDeMiseEnOeuvre: '2008-12-04',
                      numéroArhgos: '01-00-000',
                    },
                    libellé: 'Pas de forme',
                  },
                ],
                libellé: 'Dialyse péritonéale à domicile',
              },
            ],
          },
        ],
        dateMiseÀJourSource: '2022-08-29',
      })
    })
  })
})

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

  beforeEach(async () => {
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
    it('charge les autorisations triées par activité, modalité puis forme dans l’ordre croissant', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400103,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400104,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1600101,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1600102,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      await autorisationSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          codeActivité: '16',
          codeForme: '14',
          codeModalité: '42',
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: 'Non saisonnier',
          libelléModalité: 'Hémodialyse en unité médicalisée',
          numéroAutorisationArhgos: '01-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          codeActivité: '16',
          codeForme: '00',
          codeModalité: '42',
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: 'Pas de forme',
          libelléModalité: 'Hémodialyse en unité médicalisée',
          numéroAutorisationArhgos: '02-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          codeActivité: '50',
          codeForme: '00',
          codeModalité: '46',
          libelléActivité: 'Soins de suite et de réadaptation non spécialisés',
          libelléForme: 'Pas de forme',
          libelléModalité: 'Dialyse péritonéale à domicile',
          numéroAutorisationArhgos: '03-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutorisationSanitaire({
          codeActivité: '16',
          codeForme: '14',
          codeModalité: '45',
          libelléActivité: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          libelléForme: 'Non saisonnier',
          libelléModalité: 'Hémodialyse à domicile',
          numéroAutorisationArhgos: '04-00-0000',
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
                    autorisationSanitaire: {
                      dateDAutorisation: '2005-10-11',
                      dateDeFin: '2026-05-03',
                      dateDeMiseEnOeuvre: '2008-12-04',
                      numéroArhgos: '02-00-0000',
                    },
                    code: '00',
                    libellé: 'Pas de forme',
                  },
                  {
                    autorisationSanitaire: {
                      dateDAutorisation: '2005-10-11',
                      dateDeFin: '2026-05-03',
                      dateDeMiseEnOeuvre: '2008-12-04',
                      numéroArhgos: '01-00-0000',
                    },
                    code: '14',
                    libellé: 'Non saisonnier',
                  },
                ],
                libellé: 'Hémodialyse en unité médicalisée',
              },
              {
                code: '45',
                formes: [
                  {
                    autorisationSanitaire: {
                      dateDAutorisation: '2005-10-11',
                      dateDeFin: '2026-05-03',
                      dateDeMiseEnOeuvre: '2008-12-04',
                      numéroArhgos: '04-00-0000',
                    },
                    code: '14',
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
                    autorisationSanitaire: {
                      dateDAutorisation: '2005-10-11',
                      dateDeFin: '2026-05-03',
                      dateDeMiseEnOeuvre: '2008-12-04',
                      numéroArhgos: '03-00-0000',
                    },
                    code: '00',
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

    it('charge les autres activités triées par activité, modalité puis forme dans l’ordre croissant', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400103,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400104,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1600101,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1600102,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      await autreActivitéSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutreActivitéSanitaire({
          codeActivité: 'A1',
          codeForme: '00',
          codeModalité: 'M0',
          libelléActivité: 'Dépôt de sang',
          libelléForme: 'Pas de forme',
          libelléModalité: "Dépôt d'urgence",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutreActivitéSanitaire({
          codeActivité: 'A1',
          codeForme: '15',
          codeModalité: 'M0',
          libelléActivité: 'Dépôt de sang',
          libelléForme: 'Forme non précisée',
          libelléModalité: "Dépôt d'urgence",
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutreActivitéSanitaire({
          codeActivité: 'A1',
          codeForme: '15',
          codeModalité: 'M2',
          libelléActivité: 'Dépôt de sang',
          libelléForme: 'Forme non précisée',
          libelléModalité: 'Dépôt relais',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeAutreActivitéSanitaire({
          codeActivité: 'A0',
          codeForme: '00',
          codeModalité: 'M0',
          libelléActivité: 'Installation de chirurgie esthétique',
          libelléForme: 'Pas de forme',
          libelléModalité: "Dépôt d'urgence",
          numéroFinessÉtablissementTerritorial,
        }),
      ])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const { autresActivités } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(autresActivités).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité['autresActivités']>({
        activités: [
          {
            code: 'A0',
            libellé: 'Installation de chirurgie esthétique',
            modalités: [
              {
                code: 'M0',
                formes: [
                  {
                    autreActivitéSanitaire: {
                      dateDAutorisation: '2019-06-03',
                      dateDeFin: '2024-08-31',
                      dateDeMiseEnOeuvre: '2019-06-03',
                    },
                    code: '00',
                    libellé: 'Pas de forme',
                  },
                ],
                libellé: "Dépôt d'urgence",
              },
            ],
          },
          {
            code: 'A1',
            libellé: 'Dépôt de sang',
            modalités: [
              {
                code: 'M0',
                formes: [
                  {
                    autreActivitéSanitaire: {
                      dateDAutorisation: '2019-06-03',
                      dateDeFin: '2024-08-31',
                      dateDeMiseEnOeuvre: '2019-06-03',
                    },
                    code: '00',
                    libellé: 'Pas de forme',
                  },
                  {
                    autreActivitéSanitaire: {
                      dateDAutorisation: '2019-06-03',
                      dateDeFin: '2024-08-31',
                      dateDeMiseEnOeuvre: '2019-06-03',
                    },
                    code: '15',
                    libellé: 'Forme non précisée',
                  },
                ],
                libellé: "Dépôt d'urgence",
              },
              {
                code: 'M2',
                formes: [
                  {
                    autreActivitéSanitaire: {
                      dateDAutorisation: '2019-06-03',
                      dateDeFin: '2024-08-31',
                      dateDeMiseEnOeuvre: '2019-06-03',
                    },
                    code: '15',
                    libellé: 'Forme non précisée',
                  },
                ],
                libellé: 'Dépôt relais',
              },
            ],
          },
        ],
        dateMiseÀJourSource: '2022-08-29',
      })
    })

    it('charge les reconnaissances contractuelles triées par activité, modalité puis forme dans l’ordre croissant', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400103,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400104,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1600101,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1600102,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      await reconnaissanceContractuelleSanitaireRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeReconnaissanceContractuelleSanitaire({
          codeActivité: 'R7',
          codeForme: '01',
          codeModalité: 'N8',
          libelléActivité: 'Surveillance continue',
          libelléForme: 'Hospitalisation complète (24 heures consécutives ou plus)',
          libelléModalité: 'USC polyvalente - adulte (non adossée à une unité de réanimation)',
          numéroAutorisationArhgos: '01-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeReconnaissanceContractuelleSanitaire({
          codeActivité: 'R7',
          codeForme: '01',
          codeModalité: 'N4',
          libelléActivité: 'Surveillance continue',
          libelléForme: 'Hospitalisation complète (24 heures consécutives ou plus)',
          libelléModalité: 'Equipe mobile',
          numéroAutorisationArhgos: '02-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeReconnaissanceContractuelleSanitaire({
          codeActivité: 'R7',
          codeForme: '00',
          codeModalité: 'N8',
          libelléActivité: 'Surveillance continue',
          libelléForme: 'Pas de forme',
          libelléModalité: 'USC polyvalente - adulte (non adossée à une unité de réanimation)',
          numéroAutorisationArhgos: '03-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeReconnaissanceContractuelleSanitaire({
          codeActivité: 'S6',
          codeForme: '00',
          codeModalité: 'B3',
          libelléActivité: "Structure spécifique d'hospitalisation",
          libelléForme: 'Pas de forme',
          libelléModalité: 'Clinique ouverte',
          numéroAutorisationArhgos: '04-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
      ])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const { reconnaissancesContractuelles } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(reconnaissancesContractuelles).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité['reconnaissancesContractuelles']>({
        activités: [
          {
            code: 'R7',
            libellé: 'Surveillance continue',
            modalités: [
              {
                code: 'N4',
                formes: [
                  {
                    code: '01',
                    libellé: 'Hospitalisation complète (24 heures consécutives ou plus)',
                    reconnaissanceContractuelleSanitaire: {
                      capacitéAutorisée: 4,
                      dateDEffetAsr: '2013-11-30',
                      dateDEffetCpom: '2012-12-01',
                      dateDeFinCpom: '2018-11-30',
                      numéroArhgos: '02-00-0000',
                      numéroCpom: '01-00-C00000',
                    },
                  },
                ],
                libellé: 'Equipe mobile',
              },
              {
                code: 'N8',
                formes: [
                  {
                    code: '00',
                    libellé: 'Pas de forme',
                    reconnaissanceContractuelleSanitaire: {
                      capacitéAutorisée: 4,
                      dateDEffetAsr: '2013-11-30',
                      dateDEffetCpom: '2012-12-01',
                      dateDeFinCpom: '2018-11-30',
                      numéroArhgos: '03-00-0000',
                      numéroCpom: '01-00-C00000',
                    },
                  },
                  {
                    code: '01',
                    libellé: 'Hospitalisation complète (24 heures consécutives ou plus)',
                    reconnaissanceContractuelleSanitaire: {
                      capacitéAutorisée: 4,
                      dateDEffetAsr: '2013-11-30',
                      dateDEffetCpom: '2012-12-01',
                      dateDeFinCpom: '2018-11-30',
                      numéroArhgos: '01-00-0000',
                      numéroCpom: '01-00-C00000',
                    },
                  },
                ],
                libellé: 'USC polyvalente - adulte (non adossée à une unité de réanimation)',
              },
            ],
          },
          {
            code: 'S6',
            libellé: "Structure spécifique d'hospitalisation",
            modalités: [
              {
                code: 'B3',
                formes: [
                  {
                    code: '00',
                    libellé: 'Pas de forme',
                    reconnaissanceContractuelleSanitaire: {
                      capacitéAutorisée: 4,
                      dateDEffetAsr: '2013-11-30',
                      dateDEffetCpom: '2012-12-01',
                      dateDeFinCpom: '2018-11-30',
                      numéroArhgos: '04-00-0000',
                      numéroCpom: '01-00-C00000',
                    },
                  },
                ],
                libellé: 'Clinique ouverte',
              },
            ],
          },
        ],
        dateMiseÀJourSource: '2022-08-29',
      })
    })

    it('charge les équipements matériels lourds triés par code', async () => {
      // GIVEN
      await entitéJuridiqueRepository.insert(EntitéJuridiqueModelTestBuilder.crée({ numéroFinessEntitéJuridique }))
      await dateMiseÀJourFichierSourceRepository.insert([
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400103,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1400104,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1600101,
        }),
        DateMiseÀJourFichierSourceModelTestBuilder.crée({
          dernièreMiseÀJour: '2022-08-29',
          fichier: FichierSource.FINESS_CS1600102,
        }),
      ])
      await établissementTerritorialIdentitéRepository.insert(
        ÉtablissementTerritorialIdentitéModelTestBuilder.créeSanitaire({ numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial })
      )
      await équipementMatérielLourdRepository.insert([
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeÉquipementMatérielLourdSanitaire({
          codeÉquipementMatérielLourd: '05602',
          libelléÉquipementMatérielLourd: 'Scanographe à utilisation médicale',
          numéroAutorisationArhgos: '01-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeÉquipementMatérielLourdSanitaire({
          codeÉquipementMatérielLourd: '05602',
          libelléÉquipementMatérielLourd: 'Scanographe à utilisation médicale',
          numéroAutorisationArhgos: '02-00-0000',
          numéroFinessÉtablissementTerritorial,
        }),
        ÉtablissementTerritorialAutorisationModelTestBuilder.créeÉquipementMatérielLourdSanitaire({
          codeÉquipementMatérielLourd: '06201',
          libelléÉquipementMatérielLourd: "Appareil d'IRM à utilisation clinique",
          numéroAutorisationArhgos: '11-11-1111',
          numéroFinessÉtablissementTerritorial,
        }),
      ])
      const typeOrmÉtablissementTerritorialLoader = new TypeOrmÉtablissementTerritorialSanitaireLoader(orm)

      // WHEN
      const { équipementsMatérielsLourds } = await typeOrmÉtablissementTerritorialLoader.chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial)

      // THEN
      expect(équipementsMatérielsLourds).toStrictEqual<ÉtablissementTerritorialSanitaireAutorisationEtCapacité['équipementsMatérielsLourds']>({
        dateMiseÀJourSource: '2022-08-29',
        équipements: [
          {
            autorisations: [
              {
                dateDAutorisation: '2007-11-06',
                dateDeFin: '2029-01-01',
                dateDeMiseEnOeuvre: '2011-10-19',
                numéroArhgos: '01-00-0000',
              },
              {
                dateDAutorisation: '2007-11-06',
                dateDeFin: '2029-01-01',
                dateDeMiseEnOeuvre: '2011-10-19',
                numéroArhgos: '02-00-0000',
              },
            ],
            code: '05602',
            libellé: 'Scanographe à utilisation médicale',
          },
          {
            autorisations: [
              {
                dateDAutorisation: '2007-11-06',
                dateDeFin: '2029-01-01',
                dateDeMiseEnOeuvre: '2011-10-19',
                numéroArhgos: '11-11-1111',
              },
            ],
            code: '06201',
            libellé: "Appareil d'IRM à utilisation clinique",
          },
        ],
      })
    })
  })
})

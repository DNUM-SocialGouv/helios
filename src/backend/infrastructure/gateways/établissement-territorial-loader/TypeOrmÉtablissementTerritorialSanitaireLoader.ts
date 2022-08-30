import { DataSource } from 'typeorm'

import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { AutorisationSanitaireModel } from '../../../../../database/models/AutorisationSanitaireModel'
import { AutreActivitéSanitaireModel } from '../../../../../database/models/AutreActivitéSanitaireModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { ReconnaissanceContractuelleSanitaireModel } from '../../../../../database/models/ReconnaissanceContractuelleSanitaireModel'
import { ÉquipementMatérielLourdModel } from '../../../../../database/models/ÉquipementMatérielLourdModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import {
  AutorisationSanitaire,
  AutorisationSanitaireAvecDates,
  AutorisationSanitaireAvecDatesEtNuméroArhgos,
  AutorisationSanitaireAvecDatesNuméroArhgosEtCapacité,
  AutorisationSanitaireForme,
  AutorisationSanitaireModalité,
  AutorisationÉquipementMatérielLourd,
  AutreActivitéSanitaire,
  ReconnaissanceContractuelleSanitaire,
  ÉquipementMatérielLourd,
  ÉtablissementTerritorialSanitaireAutorisationEtCapacité,
} from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialSanitaireLoader } from '../../../métier/gateways/ÉtablissementTerritorialSanitaireLoader'

export class TypeOrmÉtablissementTerritorialSanitaireLoader implements ÉtablissementTerritorialSanitaireLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireActivité[]> {
    const activitésÉtablissementTerritorialActivitésModel = await this.chargeLesActivitésModel(numéroFinessÉtablissementTerritorial)
    const dateDeMiseAJourAnnRpuModel = await this.chargeLaDateDeMiseÀJourAnnRpuModel() as DateMiseÀJourFichierSourceModel
    const dateDeMiseAJourMenPmsiAnnuelModel = await this.chargeLaDateDeMiseÀJourMenPmsiAnnuelModel() as DateMiseÀJourFichierSourceModel

    return this.construisActivité(
      activitésÉtablissementTerritorialActivitésModel,
      dateDeMiseAJourAnnRpuModel,
      dateDeMiseAJourMenPmsiAnnuelModel
    )
  }

  async chargeIdentité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialSanitaireNonTrouvée> {
    const établissementTerritorialIdentitéModel = await this.chargeLIdentitéModel(numéroFinessÉtablissementTerritorial)

    if (!établissementTerritorialIdentitéModel) {
      return new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial)
    }

    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJourFinessCs1400102Model() as DateMiseÀJourFichierSourceModel

    return this.construisIdentité(établissementTerritorialIdentitéModel, dateDeMiseÀJourIdentitéModel)
  }

  async chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireAutorisationEtCapacité> {
    const [
      autorisationsDeLÉtablissementModel,
      équipementsDeLÉtablissementModel,
      autresActivitésDeLÉtablissementModel,
      reconnaissancesContractuellesDeLÉtablissementModel,
      dateDeMiseÀJourFinessCs1400103Model,
      dateDeMiseÀJourFinessCs1400104Model,
      dateDeMiseÀJourFinessCs1600101Mode1,
      dateDeMiseÀJourFinessCs1600102Mode1,
    ] = await Promise.all([
      this.chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial),
      this.chargeLesÉquipementsMatérielsLourdsModel(numéroFinessÉtablissementTerritorial),
      this.chargeLesAutresActivitésModel(numéroFinessÉtablissementTerritorial),
      this.chargeLesReconnaissancesContractuellesModel(numéroFinessÉtablissementTerritorial),
      this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400103) as Promise<DateMiseÀJourFichierSourceModel>,
      this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400104) as Promise<DateMiseÀJourFichierSourceModel>,
      this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1600101) as Promise<DateMiseÀJourFichierSourceModel>,
      this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1600102) as Promise<DateMiseÀJourFichierSourceModel>,
    ])

    return {
      autorisations: this.construisLesAutorisations(autorisationsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400103Model),
      autresActivités: this.construisLesAutresActivités(autresActivitésDeLÉtablissementModel, dateDeMiseÀJourFinessCs1600101Mode1),
      numéroFinessÉtablissementTerritorial,
      reconnaissancesContractuelles: this.construisLesReconnaissancesContractuelles(
        reconnaissancesContractuellesDeLÉtablissementModel,
        dateDeMiseÀJourFinessCs1600102Mode1
      ),
      équipementsMatérielsLourds: this.construisLesÉquipementsMatérielsLourds(équipementsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400104Model),
    }
  }

  private async chargeLesÉquipementsMatérielsLourdsModel(numéroFinessÉtablissementTerritorial: string):
  Promise<ÉquipementMatérielLourdModel[]> {
    return await (await this.orm)
      .getRepository(ÉquipementMatérielLourdModel)
      .find({
        // eslint-disable-next-line sort-keys
        order: { codeÉquipementMatérielLourd: 'ASC', numéroAutorisationArhgos: 'ASC' },
        where: { numéroFinessÉtablissementTerritorial },
      })
  }

  private async chargeLesReconnaissancesContractuellesModel(numéroFinessÉtablissementTerritorial: string):
  Promise<ReconnaissanceContractuelleSanitaireModel[]> {
    return await (await this.orm)
      .getRepository(ReconnaissanceContractuelleSanitaireModel)
      .find({
        // eslint-disable-next-line sort-keys
        order: { codeActivité: 'ASC', codeModalité: 'ASC', codeForme: 'ASC' },
        where: { numéroFinessÉtablissementTerritorial },
      })
  }

  private async chargeLesAutresActivitésModel(numéroFinessÉtablissementTerritorial: string): Promise<AutreActivitéSanitaireModel[]> {
    return await (await this.orm)
      .getRepository(AutreActivitéSanitaireModel)
      .find({
        // eslint-disable-next-line sort-keys
        order: { codeActivité: 'ASC', codeModalité: 'ASC', codeForme: 'ASC' },
        where: { numéroFinessÉtablissementTerritorial },
      })
  }

  private async chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial: string): Promise<AutorisationSanitaireModel[]> {
    return await (await this.orm)
      .getRepository(AutorisationSanitaireModel)
      .find({
        // eslint-disable-next-line sort-keys
        order: { codeActivité: 'ASC', codeModalité: 'ASC', codeForme: 'ASC' },
        where: { numéroFinessÉtablissementTerritorial },
      })
  }

  private async chargeLesActivitésModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm)
      .getRepository(ActivitéSanitaireModel)
      .find({
        order: { année: 'ASC' },
        where: { numéroFinessÉtablissementTerritorial },
      })
  }

  private async chargeLIdentitéModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .findOneBy({
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        numéroFinessÉtablissementTerritorial,
      })
  }

  private async chargeLaDateDeMiseÀJourModel(fichierSource: FichierSource): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: fichierSource })
  }

  private async chargeLaDateDeMiseÀJourFinessCs1400102Model(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.FINESS_CS1400102 })
  }

  private async chargeLaDateDeMiseÀJourAnnRpuModel(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_ANN_RPU })
  }

  private async chargeLaDateDeMiseÀJourMenPmsiAnnuelModel(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_MEN_PMSI_ANNUEL })
  }

  private construisIdentité(
    établissementTerritorialIdentitéModel: ÉtablissementTerritorialIdentitéModel,
    dateDeMiseÀJourIdentitéModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialIdentité {
    return {
      adresseAcheminement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseAcheminement,
      },
      adresseNuméroVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseNuméroVoie,
      },
      adresseTypeVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseTypeVoie,
      },
      adresseVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseVoie,
      },
      catégorieÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.catégorieÉtablissement,
      },
      courriel: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.courriel,
      },
      libelléCatégorieÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.libelléCatégorieÉtablissement,
      },
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementPrincipal: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessÉtablissementPrincipal,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessÉtablissementTerritorial,
      },
      raisonSociale: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.raisonSociale,
      },
      typeÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.typeÉtablissement,
      },
      téléphone: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.téléphone,
      },
    }
  }

  private construisActivité(
    établissementTerritorialActivitésModel: ActivitéSanitaireModel[],
    dateDeMiseAJourAnnRpuModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourMenPmsiAnnuelModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireActivité[] {
    return établissementTerritorialActivitésModel.map<ÉtablissementTerritorialSanitaireActivité>((établissementTerritorialModel) =>
      ({
        année: établissementTerritorialModel.année,
        nombreDePassagesAuxUrgences: {
          dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreDePassagesAuxUrgences,
        },
        nombreJournéesCompletePsy: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreJournéesCompletePsy,
        },
        nombreJournéesCompletesSsr: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreJournéesCompletesSsr,
        },
        nombreJournéesPartiellesPsy: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreJournéesPartiellesPsy,
        },
        nombreJournéesPartielsSsr: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreJournéesPartielsSsr,
        },
        nombreSéjoursCompletsChirurgie: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursCompletsChirurgie,
        },
        nombreSéjoursCompletsMédecine: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursCompletsMédecine,
        },
        nombreSéjoursCompletsObstétrique: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursCompletsObstétrique,
        },
        nombreSéjoursPartielsChirurgie: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursPartielsChirurgie,
        },
        nombreSéjoursPartielsMédecine: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursPartielsMédecine,
        },
        nombreSéjoursPartielsObstétrique: {
          dateMiseÀJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursPartielsObstétrique,
        },
        numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
      }))
  }

  private construisLesAutorisations(
    autorisationsModel: AutorisationSanitaireModel[],
    dateMiseÀJourSource: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité['autorisations'] {
    const activitésDeLÉtablissement: AutorisationSanitaire[] = []

    autorisationsModel.forEach((autorisationModel: AutorisationSanitaireModel) => {
      const codeActivité = autorisationModel.codeActivité
      const codeModalité = autorisationModel.codeModalité
      const codeForme = autorisationModel.codeForme

      const activitéCréée = activitésDeLÉtablissement.find((activité) => activité.code === codeActivité)

      if (!activitéCréée) {
        activitésDeLÉtablissement.push(this.construisLActivitéDUneAutorisation(autorisationModel))
      } else {
        const modalitéCréée = activitéCréée.modalités.find((modalité) => modalité.code === codeModalité)

        if (!modalitéCréée) {
          activitéCréée.modalités.push(this.construisLaModalitéDUneAutorisation(autorisationModel))
        } else {
          const formeCréée = modalitéCréée.formes.find((forme) => forme.code === codeForme)

          if (!formeCréée) {
            modalitéCréée.formes.push(this.construisLaFormeDUneAutorisation(autorisationModel))
          }
        }
      }
    })

    return {
      activités: activitésDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSource.dernièreMiseÀJour,
    }
  }

  private construisLActivitéDUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaire {
    return {
      code: autorisationModel.codeActivité,
      libellé: autorisationModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneAutorisation(autorisationModel)],
    }
  }

  private construisLaModalitéDUneAutorisation(autorisationModel: AutorisationSanitaireModel):
  AutorisationSanitaireModalité<AutorisationSanitaireAvecDatesEtNuméroArhgos> {
    return {
      code: autorisationModel.codeModalité,
      formes: [this.construisLaFormeDUneAutorisation(autorisationModel)],
      libellé: autorisationModel.libelléModalité,
    }
  }

  private construisLaFormeDUneAutorisation(autorisationModel: AutorisationSanitaireModel):
  AutorisationSanitaireForme<AutorisationSanitaireAvecDatesEtNuméroArhgos> {
    return {
      code: autorisationModel.codeForme,
      dates: this.construisLesDatesDUneAutorisation(autorisationModel),
      libellé: autorisationModel.libelléForme,
    }
  }

  private construisLesDatesDUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaireAvecDatesEtNuméroArhgos {
    return {
      dateDAutorisation: autorisationModel.dateAutorisation,
      dateDeFin: autorisationModel.dateFin,
      dateDeMiseEnOeuvre: autorisationModel.dateMiseEnOeuvre,
      numéroArhgos: autorisationModel.numéroAutorisationArhgos,
    }
  }

  private construisLesAutresActivités(
    autresActivitésModel: AutreActivitéSanitaireModel[],
    dateMiseÀJourSource: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité['autresActivités'] {
    const activitésDeLÉtablissement: AutreActivitéSanitaire[] = []

    autresActivitésModel.forEach((autreActivitéModel: AutreActivitéSanitaireModel) => {
      const codeActivité = autreActivitéModel.codeActivité
      const codeModalité = autreActivitéModel.codeModalité
      const codeForme = autreActivitéModel.codeForme

      const activitéCréée = activitésDeLÉtablissement.find((activité) => activité.code === codeActivité)

      if (!activitéCréée) {
        activitésDeLÉtablissement.push(this.construisLActivitéDUneAutreActivité(autreActivitéModel))
      } else {
        const modalitéCréée = activitéCréée.modalités.find((modalité) => modalité.code === codeModalité)

        if (!modalitéCréée) {
          activitéCréée.modalités.push(this.construisLaModalitéDUneAutreActivité(autreActivitéModel))
        } else {
          const formeCréée = modalitéCréée.formes.find((forme) => forme.code === codeForme)

          if (!formeCréée) {
            modalitéCréée.formes.push(this.construisLaFormeDUneAutreActivité(autreActivitéModel))
          }
        }
      }
    })

    return {
      activités: activitésDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSource.dernièreMiseÀJour,
    }
  }

  private construisLActivitéDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaire {
    return {
      code: autreActivitéModel.codeActivité,
      libellé: autreActivitéModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneAutreActivité(autreActivitéModel)],
    }
  }

  private construisLaModalitéDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel):
  AutorisationSanitaireModalité<AutorisationSanitaireAvecDates> {
    return {
      code: autreActivitéModel.codeModalité,
      formes: [this.construisLaFormeDUneAutreActivité(autreActivitéModel)],
      libellé: autreActivitéModel.libelléModalité,
    }
  }

  private construisLaFormeDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel):
  AutorisationSanitaireForme<AutorisationSanitaireAvecDates> {
    return {
      code: autreActivitéModel.codeForme,
      dates: this.construisLesDatesDUneAutreActivité(autreActivitéModel),
      libellé: autreActivitéModel.libelléForme,
    }
  }

  private construisLesDatesDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutorisationSanitaireAvecDates {
    return {
      dateDAutorisation: autreActivitéModel.dateAutorisation,
      dateDeFin: autreActivitéModel.dateFin,
      dateDeMiseEnOeuvre: autreActivitéModel.dateMiseEnOeuvre,
    }
  }

  private construisLesReconnaissancesContractuelles(
    reconnaissancesContractuellesModel: ReconnaissanceContractuelleSanitaireModel[],
    dateMiseÀJourSource: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité['reconnaissancesContractuelles'] {
    const activitésDeLÉtablissement: AutreActivitéSanitaire[] = []

    reconnaissancesContractuellesModel.forEach((reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel) => {
      const codeActivité = reconnaissanceContractuelle.codeActivité
      const codeModalité = reconnaissanceContractuelle.codeModalité
      const codeForme = reconnaissanceContractuelle.codeForme

      const activitéCréée = activitésDeLÉtablissement.find((activité) => activité.code === codeActivité)

      if (!activitéCréée) {
        activitésDeLÉtablissement.push(this.construisLActivitéDUneReconnaissanceContractuelle(reconnaissanceContractuelle))
      } else {
        const modalitéCréée = activitéCréée.modalités.find((modalité) => modalité.code === codeModalité)

        if (!modalitéCréée) {
          activitéCréée.modalités.push(this.construisLaModalitéDUneReconnaissanceContractuelle(reconnaissanceContractuelle))
        } else {
          const formeCréée = modalitéCréée.formes.find((forme) => forme.code === codeForme)

          if (!formeCréée) {
            modalitéCréée.formes.push(this.construisLaFormeDUneReconnaissanceContractuelle(reconnaissanceContractuelle))
          }
        }
      }
    })

    return {
      activités: activitésDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSource.dernièreMiseÀJour,
    }
  }

  private construisLActivitéDUneReconnaissanceContractuelle(reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel):
  ReconnaissanceContractuelleSanitaire {
    return {
      code: reconnaissanceContractuelle.codeActivité,
      libellé: reconnaissanceContractuelle.libelléActivité,
      modalités: [this.construisLaModalitéDUneReconnaissanceContractuelle(reconnaissanceContractuelle)],
    }
  }

  private construisLaModalitéDUneReconnaissanceContractuelle(reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel):
  AutorisationSanitaireModalité<AutorisationSanitaireAvecDatesNuméroArhgosEtCapacité> {
    return {
      code: reconnaissanceContractuelle.codeModalité,
      formes: [this.construisLaFormeDUneReconnaissanceContractuelle(reconnaissanceContractuelle)],
      libellé: reconnaissanceContractuelle.libelléModalité,
    }
  }

  private construisLaFormeDUneReconnaissanceContractuelle(reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel):
  AutorisationSanitaireForme<AutorisationSanitaireAvecDatesNuméroArhgosEtCapacité> {
    return {
      code: reconnaissanceContractuelle.codeForme,
      dates: this.construisLesDatesDUneReconnaissanceContractuelle(reconnaissanceContractuelle),
      libellé: reconnaissanceContractuelle.libelléForme,
    }
  }

  private construisLesDatesDUneReconnaissanceContractuelle(reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel):
  AutorisationSanitaireAvecDatesNuméroArhgosEtCapacité {
    return {
      capacitéAutorisée: reconnaissanceContractuelle.capacitéAutorisée,
      dateDEffetAsr: reconnaissanceContractuelle.dateEffetAsr,
      dateDEffetCpom: reconnaissanceContractuelle.dateEffetCpom,
      dateDeFinCpom: reconnaissanceContractuelle.dateFinCpom,
      numéroArhgos: reconnaissanceContractuelle.numéroAutorisationArhgos,
      numéroCpom: reconnaissanceContractuelle.numéroCpom,
    }
  }

  private construisLesÉquipementsMatérielsLourds(
    équipementsMatérielsLourdsModel: ÉquipementMatérielLourdModel[],
    dateMiseÀJourSource: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité['équipementsMatérielsLourds'] {
    const équipementsDeLÉtablissement: ÉquipementMatérielLourd[] = []

    équipementsMatérielsLourdsModel.forEach((équipementMatérielLourd: ÉquipementMatérielLourdModel) => {
      const codeÉquipement = équipementMatérielLourd.codeÉquipementMatérielLourd

      const équipementCréé = équipementsDeLÉtablissement.find((équipement) => équipement.code === codeÉquipement)

      if (!équipementCréé) {
        équipementsDeLÉtablissement.push(this.construisLÉquipementMatérielLourd(équipementMatérielLourd))
      } else {
        équipementCréé.autorisations.push(this.construisLAutorisationDUnÉquipementMatérielLourd(équipementMatérielLourd))
      }
    })

    return {
      dateMiseÀJourSource: dateMiseÀJourSource.dernièreMiseÀJour,
      équipements: équipementsDeLÉtablissement,
    }
  }

  private construisLÉquipementMatérielLourd(équipementMatérielLourd: ÉquipementMatérielLourdModel): ÉquipementMatérielLourd {
    return {
      autorisations: [this.construisLAutorisationDUnÉquipementMatérielLourd(équipementMatérielLourd)],
      code: équipementMatérielLourd.codeÉquipementMatérielLourd,
      libellé: équipementMatérielLourd.libelléÉquipementMatérielLourd,
    }
  }

  private construisLAutorisationDUnÉquipementMatérielLourd(équipementMatérielLourd: ÉquipementMatérielLourdModel): AutorisationÉquipementMatérielLourd {
    return {
      dateDAutorisation: équipementMatérielLourd.dateAutorisation,
      dateDeFin: équipementMatérielLourd.dateFin,
      dateDeMiseEnOeuvre: équipementMatérielLourd.dateMiseEnOeuvre,
      numéroArhgos: équipementMatérielLourd.numéroAutorisationArhgos,
    }
  }
}

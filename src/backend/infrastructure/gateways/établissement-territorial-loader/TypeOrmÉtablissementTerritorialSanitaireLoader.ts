import { DataSource } from 'typeorm'

import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { AutorisationSanitaireModel } from '../../../../../database/models/AutorisationSanitaireModel'
import { AutreActivitéSanitaireModel } from '../../../../../database/models/AutreActivitéSanitaireModel'
import { CapacitéAutorisationSanitaireModel } from '../../../../../database/models/CapacitéAutorisationSanitaireModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { ReconnaissanceContractuelleSanitaireModel } from '../../../../../database/models/ReconnaissanceContractuelleSanitaireModel'
import { ÉquipementMatérielLourdSanitaireModel } from '../../../../../database/models/ÉquipementMatérielLourdSanitaireModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import {
  AutorisationSanitaireForme,
  AutorisationSanitaireModalité,
  AutorisationÉquipementMatérielLourd,
  AutreActivitéSanitaire,
  ÉquipementMatérielLourd,
  ÉtablissementTerritorialSanitaireAutorisationEtCapacité,
  AutorisationSanitaireActivité,
  AutreActivitéSanitaireActivité,
  AutreActivitéSanitaireModalité,
  AutreActivitéSanitaireForme,
  ReconnaissanceContractuelleSanitaireActivité,
  ReconnaissanceContractuelleSanitaireForme,
  ReconnaissanceContractuelleSanitaireModalité,
  ReconnaissanceContractuelleSanitaire,
  AutorisationSanitaire,
  CapacitéSanitaire,
} from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialSanitaireLoader } from '../../../métier/gateways/ÉtablissementTerritorialSanitaireLoader'

export class TypeOrmÉtablissementTerritorialSanitaireLoader implements ÉtablissementTerritorialSanitaireLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireActivité[]> {
    const activitésÉtablissementTerritorialActivitésModel = await this.chargeLesActivitésModel(numéroFinessÉtablissementTerritorial)
    const dateDeMiseAJourAnnRpuModel = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_RPU) as DateMiseÀJourFichierSourceModel
    const dateDeMiseAJourMenPmsiAnnuelModel = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_MEN_PMSI_ANNUEL) as DateMiseÀJourFichierSourceModel

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

    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400102) as DateMiseÀJourFichierSourceModel

    return this.construisIdentité(établissementTerritorialIdentitéModel, dateDeMiseÀJourIdentitéModel)
  }

  async chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireAutorisationEtCapacité> {
    const [
      autorisationsDeLÉtablissementModel,
      équipementsDeLÉtablissementModel,
      autresActivitésDeLÉtablissementModel,
      reconnaissancesContractuellesDeLÉtablissementModel,
      capacitésDeLÉtablissementModel,
      dateDeMiseÀJourFinessCs1400103Model,
      dateDeMiseÀJourFinessCs1400104Model,
      dateDeMiseÀJourFinessCs1600101Mode1,
      dateDeMiseÀJourFinessCs1600102Mode1,
      dateDeMiseÀJourDiamantAnnSaeModel,
    ] = await Promise.all([
      this.chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial),
      this.chargeLesÉquipementsMatérielsLourdsModel(numéroFinessÉtablissementTerritorial),
      this.chargeLesAutresActivitésModel(numéroFinessÉtablissementTerritorial),
      this.chargeLesReconnaissancesContractuellesModel(numéroFinessÉtablissementTerritorial),
      this.chargeLesCapacitésModel(numéroFinessÉtablissementTerritorial),
      this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400103) as Promise<DateMiseÀJourFichierSourceModel>,
      this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400104) as Promise<DateMiseÀJourFichierSourceModel>,
      this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1600101) as Promise<DateMiseÀJourFichierSourceModel>,
      this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1600102) as Promise<DateMiseÀJourFichierSourceModel>,
      this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_SAE) as Promise<DateMiseÀJourFichierSourceModel>,
    ])

    return {
      autorisations: this.construisLesAutorisations(autorisationsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400103Model),
      autresActivités: this.construisLesAutresActivités(autresActivitésDeLÉtablissementModel, dateDeMiseÀJourFinessCs1600101Mode1),
      capacités: this.construisLesCapacités(capacitésDeLÉtablissementModel, dateDeMiseÀJourDiamantAnnSaeModel),
      numéroFinessÉtablissementTerritorial,
      reconnaissancesContractuelles: this.construisLesReconnaissancesContractuelles(
        reconnaissancesContractuellesDeLÉtablissementModel,
        dateDeMiseÀJourFinessCs1600102Mode1
      ),
      équipementsMatérielsLourds: this.construisLesÉquipementsMatérielsLourds(équipementsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400104Model),
    }
  }

  private async chargeLesCapacitésModel(numéroFinessÉtablissementTerritorial: string): Promise<CapacitéAutorisationSanitaireModel | null> {
    return await (await this.orm)
      .getRepository(CapacitéAutorisationSanitaireModel)
      .findOne({ where: { numéroFinessÉtablissementTerritorial } })
  }

  private async chargeLesÉquipementsMatérielsLourdsModel(numéroFinessÉtablissementTerritorial: string):
  Promise<ÉquipementMatérielLourdSanitaireModel[]> {
    return await (await this.orm)
      .getRepository(ÉquipementMatérielLourdSanitaireModel)
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
    autorisationSanitaireModels: AutorisationSanitaireModel[],
    dateMiseÀJourSourceModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité['autorisations'] {
    const autorisationsGroupéesDeLÉtablissement: AutorisationSanitaireActivité[] = []

    autorisationSanitaireModels.forEach((autorisationModel: AutorisationSanitaireModel) => {
      const activitéEstConnue = autorisationsGroupéesDeLÉtablissement.find((activité) => activité.code === autorisationModel.codeActivité)

      if (!activitéEstConnue) {
        this.ajouteLAutorisationÀUneNouvelleActivité(autorisationsGroupéesDeLÉtablissement, autorisationModel)
      } else {
        this.ajouteLAutorisationÀLActivitéExistante(activitéEstConnue, autorisationModel)
      }
    })

    return {
      activités: autorisationsGroupéesDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSourceModel.dernièreMiseÀJour,
    }
  }

  private ajouteLAutorisationÀLActivitéExistante(activitéSanitaire: AutorisationSanitaireActivité, autorisationModel: AutorisationSanitaireModel) {
    const modalitéEstDéjàCréée = activitéSanitaire.modalités.find((modalité) => modalité.code === autorisationModel.codeModalité)

    if (!modalitéEstDéjàCréée) {
      this.ajouteLAutorisationÀUneNouvelleModalité(activitéSanitaire, autorisationModel)
    } else {
      this.ajouteLAutorisationÀLaModalitéExistante(modalitéEstDéjàCréée, autorisationModel)
    }
  }

  private ajouteLAutorisationÀLaModalitéExistante(modalitéSanitaire: AutorisationSanitaireModalité, autorisationModel: AutorisationSanitaireModel) {
    const formeEstDéjàCréée = modalitéSanitaire.formes.find((forme) => forme.code === autorisationModel.codeForme)

    if (!formeEstDéjàCréée) {
      this.ajouteLAutorisationÀUneNouvelleForme(modalitéSanitaire, autorisationModel)
    }
  }

  private ajouteLAutorisationÀUneNouvelleForme(modalitéSanitaire: AutorisationSanitaireModalité, autorisationModel: AutorisationSanitaireModel) {
    modalitéSanitaire.formes.push(this.construisLaFormeDUneAutorisation(autorisationModel))
  }

  private ajouteLAutorisationÀUneNouvelleModalité(activitéSanitaire: AutorisationSanitaireActivité, autorisationModel: AutorisationSanitaireModel) {
    activitéSanitaire.modalités.push(this.construisLaModalitéDUneAutorisation(autorisationModel))
  }

  private ajouteLAutorisationÀUneNouvelleActivité(activitésSanitaires: AutorisationSanitaireActivité[], autorisationModel: AutorisationSanitaireModel) {
    activitésSanitaires.push(this.construisLActivitéDUneAutorisation(autorisationModel))
  }

  private construisLActivitéDUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaireActivité {
    return {
      code: autorisationModel.codeActivité,
      libellé: autorisationModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneAutorisation(autorisationModel)],
    }
  }

  private construisLaModalitéDUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaireModalité {
    return {
      code: autorisationModel.codeModalité,
      formes: [this.construisLaFormeDUneAutorisation(autorisationModel)],
      libellé: autorisationModel.libelléModalité,
    }
  }

  private construisLaFormeDUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaireForme {
    return {
      autorisationSanitaire: this.construisUneAutorisation(autorisationModel),
      code: autorisationModel.codeForme,
      libellé: autorisationModel.libelléForme,
    }
  }

  private construisUneAutorisation(autorisationModel: AutorisationSanitaireModel): AutorisationSanitaire {
    return {
      dateDAutorisation: autorisationModel.dateAutorisation,
      dateDeFin: autorisationModel.dateFin,
      dateDeMiseEnOeuvre: autorisationModel.dateMiseEnOeuvre,
      numéroArhgos: autorisationModel.numéroAutorisationArhgos,
    }
  }

  private construisLesAutresActivités(
    autreActivitéSanitaireModels: AutreActivitéSanitaireModel[],
    dateMiseÀJourSourceModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité['autresActivités'] {
    const autresActivitésGroupéesDeLÉtablissement: AutreActivitéSanitaireActivité[] = []

    autreActivitéSanitaireModels.forEach((autreActivitéModel: AutreActivitéSanitaireModel) => {
      const activitéConnue = autresActivitésGroupéesDeLÉtablissement.find((activité) => activité.code === autreActivitéModel.codeActivité)

      if (!activitéConnue) {
        this.ajouteLAutreActivitéÀUneNouvelleActivité(autresActivitésGroupéesDeLÉtablissement, autreActivitéModel)
      } else {
        this.ajouteLAutreActivitéÀLActivitéExistante(activitéConnue, autreActivitéModel)
      }
    })

    return {
      activités: autresActivitésGroupéesDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSourceModel.dernièreMiseÀJour,
    }
  }

  private ajouteLAutreActivitéÀLActivitéExistante(activitéSanitaire: AutreActivitéSanitaireActivité, autreActivitéModel: AutreActivitéSanitaireModel) {
    const modalitéConnue = activitéSanitaire.modalités.find((modalité) => modalité.code === autreActivitéModel.codeModalité)

    if (!modalitéConnue) {
      this.ajouteLAutreActivitéÀUneNouvelleModalité(activitéSanitaire, autreActivitéModel)
    } else {
      this.ajouteLAutreActivitéÀLaModalitéExistante(modalitéConnue, autreActivitéModel)
    }
  }

  private ajouteLAutreActivitéÀLaModalitéExistante(modalitéSanitaire: AutreActivitéSanitaireModalité, autreActivitéModel: AutreActivitéSanitaireModel) {
    const formeConnue = modalitéSanitaire.formes.find((forme) => forme.code === autreActivitéModel.codeForme)

    if (!formeConnue) {
      this.ajouteLAutreActivitéÀUneNouvelleForme(modalitéSanitaire, autreActivitéModel)
    }
  }

  private ajouteLAutreActivitéÀUneNouvelleActivité(
    autresActivitésSanitaires: AutreActivitéSanitaireActivité[], autreActivitéModel: AutreActivitéSanitaireModel
  ) {
    autresActivitésSanitaires.push(this.construisLActivitéDUneAutreActivité(autreActivitéModel))
  }

  private ajouteLAutreActivitéÀUneNouvelleModalité(activitéSanitaire: AutreActivitéSanitaireActivité, autreActivitéModel: AutreActivitéSanitaireModel) {
    activitéSanitaire.modalités.push(this.construisLaModalitéDUneAutreActivité(autreActivitéModel))
  }

  private ajouteLAutreActivitéÀUneNouvelleForme(modalitéSanitaire: AutreActivitéSanitaireModalité, autreActivitéModel: AutreActivitéSanitaireModel) {
    modalitéSanitaire.formes.push(this.construisLaFormeDUneAutreActivité(autreActivitéModel))
  }

  private construisLActivitéDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaireActivité {
    return {
      code: autreActivitéModel.codeActivité,
      libellé: autreActivitéModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneAutreActivité(autreActivitéModel)],
    }
  }

  private construisLaModalitéDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaireModalité {
    return {
      code: autreActivitéModel.codeModalité,
      formes: [this.construisLaFormeDUneAutreActivité(autreActivitéModel)],
      libellé: autreActivitéModel.libelléModalité,
    }
  }

  private construisLaFormeDUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaireForme {
    return {
      autreActivitéSanitaire: this.construisUneAutreActivité(autreActivitéModel),
      code: autreActivitéModel.codeForme,
      libellé: autreActivitéModel.libelléForme,
    }
  }

  private construisUneAutreActivité(autreActivitéModel: AutreActivitéSanitaireModel): AutreActivitéSanitaire {
    return {
      dateDAutorisation: autreActivitéModel.dateAutorisation,
      dateDeFin: autreActivitéModel.dateFin,
      dateDeMiseEnOeuvre: autreActivitéModel.dateMiseEnOeuvre,
    }
  }

  private construisLesReconnaissancesContractuelles(
    reconnaissanceContractuelleSanitaireModels: ReconnaissanceContractuelleSanitaireModel[],
    dateMiseÀJourSourceModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité['reconnaissancesContractuelles'] {
    const reconnaissancesContractuellesGroupéesDeLÉtablissement: ReconnaissanceContractuelleSanitaireActivité[] = []

    reconnaissanceContractuelleSanitaireModels.forEach((reconnaissanceContractuelle: ReconnaissanceContractuelleSanitaireModel) => {
      const activitéConnue = reconnaissancesContractuellesGroupéesDeLÉtablissement.find(
        (activité) => activité.code === reconnaissanceContractuelle.codeActivité
      )

      if (!activitéConnue) {
        this.ajouteLaReconnaissanceContractuelleÀUneNouvelleActivité(reconnaissancesContractuellesGroupéesDeLÉtablissement, reconnaissanceContractuelle)
      } else {
        this.ajouteLaReconnaissanceContractuelleÀLActivitéExistante(activitéConnue, reconnaissanceContractuelle)
      }
    })

    return {
      activités: reconnaissancesContractuellesGroupéesDeLÉtablissement,
      dateMiseÀJourSource: dateMiseÀJourSourceModel.dernièreMiseÀJour,
    }
  }

  private ajouteLaReconnaissanceContractuelleÀLActivitéExistante(
    activitéSanitaire: ReconnaissanceContractuelleSanitaireActivité, reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    const modalitéConnue = activitéSanitaire.modalités.find((modalité) => modalité.code === reconnaissanceContractuelleModel.codeModalité)

    if (!modalitéConnue) {
      this.ajouteLaReconnaissanceContractuelleÀUneNouvelleModalité(activitéSanitaire, reconnaissanceContractuelleModel)
    } else {
      this.ajouteLaReconnaissanceContractuelleÀUneModalitéExistante(modalitéConnue, reconnaissanceContractuelleModel)
    }
  }

  private ajouteLaReconnaissanceContractuelleÀUneModalitéExistante(
    modalitéSanitaire: ReconnaissanceContractuelleSanitaireModalité, reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    const formeConnue = modalitéSanitaire.formes.find((forme) => forme.code === reconnaissanceContractuelleModel.codeForme)

    if (!formeConnue) {
      this.ajouteLaReconnaissanceContractuelleÀUneNouvelleForme(modalitéSanitaire, reconnaissanceContractuelleModel)
    }
  }

  private ajouteLaReconnaissanceContractuelleÀUneNouvelleActivité(
    reconnaissancesContractuellesSanitaires: ReconnaissanceContractuelleSanitaireActivité[],
    reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    reconnaissancesContractuellesSanitaires.push(this.construisLActivitéDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel))
  }

  private ajouteLaReconnaissanceContractuelleÀUneNouvelleModalité(
    activitéSanitaire: ReconnaissanceContractuelleSanitaireActivité, reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    activitéSanitaire.modalités.push(this.construisLaModalitéDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel))
  }

  private ajouteLaReconnaissanceContractuelleÀUneNouvelleForme(
    modalitéSanitaire: ReconnaissanceContractuelleSanitaireModalité, reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel
  ) {
    modalitéSanitaire.formes.push(this.construisLaFormeDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel))
  }

  private construisLActivitéDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel):
  ReconnaissanceContractuelleSanitaireActivité {
    return {
      code: reconnaissanceContractuelleModel.codeActivité,
      libellé: reconnaissanceContractuelleModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel)],
    }
  }

  private construisLaModalitéDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel):
  ReconnaissanceContractuelleSanitaireModalité {
    return {
      code: reconnaissanceContractuelleModel.codeModalité,
      formes: [this.construisLaFormeDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel)],
      libellé: reconnaissanceContractuelleModel.libelléModalité,
    }
  }

  private construisLaFormeDUneReconnaissanceContractuelle(reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel):
  ReconnaissanceContractuelleSanitaireForme {
    return {
      code: reconnaissanceContractuelleModel.codeForme,
      libellé: reconnaissanceContractuelleModel.libelléForme,
      reconnaissanceContractuelleSanitaire: this.construisUneReconnaissanceContractuelle(reconnaissanceContractuelleModel),
    }
  }

  private construisUneReconnaissanceContractuelle(reconnaissanceContractuelleModel: ReconnaissanceContractuelleSanitaireModel):
  ReconnaissanceContractuelleSanitaire {
    return {
      capacitéAutorisée: reconnaissanceContractuelleModel.capacitéAutorisée,
      dateDEffetAsr: reconnaissanceContractuelleModel.dateEffetAsr,
      dateDEffetCpom: reconnaissanceContractuelleModel.dateEffetCpom,
      dateDeFinCpom: reconnaissanceContractuelleModel.dateFinCpom,
      numéroArhgos: reconnaissanceContractuelleModel.numéroAutorisationArhgos,
      numéroCpom: reconnaissanceContractuelleModel.numéroCpom,
    }
  }

  private construisLesÉquipementsMatérielsLourds(
    équipementMatérielLourdSanitaireModels: ÉquipementMatérielLourdSanitaireModel[],
    dateMiseÀJourSourceModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité['équipementsMatérielsLourds'] {
    const équipementsGroupésDeLÉtablissement: ÉquipementMatérielLourd[] = []

    équipementMatérielLourdSanitaireModels.forEach((équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel) => {
      const équipementConnu = équipementsGroupésDeLÉtablissement.find((équipement) => équipement.code === équipementMatérielLourd.codeÉquipementMatérielLourd)

      if (!équipementConnu) {
        this.ajouteLAutorisationDÉquipementMatérielLourdÀUnNouvelÉquipement(équipementsGroupésDeLÉtablissement, équipementMatérielLourd)
      } else {
        this.ajouteLAutorisationDÉquipementMatérielLourdÀUnÉquipementExistant(équipementConnu, équipementMatérielLourd)
      }
    })

    return {
      dateMiseÀJourSource: dateMiseÀJourSourceModel.dernièreMiseÀJour,
      équipements: équipementsGroupésDeLÉtablissement,
    }
  }

  private ajouteLAutorisationDÉquipementMatérielLourdÀUnÉquipementExistant(
    équipementMatérielLourdSanitaire: ÉquipementMatérielLourd, équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel
  ) {
    équipementMatérielLourdSanitaire.autorisations.push(this.construisUnÉquipementMatérielLourd(équipementMatérielLourd))
  }

  private ajouteLAutorisationDÉquipementMatérielLourdÀUnNouvelÉquipement(
    équipementsGroupés: ÉquipementMatérielLourd[], équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel
  ) {
    équipementsGroupés.push(this.construisLÉquipementMatérielLourd(équipementMatérielLourd))
  }

  private construisLÉquipementMatérielLourd(équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel): ÉquipementMatérielLourd {
    return {
      autorisations: [this.construisUnÉquipementMatérielLourd(équipementMatérielLourd)],
      code: équipementMatérielLourd.codeÉquipementMatérielLourd,
      libellé: équipementMatérielLourd.libelléÉquipementMatérielLourd,
    }
  }

  private construisUnÉquipementMatérielLourd(équipementMatérielLourd: ÉquipementMatérielLourdSanitaireModel):
  AutorisationÉquipementMatérielLourd {
    return {
      dateDAutorisation: équipementMatérielLourd.dateAutorisation,
      dateDeFin: équipementMatérielLourd.dateFin,
      dateDeMiseEnOeuvre: équipementMatérielLourd.dateMiseEnOeuvre,
      numéroArhgos: équipementMatérielLourd.numéroAutorisationArhgos,
    }
  }

  private construisLesCapacités(
    capacitésDeLÉtablissementModel: CapacitéAutorisationSanitaireModel | null,
    dateDeMiseÀJourDiamantAnnSaeModel: DateMiseÀJourFichierSourceModel
  ): CapacitéSanitaire {
    if (capacitésDeLÉtablissementModel) {
      return {
        dateMiseÀJourSource: dateDeMiseÀJourDiamantAnnSaeModel.dernièreMiseÀJour,
        nombreDeLitsEnChirurgie: capacitésDeLÉtablissementModel.nombreDeLitsEnChirurgie,
        nombreDeLitsEnMédecine: capacitésDeLÉtablissementModel.nombreDeLitsEnMédecine,
        nombreDeLitsEnObstétrique: capacitésDeLÉtablissementModel.nombreDeLitsEnObstétrique,
        nombreDeLitsEnSsr: capacitésDeLÉtablissementModel.nombreDeLitsEnSsr,
        nombreDeLitsEnUsld: capacitésDeLÉtablissementModel.nombreDeLitsEnUsld,
        nombreDeLitsOuPlacesEnPsyHospitalisationComplète: capacitésDeLÉtablissementModel.nombreDeLitsOuPlacesEnPsyHospitalisationComplète,
        nombreDePlacesEnChirurgie: capacitésDeLÉtablissementModel.nombreDePlacesEnChirurgie,
        nombreDePlacesEnMédecine: capacitésDeLÉtablissementModel.nombreDePlacesEnMédecine,
        nombreDePlacesEnObstétrique: capacitésDeLÉtablissementModel.nombreDePlacesEnObstétrique,
        nombreDePlacesEnPsyHospitalisationPartielle: capacitésDeLÉtablissementModel.nombreDePlacesEnPsyHospitalisationPartielle,
        nombreDePlacesEnSsr: capacitésDeLÉtablissementModel.nombreDePlacesEnSsr,
      }
    } else {
      return null
    }
  }
}

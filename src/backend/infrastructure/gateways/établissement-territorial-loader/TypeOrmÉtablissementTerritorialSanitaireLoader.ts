import { DataSource } from 'typeorm'

import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { AutorisationSanitaireModel } from '../../../../../database/models/AutorisationSanitaireModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { AutorisationSanitaire, AutorisationSanitaireActivité, AutorisationSanitaireAvecDatesEtNuméroArhgos, AutorisationSanitaireForme, AutorisationSanitaireModalité, ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation'
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
    const autorisationsDeLÉtablissementModel = await this.chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial)
    const dateDeMiseÀJourFinessCs1400103Model = await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400103) as DateMiseÀJourFichierSourceModel

    return {
      autorisations: this.construisLesAutorisations(autorisationsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400103Model),
      autresActivités: {
        activités: [],
        dateMiseÀJourSource: '',
      },
      numéroFinessÉtablissementTerritorial,
      reconnaissancesContractuelles: {
        activités: [],
        dateMiseÀJourSource: '',
      },
      équipementsMatérielsLourds: {
        dateMiseÀJourSource: '',
        équipements: [],
      },
    }
  }

  private async chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial: string): Promise<AutorisationSanitaireModel[]> {
    return await (await this.orm)
      .getRepository(AutorisationSanitaireModel)
      .find({
        order: { activité: 'ASC', forme: 'ASC', modalité: 'ASC' },
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
      const codeActivité = autorisationModel.activité
      const codeModalité = autorisationModel.modalité
      const codeForme = autorisationModel.forme

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
      code: autorisationModel.activité,
      libellé: autorisationModel.libelléActivité,
      modalités: [this.construisLaModalitéDUneAutorisation(autorisationModel)],
    }
  }

  private construisLaModalitéDUneAutorisation(autorisationModel: AutorisationSanitaireModel):
  AutorisationSanitaireModalité<AutorisationSanitaireAvecDatesEtNuméroArhgos> {
    return {
      code: autorisationModel.modalité,
      formes: [this.construisLaFormeDUneAutorisation(autorisationModel)],
      libellé: autorisationModel.libelléModalité,
    }
  }

  private construisLaFormeDUneAutorisation(autorisationModel: AutorisationSanitaireModel):
  AutorisationSanitaireForme<AutorisationSanitaireAvecDatesEtNuméroArhgos> {
    return {
      code: autorisationModel.forme,
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
}

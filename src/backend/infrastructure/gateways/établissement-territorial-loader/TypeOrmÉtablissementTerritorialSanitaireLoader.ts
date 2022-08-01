import { DataSource } from 'typeorm'

import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialSanitaireLoader } from '../../../métier/gateways/ÉtablissementTerritorialSanitaireLoader'

export class TypeOrmÉtablissementTerritorialSanitaireLoader implements ÉtablissementTerritorialSanitaireLoader {
  constructor(private readonly orm: Promise<DataSource>) { }

  async chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireActivité[]> {
    const activitésÉtablissementTerritorialActivitésModel = await this.chargeLesActivitésModel(numéroFinessÉtablissementTerritorial)
    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()
    const dateDeMiseAJourAnnRpuModel = await this.chargeLaDateDeMiseÀJourAnnRpuModel() as DateMiseÀJourFichierSourceModel
    const dateDeMiseAJourMenPmsiAnnuelModel = await this.chargeLaDateDeMiseÀJourMenPmsiAnnuelModel() as DateMiseÀJourFichierSourceModel

    return this.construisActivité(
      activitésÉtablissementTerritorialActivitésModel.slice(-5),
      dateDeMiseAJourModel,
      dateDeMiseAJourAnnRpuModel,
      dateDeMiseAJourMenPmsiAnnuelModel
    )
  }

  async chargeIdentité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialSanitaireNonTrouvée> {
    const établissementTerritorialIdentitéModel = await this.chargeLIdentitéModel(numéroFinessÉtablissementTerritorial)

    if (!établissementTerritorialIdentitéModel) {
      return new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()
    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJourIdentitéModel() as DateMiseÀJourFichierSourceModel

    return this.construisIdentité(établissementTerritorialIdentitéModel, dateDeMiseAJourModel, dateDeMiseÀJourIdentitéModel)
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

  private async chargeLaDateDeMiseÀJourModel(): Promise<DateMiseÀJourSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private async chargeLaDateDeMiseÀJourIdentitéModel(): Promise<DateMiseÀJourFichierSourceModel | null> {
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
    dateDeMiseAJourModel: DateMiseÀJourSourceModel | null,
    dateDeMiseÀJourIdentitéModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialIdentité {
    return {
      adresseAcheminement: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseAcheminement,
      },
      adresseNuméroVoie: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseNuméroVoie,
      },
      adresseTypeVoie: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseTypeVoie,
      },
      adresseVoie: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseVoie,
      },
      catégorieÉtablissement: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.catégorieÉtablissement,
      },
      courriel: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.courriel,
      },
      dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
      libelléCatégorieÉtablissement: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.libelléCatégorieÉtablissement,
      },
      numéroFinessEntitéJuridique: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementPrincipal: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessÉtablissementPrincipal,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessÉtablissementTerritorial,
      },
      raisonSociale: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.raisonSociale,
      },
      typeÉtablissement: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.typeÉtablissement,
      },
      téléphone: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.téléphone,
      },
    }
  }

  private construisActivité(
    établissementTerritorialActivitésModel: ActivitéSanitaireModel[],
    dateDeMiseAJourModel: DateMiseÀJourSourceModel | null,
    dateDeMiseAJourAnnRpuModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourMenPmsiAnnuelModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialSanitaireActivité[] {
    return établissementTerritorialActivitésModel.map((établissementTerritorialModel) =>
      ({
        année: établissementTerritorialModel.année,
        dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
        nombreDePassagesAuxUrgences: {
          dateMiseAJourSource: dateDeMiseAJourMenPmsiAnnuelModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreDePassagesAuxUrgences,
        },
        nombreJournéesCompletePsy: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreJournéesCompletePsy,
        },
        nombreJournéesCompletesSsr: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreJournéesCompletesSsr,
        },
        nombreJournéesPartiellesPsy: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreJournéesPartiellesPsy,
        },
        nombreJournéesPartielsSsr: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreJournéesPartielsSsr,
        },
        nombreSéjoursCompletsChirurgie: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursCompletsChirurgie,
        },
        nombreSéjoursCompletsMédecine: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursCompletsMédecine,
        },
        nombreSéjoursCompletsObstétrique: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursCompletsObstétrique,
        },
        nombreSéjoursPartielsChirurgie: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursPartielsChirurgie,
        },
        nombreSéjoursPartielsMédecine: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursPartielsMédecine,
        },
        nombreSéjoursPartielsObstétrique: {
          dateMiseAJourSource: dateDeMiseAJourAnnRpuModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreSéjoursPartielsObstétrique,
        },
        numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
      }))
  }
}

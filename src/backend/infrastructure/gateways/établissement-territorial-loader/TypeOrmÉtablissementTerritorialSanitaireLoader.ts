import { DataSource } from 'typeorm'

import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialSanitaireLoader } from '../../../métier/gateways/ÉtablissementTerritorialSanitaireLoader'

export class TypeOrmÉtablissementTerritorialSanitaireLoader implements ÉtablissementTerritorialSanitaireLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireActivité[]> {
    const lesCinqDernièresAnnées = -5
    const activitésÉtablissementTerritorialActivitésModel = await this.chargeLesActivitésModel(numéroFinessÉtablissementTerritorial)
    const dateDeMiseAJourAnnRpuModel = await this.chargeLaDateDeMiseÀJourAnnRpuModel() as DateMiseÀJourFichierSourceModel
    const dateDeMiseAJourMenPmsiAnnuelModel = await this.chargeLaDateDeMiseÀJourMenPmsiAnnuelModel() as DateMiseÀJourFichierSourceModel

    return this.construisActivité(
      activitésÉtablissementTerritorialActivitésModel.slice(lesCinqDernièresAnnées),
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
}

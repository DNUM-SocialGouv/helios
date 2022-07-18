import { DataSource } from 'typeorm'

import { ActivitéSanitaireModel } from '../../../../../database/models/ActivitéSanitaireModel'
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
    const activitésÉtablissementTerritorialModel = await (await this.orm)
      .getRepository(ActivitéSanitaireModel)
      .find({
        order: { année: 'DESC' },
        take: 5,
        where: { numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial },
      })
    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()
    return this.construisActivité(activitésÉtablissementTerritorialModel.reverse(), dateDeMiseAJourModel)
  }

  async chargeIdentité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialSanitaireNonTrouvée> {
    const établissementTerritorialModel = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .findOneBy({
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial,
      })
    if (!établissementTerritorialModel) {
      return new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()

    return this.construisLÉtablissementTerritorialSanitaire(établissementTerritorialModel, dateDeMiseAJourModel)
  }

  private async chargeLaDateDeMiseÀJourModel() {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private construisLÉtablissementTerritorialSanitaire(
    établissementTerritorialModel: ÉtablissementTerritorialIdentitéModel,
    dateDeMiseAJourModel: DateMiseÀJourSourceModel | null
  ): ÉtablissementTerritorialIdentité {
    return {
      adresseAcheminement: établissementTerritorialModel.adresseAcheminement,
      adresseNuméroVoie: établissementTerritorialModel.adresseNuméroVoie,
      adresseTypeVoie: établissementTerritorialModel.adresseTypeVoie,
      adresseVoie: établissementTerritorialModel.adresseVoie,
      catégorieÉtablissement: établissementTerritorialModel.catégorieÉtablissement,
      courriel: établissementTerritorialModel.courriel,
      dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
      libelléCatégorieÉtablissement: établissementTerritorialModel.libelléCatégorieÉtablissement,
      numéroFinessEntitéJuridique: établissementTerritorialModel.numéroFinessEntitéJuridique,
      numéroFinessÉtablissementPrincipal: établissementTerritorialModel.numéroFinessÉtablissementPrincipal,
      numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
      raisonSociale: établissementTerritorialModel.raisonSociale,
      typeÉtablissement: établissementTerritorialModel.typeÉtablissement,
      téléphone: établissementTerritorialModel.téléphone,
    }
  }

  private construisActivité(
    activitésÉtablissementTerritorialModel: ActivitéSanitaireModel[],
    dateDeMiseAJourModel: DateMiseÀJourSourceModel | null
  ): ÉtablissementTerritorialSanitaireActivité[] {
    return activitésÉtablissementTerritorialModel.map((établissementTerritorialModel) =>
      ({
        année: établissementTerritorialModel.année,
        dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
        nombreDePassagesAuxUrgences: établissementTerritorialModel.nombreDePassagesAuxUrgences,
        nombreJournéesCompletePsy: établissementTerritorialModel.nombreJournéesCompletePsy,
        nombreJournéesCompletesSsr: établissementTerritorialModel.nombreJournéesCompletesSsr,
        nombreJournéesPartiellesPsy: établissementTerritorialModel.nombreJournéesPartiellesPsy,
        nombreJournéesPartielsSsr: établissementTerritorialModel.nombreJournéesPartielsSsr,
        nombreSéjoursCompletsChirurgie: établissementTerritorialModel.nombreSéjoursCompletsChirurgie,
        nombreSéjoursCompletsMédecine: établissementTerritorialModel.nombreSéjoursCompletsMédecine,
        nombreSéjoursCompletsObstétrique: établissementTerritorialModel.nombreSéjoursCompletsObstétrique,
        nombreSéjoursPartielsChirurgie: établissementTerritorialModel.nombreSéjoursPartielsChirurgie,
        nombreSéjoursPartielsMédecine: établissementTerritorialModel.nombreSéjoursPartielsMédecine,
        nombreSéjoursPartielsObstétrique: établissementTerritorialModel.nombreSéjoursPartielsObstétrique,
        numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
      }))
  }
}

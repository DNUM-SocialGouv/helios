import { DataSource } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { MonoÉtablissement } from '../../../métier/entities/établissement-territorial-médico-social/MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../../../métier/gateways/ÉtablissementTerritorialMédicoSocialLoader'

export class TypeOrmÉtablissementTerritorialMédicoSocialLoader implements ÉtablissementTerritorialMédicoSocialLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeActivité(
    numéroFinessÉtablissementTerritorial: string
  ): Promise<ÉtablissementTerritorialMédicoSocialActivité[] | ÉtablissementTerritorialMédicoSocialNonTrouvée> {
    const activitésÉtablissementTerritorialModel = await (await this.orm)
      .getRepository(ActivitéMédicoSocialModel)
      .findBy({ numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial })

    if (activitésÉtablissementTerritorialModel.length === 0) {
      return new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()

    return activitésÉtablissementTerritorialModel.map((activitéÉtablissementTerritorialModel) =>
      this.construisLÉtablissementTerritorialMédicoSocialActivité(activitéÉtablissementTerritorialModel, dateDeMiseAJourModel))
  }

  async chargeIdentité(
    numéroFinessÉtablissementTerritorial: string
  ): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée> {
    const établissementTerritorialModel = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .findOneBy({
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFinessÉtablissementTerritorial,
      })

    if (!établissementTerritorialModel) {
      return new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()

    return this.construisLÉtablissementTerritorialMédicoSocial(établissementTerritorialModel, dateDeMiseAJourModel)
  }

  async estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement> {
    const nombreDÉtablissementTerritoriauxDansLEntitéJuridique = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .countBy({ numéroFinessEntitéJuridique: numéroFinessEntitéJuridique })

    return { estMonoÉtablissement: nombreDÉtablissementTerritoriauxDansLEntitéJuridique === 1 }
  }

  private async chargeLaDateDeMiseÀJourModel(): Promise<DateMiseÀJourSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private construisLÉtablissementTerritorialMédicoSocial(
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

  private construisLÉtablissementTerritorialMédicoSocialActivité(
    établissementTerritorialModel: ActivitéMédicoSocialModel,
    dateDeMiseAJourModel: DateMiseÀJourSourceModel | null
  ): ÉtablissementTerritorialMédicoSocialActivité {
    return {
      année: établissementTerritorialModel.année,
      dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: établissementTerritorialModel.duréeMoyenneSéjourAccompagnementPersonnesSorties,
      fileActivePersonnesAccompagnées: établissementTerritorialModel.fileActivePersonnesAccompagnées,
      nombreMoyenJournéesAbsencePersonnesAccompagnées: établissementTerritorialModel.nombreMoyenJournéesAbsencePersonnesAccompagnées,
      numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
      tauxOccupationAccueilDeJour: établissementTerritorialModel.tauxOccupationAccueilDeJour,
      tauxOccupationHébergementPermanent: établissementTerritorialModel.tauxOccupationHébergementPermanent,
      tauxOccupationHébergementTemporaire: établissementTerritorialModel.tauxOccupationHébergementTemporaire,
      tauxRéalisationActivité: établissementTerritorialModel.tauxRéalisationActivité,
    }
  }
}

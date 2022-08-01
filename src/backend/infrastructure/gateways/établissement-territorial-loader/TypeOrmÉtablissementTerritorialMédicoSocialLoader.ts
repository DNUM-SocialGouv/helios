import { DataSource } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
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
  ): Promise<ÉtablissementTerritorialMédicoSocialActivité[]> {
    const activitésÉtablissementTerritorialActivitésModel = await this.chargeLesActivitésModel(numéroFinessÉtablissementTerritorial)
    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()
    const dateDeMiseAJourAnnMsTdpEtModel = await this.chargeLaDateDeMiseÀJourAnnMsTdpEtModel() as DateMiseÀJourFichierSourceModel
    const dateDeMiseAJourAnnErrdEjEtModel = await this.chargeLaDateDeMiseÀJourAnnErrdEjEtModel() as DateMiseÀJourFichierSourceModel

    return this.construisActivité(
      activitésÉtablissementTerritorialActivitésModel,
      dateDeMiseAJourModel,
      dateDeMiseAJourAnnMsTdpEtModel,
      dateDeMiseAJourAnnErrdEjEtModel
    )
  }

  async chargeIdentité(
    numéroFinessÉtablissementTerritorial: string
  ): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée> {
    const établissementTerritorialIdentitéModel = await this.chargeLIdentitéModel(numéroFinessÉtablissementTerritorial)

    if (!établissementTerritorialIdentitéModel) {
      return new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()
    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJourIdentitéModel() as DateMiseÀJourFichierSourceModel

    return this.construisIdentité(établissementTerritorialIdentitéModel, dateDeMiseAJourModel, dateDeMiseÀJourIdentitéModel)
  }

  async estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement> {
    const nombreDÉtablissementTerritoriauxDansLEntitéJuridique = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .countBy({ numéroFinessEntitéJuridique })
    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJourIdentitéModel() as DateMiseÀJourFichierSourceModel

    return {
      estMonoÉtablissement: {
        dateMiseAJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: nombreDÉtablissementTerritoriauxDansLEntitéJuridique === 1,
      },
    }
  }

  private async chargeLesActivitésModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm)
      .getRepository(ActivitéMédicoSocialModel)
      .find({
        order: { année: 'ASC' },
        where: { numéroFinessÉtablissementTerritorial },
      })
  }

  private async chargeLIdentitéModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .findOneBy({
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
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

  private async chargeLaDateDeMiseÀJourAnnMsTdpEtModel(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_ANN_MS_TDP_ET })
  }

  private async chargeLaDateDeMiseÀJourAnnErrdEjEtModel(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_ANN_ERRD_EJ_ET })
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
    établissementTerritorialActivitésModel: ActivitéMédicoSocialModel[],
    dateDeMiseAJourModel: DateMiseÀJourSourceModel | null,
    dateDeMiseAJourAnnMsTdpEtModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourAnnErrdEjEtModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialActivité[] {
    return établissementTerritorialActivitésModel.map((établissementTerritorialModel) =>
      ({
        année: établissementTerritorialModel.année,
        dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
        duréeMoyenneSéjourAccompagnementPersonnesSorties: {
          dateMiseAJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.duréeMoyenneSéjourAccompagnementPersonnesSorties,
        },
        fileActivePersonnesAccompagnées: {
          dateMiseAJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.fileActivePersonnesAccompagnées,
        },
        nombreMoyenJournéesAbsencePersonnesAccompagnées: {
          dateMiseAJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreMoyenJournéesAbsencePersonnesAccompagnées,
        },
        numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
        tauxOccupationAccueilDeJour: {
          dateMiseAJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationAccueilDeJour,
        },
        tauxOccupationHébergementPermanent: {
          dateMiseAJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationHébergementPermanent,
        },
        tauxOccupationHébergementTemporaire: {
          dateMiseAJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationHébergementTemporaire,
        },
        tauxRéalisationActivité: {
          dateMiseAJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxRéalisationActivité,
        },
      }))
  }
}

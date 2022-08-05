import { DataSource } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
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
    const dateDeMiseAJourAnnMsTdpEtModel = await this.chargeLaDateDeMiseÀJourAnnMsTdpEtModel() as DateMiseÀJourFichierSourceModel
    const dateDeMiseAJourAnnErrdEjEtModel = await this.chargeLaDateDeMiseÀJourAnnErrdEjEtModel() as DateMiseÀJourFichierSourceModel

    return this.construisActivité(
      activitésÉtablissementTerritorialActivitésModel,
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

    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJouFinessCs1400102Model() as DateMiseÀJourFichierSourceModel

    return this.construisIdentité(établissementTerritorialIdentitéModel, dateDeMiseÀJourIdentitéModel)
  }

  async estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement> {
    const nombreDÉtablissementTerritoriauxDansLEntitéJuridique = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .countBy({ numéroFinessEntitéJuridique })
    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJouFinessCs1400102Model() as DateMiseÀJourFichierSourceModel

    return {
      estMonoÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
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

  private async chargeLaDateDeMiseÀJouFinessCs1400102Model(): Promise<DateMiseÀJourFichierSourceModel | null> {
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
    établissementTerritorialActivitésModel: ActivitéMédicoSocialModel[],
    dateDeMiseAJourAnnMsTdpEtModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourAnnErrdEjEtModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialActivité[] {
    return établissementTerritorialActivitésModel.map<ÉtablissementTerritorialMédicoSocialActivité>((établissementTerritorialModel) =>
      ({
        année: établissementTerritorialModel.année,
        duréeMoyenneSéjourAccompagnementPersonnesSorties: {
          dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.duréeMoyenneSéjourAccompagnementPersonnesSorties,
        },
        fileActivePersonnesAccompagnées: {
          dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.fileActivePersonnesAccompagnées,
        },
        nombreMoyenJournéesAbsencePersonnesAccompagnées: {
          dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreMoyenJournéesAbsencePersonnesAccompagnées,
        },
        numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
        tauxOccupationAccueilDeJour: {
          dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationAccueilDeJour,
        },
        tauxOccupationHébergementPermanent: {
          dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationHébergementPermanent,
        },
        tauxOccupationHébergementTemporaire: {
          dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationHébergementTemporaire,
        },
        tauxRéalisationActivité: {
          dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxRéalisationActivité,
        },
      }))
  }
}

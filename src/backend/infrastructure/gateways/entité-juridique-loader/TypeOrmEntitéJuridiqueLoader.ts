import { DataSource } from 'typeorm'

import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/entité-juridique/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../../../métier/entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueDeRattachement } from '../../../métier/entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { EntitéJuridiqueLoader } from '../../../métier/gateways/EntitéJuridiqueLoader'

export class TypeOrmEntitéJuridiqueLoader implements EntitéJuridiqueLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeIdentité(numéroFiness: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée> {
    const entitéJuridiqueIdentitéModel = await this.chargeLIdentitéModel(numéroFiness)

    if (!entitéJuridiqueIdentitéModel) {
      return new EntitéJuridiqueNonTrouvée(numéroFiness)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()
    const dateDeMiseAJourFichierSourceModel = await this.chargeLaDateDeMiseÀJourIdentitéModel() as DateMiseÀJourFichierSourceModel

    return this.construisLEntitéJuridique(entitéJuridiqueIdentitéModel, dateDeMiseAJourModel, dateDeMiseAJourFichierSourceModel)
  }

  async chargeRattachement(numéroFiness: string): Promise<EntitéJuridiqueDeRattachement> {
    const entitéJuridiqueModel = await this.chargeLIdentitéModel(numéroFiness) as EntitéJuridiqueModel
    const dateDeMiseAJourFichierSourceModel = await this.chargeLaDateDeMiseÀJourIdentitéModel() as DateMiseÀJourFichierSourceModel

    return this.construisLEntitéJuridiqueDeRattachement(entitéJuridiqueModel, dateDeMiseAJourFichierSourceModel)
  }

  private async chargeLaDateDeMiseÀJourModel(): Promise<DateMiseÀJourSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private async chargeLaDateDeMiseÀJourIdentitéModel(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.FINESS_CS1400101 })
  }

  private async chargeLIdentitéModel(numéroFinessEntitéJuridique: string): Promise<EntitéJuridiqueModel | null> {
    return await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .findOneBy({ numéroFinessEntitéJuridique })
  }

  private construisLEntitéJuridique(
    entitéJuridiqueModel: EntitéJuridiqueModel,
    dateDeMiseAJourModel: DateMiseÀJourSourceModel | null,
    dateDeMiseAJourFichierSourceModel: DateMiseÀJourFichierSourceModel
  ): EntitéJuridique {
    return {
      adresseAcheminement: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.adresseAcheminement,
      },
      adresseNuméroVoie: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.adresseNuméroVoie,
      },
      adresseTypeVoie: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.adresseTypeVoie,
      },
      adresseVoie: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.adresseVoie,
      },
      dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
      libelléStatutJuridique: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.libelléStatutJuridique,
      },
      numéroFinessEntitéJuridique: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.numéroFinessEntitéJuridique,
      },
      raisonSociale: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.raisonSociale,
      },
      téléphone: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.téléphone,
      },
    }
  }

  private construisLEntitéJuridiqueDeRattachement(
    entitéJuridiqueModel: EntitéJuridiqueModel,
    dateDeMiseAJourFichierSourceModel: DateMiseÀJourFichierSourceModel
  ): EntitéJuridiqueDeRattachement {
    return {
      raisonSocialeDeLEntitéDeRattachement: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel ? entitéJuridiqueModel.raisonSociale : '',
      },
      statutJuridique: {
        dateMiseAJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel ? entitéJuridiqueModel.libelléStatutJuridique : '',
      },
    }
  }
}

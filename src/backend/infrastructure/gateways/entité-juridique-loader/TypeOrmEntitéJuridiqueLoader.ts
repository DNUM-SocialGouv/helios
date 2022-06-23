import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/entité-juridique/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../../../métier/entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueDeRattachement } from '../../../métier/entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { EntitéJuridiqueLoader } from '../../../métier/gateways/EntitéJuridiqueLoader'

export class TypeOrmEntitéJuridiqueLoader implements EntitéJuridiqueLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeParNuméroFiness(numéroFiness: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée> {
    const entitéJuridiqueModel = await this.chargeLEntitéJuridiqueModel(numéroFiness)

    if (!entitéJuridiqueModel) {
      return new EntitéJuridiqueNonTrouvée(numéroFiness)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()

    return this.construisLEntitéJuridique(entitéJuridiqueModel, dateDeMiseAJourModel)
  }

  async chargeLEntitéJuridiqueDeRattachement(numéroFiness: string): Promise<EntitéJuridiqueDeRattachement> {
    const entitéJuridiqueDeRattachement = await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .findOneBy({ numéroFinessEntitéJuridique: numéroFiness })

    return {
      raisonSocialeDeLEntitéDeRattachement: entitéJuridiqueDeRattachement ? entitéJuridiqueDeRattachement.raisonSociale : '',
      statutJuridique: entitéJuridiqueDeRattachement ? entitéJuridiqueDeRattachement.libelléStatutJuridique : '',
    }
  }

  private async chargeLaDateDeMiseÀJourModel() {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private async chargeLEntitéJuridiqueModel(numéroFiness: string) {
    return await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .findOneBy({ numéroFinessEntitéJuridique: numéroFiness })
  }

  private construisLEntitéJuridique(entitéJuridiqueModel: EntitéJuridiqueModel, dateDeMiseAJourModel: DateMiseÀJourSourceModel | null): EntitéJuridique {
    return {
      adresseAcheminement: entitéJuridiqueModel.adresseAcheminement,
      adresseNuméroVoie: entitéJuridiqueModel.adresseNuméroVoie,
      adresseTypeVoie: entitéJuridiqueModel.adresseTypeVoie,
      adresseVoie: entitéJuridiqueModel.adresseVoie,
      dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
      libelléStatutJuridique: entitéJuridiqueModel.libelléStatutJuridique,
      numéroFinessEntitéJuridique: entitéJuridiqueModel.numéroFinessEntitéJuridique,
      raisonSociale: entitéJuridiqueModel.raisonSociale,
      téléphone: entitéJuridiqueModel.téléphone,
    }
  }
}

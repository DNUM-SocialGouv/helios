import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../../métier/entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueLoader } from '../../métier/gateways/EntitéJuridiqueLoader'

export class TypeORMEntitéJuridiqueLoader implements EntitéJuridiqueLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeParNuméroFINESS(numéroFINESS: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée> {
    const entitéJuridiqueModel = await this.chargeLEntitéJuridiqueModel(numéroFINESS)

    if (!entitéJuridiqueModel) {
      return new EntitéJuridiqueNonTrouvée()
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()

    return this.construitLEntitéJuridique(entitéJuridiqueModel, dateDeMiseAJourModel)
  }

  private async chargeLaDateDeMiseÀJourModel() {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private async chargeLEntitéJuridiqueModel(numéroFINESS: string) {
    return await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .findOneBy({ numéroFinessEntitéJuridique: numéroFINESS })
  }

  private construitLEntitéJuridique(entitéJuridiqueModel: EntitéJuridiqueModel, dateDeMiseAJourModel: DateMiseÀJourSourceModel | null): EntitéJuridique {
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

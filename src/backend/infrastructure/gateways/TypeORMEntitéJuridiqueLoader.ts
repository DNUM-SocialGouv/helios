import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../métier/entities/EntitéJuridique'

export class TypeORMEntitéJuridiqueLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeParNuméroFINESS(numéroFINESS: string): Promise<EntitéJuridique> {
    const entitéJuridiqueModel = await(await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .findOneBy({ numéroFinessEntitéJuridique: numéroFINESS })

    const dateDeMiseAJourModel = await(await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })

    return {
      adresseAcheminement: entitéJuridiqueModel?.adresseAcheminement,
      adresseNuméroVoie: entitéJuridiqueModel?.adresseNuméroVoie,
      adresseTypeVoie: entitéJuridiqueModel?.adresseTypeVoie,
      adresseVoie: entitéJuridiqueModel?.adresseVoie,
      dateMiseAJourSource: dateDeMiseAJourModel?.dernièreMiseÀJour,
      libelléStatutJuridique: entitéJuridiqueModel?.libelléStatutJuridique,
      numéroFinessEntitéJuridique: entitéJuridiqueModel?.numéroFinessEntitéJuridique,
      raisonSociale: entitéJuridiqueModel?.raisonSociale,
      téléphone: entitéJuridiqueModel?.téléphone,
    }
  }
}

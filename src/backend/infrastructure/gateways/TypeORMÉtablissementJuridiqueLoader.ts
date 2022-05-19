import { DataSource } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../métier/entities/EntitéJuridique'

export class ÉtablissementJuridiqueLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeParNuméroFINESS(numéroFINESS: string): Promise<EntitéJuridique> {
    await(await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .findOneBy({ numéroFinessEntitéJuridique: numéroFINESS })
  }
}

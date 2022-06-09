import { DataSource } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridiqueHeliosLoader } from '../../../métier/gateways/EntitéJuridiqueHeliosLoader'

export class TypeOrmEntitéJuridiqueHeliosLoader implements EntitéJuridiqueHeliosLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async récupèreLeNuméroFinessDesEntitésJuridiques(): Promise<string[]> {
    const entitésJuridiques = await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .find({ select: { numéroFinessEntitéJuridique: true } })
    return this.construitUnTableauDeNuméroFiness(entitésJuridiques)
  }

  private construitUnTableauDeNuméroFiness(entitésJuridiques: EntitéJuridiqueModel[]): string[] {
    return entitésJuridiques.map((entitéJuridique) => entitéJuridique.numéroFinessEntitéJuridique)
  }
}

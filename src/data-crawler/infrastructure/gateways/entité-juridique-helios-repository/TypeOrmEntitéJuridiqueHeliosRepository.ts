import { DataSource } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueHeliosRepository } from '../../../métier/gateways/EntitéJuridiqueHeliosRepository'

export class TypeOrmEntitéJuridiqueHeliosRepository implements EntitéJuridiqueHeliosRepository {
  private readonly TAILLE_DE_FRAGMENT = 3000

  constructor(private readonly orm: Promise<DataSource>) {}

  async sauvegarde(entitésJuridiques: EntitéJuridique[]): Promise<void> {
    await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .save(entitésJuridiques, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  async supprime(numérosFinessDEntitésJuridiques: string[]): Promise<void> {
    const entitésJuridiquesÀSupprimer = this.construisLesEntitésJuridiquesModels(numérosFinessDEntitésJuridiques)
    await this.supprimeLesEntitésJuridiques(entitésJuridiquesÀSupprimer)
  }

  private async supprimeLesEntitésJuridiques(entitésJuridiquesÀSupprimer: EntitéJuridiqueModel[]) {
    await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .remove(entitésJuridiquesÀSupprimer, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  private construisLesEntitésJuridiquesModels(numérosFinessDEntitésJuridiques: string[]) {
    return numérosFinessDEntitésJuridiques.map((numéroFiness) => {
      return { numéroFinessEntitéJuridique: numéroFiness }
    }) as EntitéJuridiqueModel[]
  }
}

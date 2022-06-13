import { DataSource } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueHeliosRepository } from '../../../métier/gateways/EntitéJuridiqueHeliosRepository'
import { Logger } from '../../../métier/gateways/Logger'

export class TypeOrmEntitéJuridiqueHeliosRepository implements EntitéJuridiqueHeliosRepository {
  private readonly TAILLE_DE_FRAGMENT = 3000

  constructor(private readonly orm: Promise<DataSource>, private logger: Logger) {}

  async sauvegarde(entitésJuridiques: EntitéJuridique[]): Promise<void> {
    this.logger.info(`[Helios] Sauvegarde ${entitésJuridiques.length} entités juridiques.`)
    await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .save(entitésJuridiques, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  async supprime(numérosFinessDEntitésJuridiques: string[]): Promise<void> {
    const entitésJuridiquesÀSupprimer = this.construisLesEntitésJuridiquesModels(numérosFinessDEntitésJuridiques)
    this.logger.info(`[Helios] Supprime ${entitésJuridiquesÀSupprimer.length} entités juridiques.`)
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

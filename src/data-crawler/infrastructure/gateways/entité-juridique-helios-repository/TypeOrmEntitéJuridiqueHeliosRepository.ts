import { DataSource } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueHeliosRepository } from '../../../métier/gateways/EntitéJuridiqueHeliosRepository'
import { Logger } from '../../../métier/gateways/Logger'

export class TypeOrmEntitéJuridiqueHeliosRepository implements EntitéJuridiqueHeliosRepository {
  private readonly TAILLE_DE_FRAGMENT = 3000

  constructor(private readonly orm: Promise<DataSource>, private logger: Logger) {}

  async sauvegarde(entitésJuridiques: EntitéJuridique[], batchSize: number = 20): Promise<void> {
    const entitésJuridiquesLength = entitésJuridiques.length
    this.logger.info(`[Helios] Sauvegarde ${entitésJuridiquesLength} entités juridiques.`)

    for (let index = 0; index < entitésJuridiquesLength; index = index + batchSize) {
      const entitésJuridiquesBatch = this.créeLeBatch(batchSize, entitésJuridiques, index)

      await this.metsÀJourLeBatch(entitésJuridiquesBatch)
    }
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

  private créeLeBatch(batchSize: number, entitésJuridiques: EntitéJuridique[], index: number) {
    const entitésJuridiquesBatch = []

    for (let indexInBatch = 0; indexInBatch < batchSize; indexInBatch++) {
      if (entitésJuridiques[index + indexInBatch]) {
        entitésJuridiquesBatch.push(entitésJuridiques[index + indexInBatch])
      }
    }

    return entitésJuridiquesBatch
  }

  private async metsÀJourLeBatch(entitésJuridiques: EntitéJuridique[]) {
    await(await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .upsert(entitésJuridiques, ['numéroFinessEntitéJuridique'])
  }
}

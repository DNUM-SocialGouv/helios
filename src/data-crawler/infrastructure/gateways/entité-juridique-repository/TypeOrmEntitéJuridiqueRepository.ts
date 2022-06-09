import { DataSource } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueRepository } from '../../../métier/gateways/EntitéJuridiqueRepository'

export class TypeOrmEntitéJuridiqueRepository implements EntitéJuridiqueRepository {
  constructor(private readonly orm: Promise<DataSource>) {}

  async sauvegarde(entitésJuridiques: EntitéJuridique[], batchSize: number = 20): Promise<void> {
    const entitésJuridiquesLength = entitésJuridiques.length

    for (let index = 0; index < entitésJuridiquesLength; index = index + batchSize) {
      const entitésJuridiquesBatch = this.créeLeBatch(batchSize, entitésJuridiques, index)

      await this.metsÀJourLeBatch(entitésJuridiquesBatch)
    }
  }

  async supprime(numérosFinessDEntitésJuridiques: string[]): Promise<void> {
    await(await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .delete(numérosFinessDEntitésJuridiques)
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

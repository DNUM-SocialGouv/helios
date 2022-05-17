import { DataSource } from 'typeorm'

import { EntitéJuridiqueEntity } from '../../../../../database/entities/EntitéJuridiqueEntity'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueRepository } from '../../../métier/gateways/EntitéJuridiqueRepository'

export class TypeORMEntitéJuridiqueRepository implements EntitéJuridiqueRepository {
  constructor(private readonly dataSource: Promise<DataSource>) {}

  async save(entitésJuridiques: EntitéJuridique[], batchSize: number = 20): Promise<void> {
    const entitésJuridiquesLength = entitésJuridiques.length

    for (let index = 0; index < entitésJuridiquesLength; index = index + batchSize) {
      const entitésJuridiquesBatch = this.createBatch(batchSize, entitésJuridiques, index)

      await this.upsertBatch(entitésJuridiquesBatch)
    }
  }

  private createBatch(batchSize: number, entitésJuridiques: EntitéJuridique[], index: number) {
    const entitésJuridiquesBatch = []

    for (let indexInBatch = 0; indexInBatch < batchSize; indexInBatch++) {
      if (entitésJuridiques[index + indexInBatch]) {
        entitésJuridiquesBatch.push(entitésJuridiques[index + indexInBatch])
      }
    }

    return entitésJuridiquesBatch
  }

  private async upsertBatch(entitésJuridiques: EntitéJuridique[]) {
    await(await this.dataSource)
      .getRepository(EntitéJuridiqueEntity)
      .upsert(entitésJuridiques, ['numéroFinessEntitéJuridique'])
  }
}

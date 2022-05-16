import { EntitéJuridiqueEntity } from '../../../../../migrations/entities/EntitéJuridiqueEntity'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueRepository } from '../../../métier/gateways/EntitéJuridiqueRepository'

export class FinessEntitéJuridiqueRepository implements EntitéJuridiqueRepository {
  constructor(private readonly dataSourceInit: any) {}

  async save(entitésJuridiques: EntitéJuridique[]): Promise<void> {
    const dataSource = await this.dataSourceInit()
    const entitésJuridiquesLength = entitésJuridiques.length
    const batchSize = 20

    for (let index = 0; index < entitésJuridiquesLength; index = index + batchSize) {
      const entitésJuridiquesBatch = []

      for (let index2 = 0; index2 < batchSize; index2++) {
        if (entitésJuridiques[index + index2]) {
          entitésJuridiquesBatch.push(entitésJuridiques[index + index2])
        }
      }

      await dataSource
        .getRepository(EntitéJuridiqueEntity)
        .upsert(entitésJuridiquesBatch, ['numéroFinessEntitéJuridique'])
    }
  }
}

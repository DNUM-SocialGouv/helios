import { DataSource } from 'typeorm'

import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueRepository } from '../../../métier/gateways/EntitéJuridiqueRepository'

export class TypeOrmEntitéJuridiqueRepository implements EntitéJuridiqueRepository {
  private readonly CHUNK_SIZE_POUR_SUPPRESSION = 3000

  constructor(private readonly orm: Promise<DataSource>) {}

  async sauvegarde(entitésJuridiques: EntitéJuridique[], batchSize: number = 20): Promise<void> {
    const entitésJuridiquesLength = entitésJuridiques.length

    for (let index = 0; index < entitésJuridiquesLength; index = index + batchSize) {
      const entitésJuridiquesBatch = this.créeLeBatch(batchSize, entitésJuridiques, index)

      await this.metsÀJourLeBatch(entitésJuridiquesBatch)
    }
  }

  async supprime(numérosFinessDEntitésJuridiques: string[]): Promise<void> {
    const entitésJuridiquesÀSupprimer = this.construitLesEntitésJuridiquesModels(numérosFinessDEntitésJuridiques)

    await this.supprimeLesEntitésJuridiques(entitésJuridiquesÀSupprimer)
  }

  private async supprimeLesEntitésJuridiques(entitésJuridiquesÀSupprimer: EntitéJuridiqueModel[]) {
    await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .remove(entitésJuridiquesÀSupprimer, { chunk: this.CHUNK_SIZE_POUR_SUPPRESSION })
  }

  private construitLesEntitésJuridiquesModels(numérosFinessDEntitésJuridiques: string[]) {
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

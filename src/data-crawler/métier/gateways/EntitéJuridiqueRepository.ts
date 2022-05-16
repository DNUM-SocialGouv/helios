import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitéJuridiqueRepository {
  save(entitésJuridiques: EntitéJuridique[], batchSize: number): Promise<void>
}

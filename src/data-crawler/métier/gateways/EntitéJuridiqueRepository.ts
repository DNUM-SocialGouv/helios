import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitéJuridiqueRepository {
  save(entitésJuridiques: EntitéJuridique[]): Promise<void>
}

import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitéJuridiqueRepository {
  sauvegarde(entitésJuridiques: EntitéJuridique[], batchSize?: number): Promise<void>
  supprime(numérosFinessDEntitésJuridiques: string[]): Promise<void>
}

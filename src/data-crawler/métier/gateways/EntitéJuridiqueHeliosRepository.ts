import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitéJuridiqueHeliosRepository {
  sauvegarde(entitésJuridiques: EntitéJuridique[], batchSize?: number): Promise<void>
  supprime(numérosFinessDEntitésJuridiques: string[]): Promise<void>
}

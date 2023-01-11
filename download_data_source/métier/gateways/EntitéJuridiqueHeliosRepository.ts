import { EntitéJuridique } from "../entities/EntitéJuridique";

export interface EntitéJuridiqueHeliosRepository {
  sauvegarde(entitésJuridiques: EntitéJuridique[], dateDeMiseAJourDuFichierSource: string, batchSize?: number): Promise<void>;
  supprime(numérosFinessDEntitésJuridiques: string[]): Promise<void>;
}

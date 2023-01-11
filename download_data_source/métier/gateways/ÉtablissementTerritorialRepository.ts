import { ÉtablissementTerritorialIdentité } from "../entities/ÉtablissementTerritorialIdentité";

export interface ÉtablissementTerritorialRepository {
  sauvegarde(établissementsTerritoriaux: ÉtablissementTerritorialIdentité[], dateDeMiseÀJourDuFichierSource: string, batchSize?: number): Promise<void>;
  supprime(numérosFinessDesÉtablissementsTerritoriaux: string[]): Promise<void>;
}

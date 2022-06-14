import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'

export interface ÉtablissementTerritorialRepository {
  sauvegarde(établissementsTerritoriaux: ÉtablissementTerritorialIdentité[], batchSize?: number): Promise<void>
  supprime(numérosFinessDesÉtablissementsTerritoriaux: string[]): Promise<void>
}

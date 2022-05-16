import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'

export interface ÉtablissementTerritorialRepository {
  save(établissementsTerritoriaux: ÉtablissementTerritorialIdentité[], batchSize?: number): Promise<void>
}

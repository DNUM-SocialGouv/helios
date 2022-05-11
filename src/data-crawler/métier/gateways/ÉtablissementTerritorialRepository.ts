import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'

export interface ÉtablissementTerritorialRepository {
  save(établissementsTerritoriaux: ÉtablissementTerritorialIdentité[]): Promise<void>
}

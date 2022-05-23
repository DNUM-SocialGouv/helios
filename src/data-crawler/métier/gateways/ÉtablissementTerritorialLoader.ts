import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'

export interface ÉtablissementTerritorialLoader {
  récupèreLesÉtablissementsTerritoriaux(): ÉtablissementTerritorialIdentité[]
}

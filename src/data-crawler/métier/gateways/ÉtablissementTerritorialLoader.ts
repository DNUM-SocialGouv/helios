import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'

export interface ÉtablissementTerritorialLoader {
  récupérerLesÉtablissementsTerritoriaux(): ÉtablissementTerritorialIdentité[]
}

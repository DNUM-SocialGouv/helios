import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'

export interface ÉtablissementTerritorialLoader {
  récupèreLesÉtablissementsTerritoriauxOuverts(): ÉtablissementTerritorialIdentité[]
}

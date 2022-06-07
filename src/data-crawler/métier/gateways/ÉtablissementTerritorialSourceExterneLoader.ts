import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'

export interface ÉtablissementTerritorialSourceExterneLoader {
  récupèreLesÉtablissementsTerritoriauxOuverts(): ÉtablissementTerritorialIdentité[]
}

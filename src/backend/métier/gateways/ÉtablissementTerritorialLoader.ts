import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../entities/ÉtablissementTerritorialNonTrouvée'

export interface ÉtablissementTerritorialLoader {
  chargeParNuméroFiness(numéroFiness: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialNonTrouvée>
  compteLesÉtablissementsDUneMêmeEntité(numéroFinessEntitéJuridique: string): Promise<number>
}

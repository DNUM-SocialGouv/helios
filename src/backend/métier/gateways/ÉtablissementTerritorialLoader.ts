import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { MonoÉtablissement } from '../entities/ÉtablissementTerritorialMédicoSocial/MonoÉtablissement'
import { ÉtablissementTerritorialNonTrouvée } from '../entities/ÉtablissementTerritorialNonTrouvée'

export interface ÉtablissementTerritorialLoader {
  chargeParNuméroFiness(numéroFiness: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialNonTrouvée>
  estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement>
}

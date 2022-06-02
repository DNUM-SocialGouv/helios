import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { MonoÉtablissement } from '../entities/ÉtablissementTerritorialMédicoSocial/MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'

export interface ÉtablissementTerritorialMédicoSocialLoader {
  chargeParNuméroFiness(numéroFiness: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée>
  estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement>
}

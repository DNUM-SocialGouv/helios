import { MonoÉtablissement } from '../entities/établissement-territorial-médico-social/MonoÉtablissement'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'

export interface ÉtablissementTerritorialMédicoSocialLoader {
  chargeParNuméroFiness(numéroFiness: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée>
  estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement>
}

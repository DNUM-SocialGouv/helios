import { MonoÉtablissement } from '../entities/établissement-territorial-médico-social/MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'

export interface ÉtablissementTerritorialMédicoSocialLoader {
  chargeActivitéParNuméroFiness(numéroFiness: string): Promise<ÉtablissementTerritorialMédicoSocialActivité[] | ÉtablissementTerritorialMédicoSocialNonTrouvée>
  chargeIdentitéParNuméroFiness(numéroFiness: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée>
  estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement>
}

import { MonoÉtablissement } from '../entities/établissement-territorial-médico-social/MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation'
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances'
import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'

export interface ÉtablissementTerritorialMédicoSocialLoader {
  chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialActivité[]>
  chargeIdentité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée>
  chargeAutorisationsEtCapacités(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité>
  chargeBudgetEtFinances(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialBudgetEtFinances[]>
  chargeRessourcesHumaines(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialRessourcesHumaines[]>
  estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement>
}

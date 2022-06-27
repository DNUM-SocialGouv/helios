import { ÉtablissementTerritorialMédicoSocialActivité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialActivitéNonTrouvée } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivitéNonTrouvé'

export interface ÉtablissementTerritorialMédicoSocialActivitéLoader {
  chargeParNuméroFiness(numéroFiness: string): Promise<ÉtablissementTerritorialMédicoSocialActivité[] | ÉtablissementTerritorialMédicoSocialActivitéNonTrouvée>
}

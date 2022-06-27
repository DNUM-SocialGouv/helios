import { ÉtablissementTerritorialMédicoSocialActivité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialActivitéNonTrouvée } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivitéNonTrouvé'
import { ÉtablissementTerritorialMédicoSocialActivitéLoader } from '../gateways/ÉtablissementTerritorialMédicoSocialActivitéLoader'

export class RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase {
  constructor(private établissementTerritorialMédicoSocialActivitéLoader: ÉtablissementTerritorialMédicoSocialActivitéLoader) {}

  async exécute(numéroFinessÉtablissementTerritorialMédicoSocial: string): Promise<ÉtablissementTerritorialMédicoSocialActivité[]> {
    const établissementTerritorialMédicoSocialActivitéOuErreur =
      await this.établissementTerritorialMédicoSocialActivitéLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorialMédicoSocial)

    if (établissementTerritorialMédicoSocialActivitéOuErreur instanceof ÉtablissementTerritorialMédicoSocialActivitéNonTrouvée) {
      throw établissementTerritorialMédicoSocialActivitéOuErreur
    }

    return établissementTerritorialMédicoSocialActivitéOuErreur
  }
}

import { ÉtablissementTerritorialMédicoSocialActivité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../gateways/ÉtablissementTerritorialMédicoSocialLoader'

export class RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase {
  constructor(private établissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader) {}

  async exécute(numéroFinessÉtablissementTerritorialMédicoSocial: string): Promise<ÉtablissementTerritorialMédicoSocialActivité[]> {
    const établissementTerritorialMédicoSocialActivitéOuErreur =
      await this.établissementTerritorialMédicoSocialLoader.chargeActivitéParNuméroFiness(numéroFinessÉtablissementTerritorialMédicoSocial)

    if (établissementTerritorialMédicoSocialActivitéOuErreur instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      throw établissementTerritorialMédicoSocialActivitéOuErreur
    }

    return établissementTerritorialMédicoSocialActivitéOuErreur
  }
}

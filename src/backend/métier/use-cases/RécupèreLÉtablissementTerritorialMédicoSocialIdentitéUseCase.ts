import { ÉtablissementTerritorialMédicoSocialIdentité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../gateways/ÉtablissementTerritorialMédicoSocialLoader'

export class RécupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase {
  constructor(private établissementTerritorialLoader: ÉtablissementTerritorialMédicoSocialLoader, private entitéJuridiqueLoader: EntitéJuridiqueLoader) {}

  async exécute(numéroFinessÉtablissementTerritorialMédicoSocial: string): Promise<ÉtablissementTerritorialMédicoSocialIdentité> {
    const établissementTerritorialMédicoSocialOuErreur =
      await this.établissementTerritorialLoader.chargeIdentitéParNuméroFiness(numéroFinessÉtablissementTerritorialMédicoSocial)

    if (établissementTerritorialMédicoSocialOuErreur instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      throw établissementTerritorialMédicoSocialOuErreur
    }

    const { estMonoÉtablissement } = await this.établissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessÉtablissementTerritorialMédicoSocial)

    const entitéJuridiqueDeRattachement = await this.entitéJuridiqueLoader.chargeLEntitéJuridiqueDeRattachement(
      établissementTerritorialMédicoSocialOuErreur.numéroFinessEntitéJuridique
    )

    return {
      ...établissementTerritorialMédicoSocialOuErreur,
      ...entitéJuridiqueDeRattachement,
      estMonoÉtablissement,
    }
  }
}

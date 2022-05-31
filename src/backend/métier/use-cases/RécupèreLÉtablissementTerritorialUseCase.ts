import { ÉtablissementTerritorialMédicoSocialIdentité } from '../entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../entities/ÉtablissementTerritorialNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'

export class RécupèreLÉtablissementTerritorialUseCase {
  constructor(private établissementTerritorialLoader: ÉtablissementTerritorialLoader, private entitéJuridiqueLoader: EntitéJuridiqueLoader) {}

  async exécute(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocialIdentité> {
    const établissementTerritorialOuErreur = await this.établissementTerritorialLoader.chargeParNuméroFiness(numéroFinessÉtablissementTerritorial)

    if (établissementTerritorialOuErreur instanceof ÉtablissementTerritorialNonTrouvée) {
      throw établissementTerritorialOuErreur
    }

    const { estMonoÉtablissement } = await this.établissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessÉtablissementTerritorial)

    const entitéJuridiqueDeRattachement = await this.entitéJuridiqueLoader.chargeLEntitéJuridiqueDeRattachement(
      établissementTerritorialOuErreur.numéroFinessEntitéJuridique
    )

    return {
      ...établissementTerritorialOuErreur,
      ...entitéJuridiqueDeRattachement,
      estMonoÉtablissement,
    }
  }
}

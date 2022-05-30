import { ÉtablissementTerritorialMédicoSocialIdentité } from '../entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../entities/ÉtablissementTerritorialNonTrouvée'
import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'

export class RécupèreLÉtablissementTerritorialUseCase {
  constructor(private établissementTerritorialLoader: ÉtablissementTerritorialLoader) {}

  async exécute(numéroFinessET: string): Promise<ÉtablissementTerritorialMédicoSocialIdentité> {
    const établissementTerritorialOuErreur = await this.établissementTerritorialLoader.chargeParNuméroFiness(numéroFinessET)

    if (établissementTerritorialOuErreur instanceof ÉtablissementTerritorialNonTrouvée) {
      throw établissementTerritorialOuErreur
    }

    // const estMonoÉtablissement = await this.établissementTerritorialLoader.estUnMonoÉtablissement(numéroFinessET)

    // const entitéJuridiqueDeRattachement = await this.entitéJuridiqueLoader.chargeLEntitéJuridique(numéroFinessET)

    return {
      ...établissementTerritorialOuErreur,
      entitéJuridiqueDeRattachement: {
        raisonSociale: '',
        statutJuridique: '',
      },
      estMonoÉtablissement: false,
    }
  }
}

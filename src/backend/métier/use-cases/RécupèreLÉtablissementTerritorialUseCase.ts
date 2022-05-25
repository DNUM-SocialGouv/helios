import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../entities/ÉtablissementTerritorialNonTrouvée'
import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'

export class RécupèreLÉtablissementTerritorialUseCase {
  constructor(private établissementTerritorialLoader: ÉtablissementTerritorialLoader) {}

  async exécute(numéroFinessET: string): Promise<ÉtablissementTerritorialIdentité> {
    const établissementTerritorialOuErreur = await this.établissementTerritorialLoader.chargeParNuméroFiness(numéroFinessET)

    if (établissementTerritorialOuErreur instanceof ÉtablissementTerritorialNonTrouvée) {
      throw établissementTerritorialOuErreur
    }

    // const toto = loader.donneMoiLaRaisonSocialeDuparent(établissementTerritorialOuErreur.numéroFinessEJ)

    // const etfinal = New ÉtablissementTerritorialIdentité(établissementTerritorialOuErreur, toto, mono)

    return établissementTerritorialOuErreur
  }
}

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

    // const nb_et_dans_ej = loader.compteLesÉtablissementsDUneMêmeEntité(numéroFinessEJ)

    // const raisonSocialeParent = loader.chargeLaRaisonSocialeDuparent(établissementTerritorialOuErreur.numéroFinessEJ)

    // const statutJuridique = loader.chargeLeStatutJuridiqueDUnEJ(établissementTerritorialOuErreur.numéroFinessEJ)

    // const etfinal = New ÉtablissementTerritorialIdentité(établissementTerritorialOuErreur, raisonSocialeParent, nb_et_dans_ej, statutJuridique)

    return établissementTerritorialOuErreur
  }
}

import { ÉtablissementTerritorialMédicoSocial } from '../entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocial'
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

    const nombreDÉtablissementTerritoriauxDansLEntitéJuridique = await this.établissementTerritorialLoader.compteLesÉtablissementsDUneMêmeEntité(
      établissementTerritorialOuErreur.numéroFinessEntitéJuridique
    )

    // const raisonSocialeParent = loader.chargeLaRaisonSocialeDuparent(établissementTerritorialOuErreur.numéroFinessEJ)

    // const statutJuridique = loader.chargeLeStatutJuridiqueDUnEJ(établissementTerritorialOuErreur.numéroFinessEJ)

    const établissementTerritorialMédicoSocial = new ÉtablissementTerritorialMédicoSocial(
      établissementTerritorialOuErreur, nombreDÉtablissementTerritoriauxDansLEntitéJuridique
    )

    return établissementTerritorialMédicoSocial.serialize()
  }
}

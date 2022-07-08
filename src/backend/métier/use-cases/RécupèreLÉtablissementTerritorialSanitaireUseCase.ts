import { ÉtablissementTerritorialSanitaireIdentité } from '../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialSanitaireLoader } from '../gateways/ÉtablissementTerritorialSanitaireLoader'

export class RécupèreLÉtablissementTerritorialSanitaireUseCase {
  constructor(private établissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader, private entitéJuridiqueLoader: EntitéJuridiqueLoader) {}

  async exécute(numéroFinessÉtablissementTerritorialSanitaire: string): Promise<ÉtablissementTerritorialSanitaireIdentité> {
    const établissementTerritorialSanitaireOuErreur =
      await this.établissementTerritorialSanitaireLoader.chargeIdentité(numéroFinessÉtablissementTerritorialSanitaire)
    if (établissementTerritorialSanitaireOuErreur instanceof ÉtablissementTerritorialSanitaireNonTrouvée) {
      throw établissementTerritorialSanitaireOuErreur
    }

    const entitéJuridiqueDeRattachement = await this.entitéJuridiqueLoader.chargeLEntitéJuridiqueDeRattachement(
      établissementTerritorialSanitaireOuErreur.numéroFinessEntitéJuridique
    )

    return {
      ...établissementTerritorialSanitaireOuErreur,
      ...entitéJuridiqueDeRattachement,
    }
  }
}

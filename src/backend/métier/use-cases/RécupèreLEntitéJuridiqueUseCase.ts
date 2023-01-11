import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private entitéJuridiqueLoader: EntitéJuridiqueLoader) {}

  async exécute(numéroFiness: string): Promise<EntitéJuridique> {
    const entitéJuridiqueOuErreur = await this.entitéJuridiqueLoader.chargeIdentité(numéroFiness);

    if (entitéJuridiqueOuErreur instanceof EntitéJuridiqueNonTrouvée) {
      throw entitéJuridiqueOuErreur;
    }

    return entitéJuridiqueOuErreur;
  }
}

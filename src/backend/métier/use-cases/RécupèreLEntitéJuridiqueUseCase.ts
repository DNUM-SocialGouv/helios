import { AutorisationsEtCapacitesPresenter } from "../entities/entité-juridique/AutorisationsEtCapacitesPresenter";
import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private readonly entitéJuridiqueLoader: EntitéJuridiqueLoader) { }

  async exécute(numéroFiness: string): Promise<EntitéJuridique> {
    const entitéJuridiqueIdentitéOuErreur = await this.entitéJuridiqueLoader.chargeIdentité(numéroFiness);
    const activités = await this.entitéJuridiqueLoader.chargeActivités(numéroFiness);
    const activitésMensuels = await this.entitéJuridiqueLoader.chargeActivitésMensuel(numéroFiness);
    const budgetFinance = await this.entitéJuridiqueLoader.chargeBudgetFinance(numéroFiness);
    const autorisationsEtCapacites = await this.entitéJuridiqueLoader.chargeAutorisationsEtCapacités(numéroFiness);
    const allocationRessource = await this.entitéJuridiqueLoader.chargeAllocationRessource(numéroFiness);

    if (entitéJuridiqueIdentitéOuErreur instanceof EntitéJuridiqueNonTrouvée) {
      throw entitéJuridiqueIdentitéOuErreur;
    }

    return {
      ...entitéJuridiqueIdentitéOuErreur,
      activités,
      activitésMensuels,
      budgetFinance,
      autorisationsEtCapacites: AutorisationsEtCapacitesPresenter.present(autorisationsEtCapacites),
      allocationRessource
    };
  }
}

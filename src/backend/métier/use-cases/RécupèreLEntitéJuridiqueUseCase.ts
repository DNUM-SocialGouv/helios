import { AutorisationsEtCapacitesPresenter } from "../entities/entité-juridique/AutorisationsEtCapacitesPresenter";
import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private readonly entiteJuridiqueLoader: EntitéJuridiqueLoader) { }

  async exécute(numeroFiness: string): Promise<EntitéJuridique> {
    const entiteJuridiqueIdentiteOuErreur = await this.entiteJuridiqueLoader.chargeIdentité(numeroFiness);
    const activites = await this.entiteJuridiqueLoader.chargeActivités(numeroFiness);
    const activitesMensuels = await this.entiteJuridiqueLoader.chargeActivitésMensuel(numeroFiness);
    const budgetFinance = await this.entiteJuridiqueLoader.chargeBudgetFinance(numeroFiness);
    const autorisationsEtCapacites = await this.entiteJuridiqueLoader.chargeAutorisationsEtCapacités(numeroFiness);
    const allocationRessource = await this.entiteJuridiqueLoader.chargeAllocationRessource(numeroFiness);
    const ressourcesHumaines = await this.entiteJuridiqueLoader.chargeRessourcesHumaines(numeroFiness);

    if (entiteJuridiqueIdentiteOuErreur instanceof EntitéJuridiqueNonTrouvée) {
      throw entiteJuridiqueIdentiteOuErreur;
    }

    return {
      ...entiteJuridiqueIdentiteOuErreur,
      activités: activites,
      activitésMensuels: activitesMensuels,
      budgetFinance,
      autorisationsEtCapacites: AutorisationsEtCapacitesPresenter.present(autorisationsEtCapacites),
      allocationRessource,
      ressourcesHumaines
    };
  }
}

import { AutorisationSanitaireModel } from "../../../../database/models/AutorisationSanitaireModel";
import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import { AutorisationActivites } from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private entitéJuridiqueLoader: EntitéJuridiqueLoader) {}

  async exécute(numéroFiness: string): Promise<EntitéJuridique> {
    const entitéJuridiqueIdentitéOuErreur = await this.entitéJuridiqueLoader.chargeIdentité(numéroFiness);
    const activités = await this.entitéJuridiqueLoader.chargeActivités(numéroFiness);
    const budgetFinance = await this.entitéJuridiqueLoader.chargeBudgetFinance(numéroFiness);
    const autorisationsEtCapacites = await this.entitéJuridiqueLoader.chargeAutorisationsEtCapacités(numéroFiness);

    if (entitéJuridiqueIdentitéOuErreur instanceof EntitéJuridiqueNonTrouvée) {
      throw entitéJuridiqueIdentitéOuErreur;
    }

    const autorisationsActivites = this.grouperLesAutorisationsParActivités(autorisationsEtCapacites.autorisationsSanitaire);
    this.grouperLesAutorisationsParModalités(autorisationsEtCapacites.autorisationsSanitaire, autorisationsActivites);
    return {
      ...entitéJuridiqueIdentitéOuErreur,
      activités,
      budgetFinance,
      autorisationsEtCapacites: { ...autorisationsEtCapacites, autorisationsActivités: autorisationsActivites },
    };
  }

  private grouperLesAutorisationsParModalités(autorisationsEntities: AutorisationSanitaireModel[], autorisationsActivites: AutorisationActivites[]) {
    autorisationsEntities.forEach((autorisationEntity) => {
      const currentModalité = {
        code: autorisationEntity.codeModalité,
        libelle: autorisationEntity.libelléModalité,
      };
      const activité = autorisationsActivites.find((autorisation) => autorisation.code === autorisationEntity.codeActivité) as AutorisationActivites;
      const modalitéExiste = activité.modalités.find((modalité) => modalité.code === currentModalité.code);
      if (!modalitéExiste) {
        activité.modalités.push(currentModalité);
      }
    });
  }

  private grouperLesAutorisationsParActivités(autorisationsEntities: AutorisationSanitaireModel[]) {
    const autorisationsActivites: AutorisationActivites[] = [];
    autorisationsEntities.forEach((autorisationEntity) => {
      const currentActivité = {
        code: autorisationEntity.codeActivité,
        libelle: autorisationEntity.libelléActivité,
      };
      const existingActivité = autorisationsActivites.find((autorisation) => autorisation.code === currentActivité.code);
      if (existingActivité === undefined) {
        autorisationsActivites.push({
          ...currentActivité,
          modalités: [],
        });
      }
    });
    return autorisationsActivites;
  }
}

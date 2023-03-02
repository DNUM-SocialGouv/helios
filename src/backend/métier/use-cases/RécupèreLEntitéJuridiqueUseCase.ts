import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueBudgetFinance } from "../entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private entitéJuridiqueLoader: EntitéJuridiqueLoader) {}

  async exécute(numéroFiness: string): Promise<EntitéJuridique> {
    const entitéJuridiqueIdentitéOuErreur = await this.entitéJuridiqueLoader.chargeIdentité(numéroFiness);
    const activités = await this.entitéJuridiqueLoader.chargeActivités(numéroFiness);

    if (entitéJuridiqueIdentitéOuErreur instanceof EntitéJuridiqueNonTrouvée) {
      throw entitéJuridiqueIdentitéOuErreur;
    }

    const mockBudgetFinance: EntitéJuridiqueBudgetFinance = {
      depensesTitreIIIPrincipale: -270,
      depensesTitreIIPrincipale: -180,
      depensesTitreIPrincipale: -90,
      depensesTitreIVPrincipale: -360,
      recettesTitreIIIPrincipale: 270,
      recettesTitreIIPrincipale: 180,
      recettesTitreIPrincipale: 90,
      recettesTitreIVPrincipale: 360,
      année: 2022,
      dateMiseÀJourSource: "2022-12-12",
      recettesTitreIGlobal: 100,
      recettesTitreIIGlobal: 200,
      recettesTitreIIIGlobal: 300,
      recettesTitreIVGlobal: 400,
      recettesTitreIH: 10,
      recettesTitreIIH: 20,
      recettesTitreIIIH: 30,
      depensesTitreIGlobal: -100,
      depensesTitreIIGlobal: -200,
      depensesTitreIIIGlobal: -300,
      depensesTitreIVGlobal: -400,
      depensesTitreIH: -10,
      depensesTitreIIH: -20,
      depensesTitreIIIH: -30,
      depensesTitreIVH: -40,
    };

    return {
      ...entitéJuridiqueIdentitéOuErreur,
      activités,
      budgetFinance: [mockBudgetFinance],
    };
  }
}

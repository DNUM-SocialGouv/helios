import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { Wording } from "../../../configuration/wording/Wording";

export class EntitéJuridiqueBudgetFinanceViewModel {
  private budgetEtFinance: EntitéJuridiqueBudgetFinance[];
  private wording: Wording;

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], wording: Wording) {
    this.wording = wording;
    this.budgetEtFinance = budgetFinance;
  }

  public get lesDonnéesBudgetEtFinanceNesontPasRenseignées() {
    return this.budgetEtFinance.length === 0 || this.compteDeResultatVide();
  }

  private compteDeResultatVide() {
    return this.budgetEtFinance.every(
      (budgetFinance) =>
        !budgetFinance.depensesTitreIH &&
        !budgetFinance.depensesTitreIIH &&
        !budgetFinance.depensesTitreIIIH &&
        !budgetFinance.depensesTitreIVH &&
        !budgetFinance.recettesTitreIH &&
        !budgetFinance.recettesTitreIIH &&
        !budgetFinance.recettesTitreIIIH &&
        !budgetFinance.recettesTitreIGlobal &&
        !budgetFinance.recettesTitreIIGlobal &&
        !budgetFinance.recettesTitreIIIGlobal &&
        !budgetFinance.recettesTitreIVGlobal &&
        !budgetFinance.depensesTitreIGlobal &&
        !budgetFinance.depensesTitreIIGlobal &&
        !budgetFinance.depensesTitreIIIGlobal &&
        !budgetFinance.depensesTitreIVGlobal
    );
  }
}

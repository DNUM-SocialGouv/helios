import { Wording } from "../../../configuration/wording/Wording";

export class EntitéJuridiqueBudgetFinanceViewModel {
  private budgetEtFinance: any[];
  private wording: Wording;

  constructor(p: any[], wording: Wording) {
    this.wording = wording;
    this.budgetEtFinance = [];
  }

  public get lesDonnéesBudgetEtFinanceNesontPasRenseignées() {
    return this.budgetEtFinance.length === 0;
  }
}

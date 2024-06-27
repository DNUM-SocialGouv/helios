import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { annéesManquantes } from "../../../utils/dateUtils";
import { StringFormater } from "../../commun/StringFormater";

export class ResultatNetComptableViewModel {
  private budgetEtFinance: EntitéJuridiqueBudgetFinance[];
  private NOMBRE_ANNEES = 5;
  private autorisations: any;
  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], autorisations: any) {
    this.budgetEtFinance = budgetFinance;
    this.autorisations = autorisations;
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.budgetEtFinance[0]?.dateMiseÀJourSource as string);
  }

  public lesAnnéesManquantesDuResultatNet(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuResultatNet(), this.NOMBRE_ANNEES);
  }

  private lesAnnéesEffectivesDuResultatNet(): number[] {
    return this.budgetEtFinance.filter(this.resultatNetComptableRemplis).map((budget) => budget.année);
  }

  public auMoinsUnResultatNetRenseigné() {
    return this.budgetEtFinance.length > 0 && this.budgetEtFinance.every(this.resultatNetComptableRemplis);
  }
  public resultatNetComptable(): { année: number; valeur: string }[] {
    return this.budgetEtFinance
      .filter(this.resultatNetComptableRemplis)
      .filter((budget) => this.estDansLesAnneesVisible(budget))
      .sort(this.trierParAnnée)
      .map(this.formatResultNetComptable);
  }

  private trierParAnnée(budget1: EntitéJuridiqueBudgetFinance, budget2: EntitéJuridiqueBudgetFinance) {
    return budget1.année < budget2.année ? -1 : 1;
  }

  private formatResultNetComptable(budget: EntitéJuridiqueBudgetFinance) {
    return {
      année: budget.année,
      valeur: StringFormater.formatInEuro(budget.resultatNetComptable as number),
    };
  }

  private estDansLesAnneesVisible(budget: EntitéJuridiqueBudgetFinance): boolean {
    const currentAnnee = new Date().getFullYear();
    return budget.année >= currentAnnee - this.NOMBRE_ANNEES;
  }

  private resultatNetComptableRemplis(budget: EntitéJuridiqueBudgetFinance): boolean {
    return !!budget.resultatNetComptable;
  }

  public get resultatNetComptableEstIlAutorisé(): boolean {
    if(
      this.autorisations && 
      this.autorisations.budgetEtFinance && 
      this.autorisations.budgetEtFinance.résultatNetComptable && 
      this.autorisations.budgetEtFinance.résultatNetComptable === 'ok')
    {
      return true
    }
    return false
  }
}

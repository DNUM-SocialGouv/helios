import { EntitéJuridiqueBudgetFinance } from "../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { annéesManquantes } from "../../../../utils/dateUtils";
import { StringFormater } from "../../../commun/StringFormater";

type RatioDependanceFinanciere = { ratio: number | null; année: number; dateDeMiseÀJour: string };

export class RatioDependanceFinanciereViewModel {
  readonly NOMBRE_ANNEES = 5;
  private ratioDependanceFinanciere: RatioDependanceFinanciere[];

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[]) {
    this.ratioDependanceFinanciere = budgetFinance.map((budget) => ({
      année: budget.année,
      ratio: budget.ratioDependanceFinanciere,
      dateDeMiseÀJour: budget.dateMiseÀJourSource,
    }));
  }

  public get années(): number[] {
    return this.ratioDependanceFinanciere.map((ratio) => ratio.année);
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formateLaDate(this.ratioDependanceFinanciere[0]?.dateDeMiseÀJour);
  }

  public auMoinsUnRatioRenseigné() {
    return this.ratioDependanceFinanciere.length > 0 && this.ratioDependanceFinanciere.every(this.ratioRemplis);
  }

  private ratioRemplis(ratio: RatioDependanceFinanciere): boolean {
    return !!ratio.ratio;
  }

  private lesAnnéesEffectivesDuRatioDeDépendanceFinanciere(): number[] {
    return this.ratioDependanceFinanciere.filter(this.ratioRemplis).map((budget) => budget.année);
  }

  public lesAnnéesManquantesDuRatio(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuRatioDeDépendanceFinanciere(), this.NOMBRE_ANNEES);
  }

  public valeursRatio(): { année: number; valeur: string }[] {
    return this.ratioDependanceFinanciere
      .filter(this.ratioRemplis)
      .filter((ratio) => this.estDansLesAnneesVisible(ratio))
      .sort(this.trierParAnnée)
      .map(this.formatResultNetComptable);
  }

  public get valeurs(): number[] {
    return this.ratioDependanceFinanciere.map((ratio) => StringFormater.transformeEnTaux(ratio.ratio as number));
  }

  private estDansLesAnneesVisible(ratio: RatioDependanceFinanciere): boolean {
    const currentAnnee = new Date().getFullYear();
    return ratio.année >= currentAnnee - this.NOMBRE_ANNEES;
  }

  private trierParAnnée(ratio1: RatioDependanceFinanciere, ratio2: RatioDependanceFinanciere) {
    return ratio1.année < ratio2.année ? -1 : 1;
  }

  private formatResultNetComptable(ratio: RatioDependanceFinanciere) {
    return {
      année: ratio.année,
      valeur: StringFormater.transformeEnTaux(ratio.ratio) as string,
    };
  }
}

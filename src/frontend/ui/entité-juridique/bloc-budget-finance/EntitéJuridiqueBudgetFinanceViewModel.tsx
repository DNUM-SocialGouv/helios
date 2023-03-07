import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { HistogrammeLine } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { StringFormater } from "../../commun/StringFormater";

export class EntitéJuridiqueBudgetFinanceViewModel {
  private budgetEtFinance: EntitéJuridiqueBudgetFinance[];
  private wording: Wording;
  public NOMBRE_ANNEES = 5;

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], wording: Wording) {
    this.wording = wording;
    this.budgetEtFinance = budgetFinance;
  }

  public get annéeInitiale() {
    return this.budgetEtFinance[this.budgetEtFinance.length - 1]?.année;
  }

  budgetEtFinanceEnCours(annéeEnCours: number): EntitéJuridiqueBudgetFinance {
    return this.budgetEtFinance.find((budgetEtFinance) => budgetEtFinance.année === annéeEnCours) as EntitéJuridiqueBudgetFinance;
  }

  public get lesDonnéesBudgetEtFinanceNesontPasRenseignées() {
    return !this.budgetEtFinance || this.budgetEtFinance.length === 0 || this.compteDeResultatVide();
  }

  public lesAnnéesManquantesDuCompteDeRésultat(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat(), this.NOMBRE_ANNEES);
  }

  private lesAnnéesEffectivesDuCompteDeRésultat(): number[] {
    return this.budgetEtFinance.filter((budgetEtFinance) => !this.compteResultatVide(budgetEtFinance)).map((budgetFinance) => budgetFinance.année);
  }

  private compteDeResultatVide() {
    return this.budgetEtFinance.every(this.compteResultatVide);
  }

  private compteResultatVide(budgetFinance: EntitéJuridiqueBudgetFinance): boolean {
    return (
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

  annéesRangéesParAntéChronologie(): number[] {
    return this.budgetEtFinance.map((budgetEtFinance) => budgetEtFinance.année).reverse();
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formateLaDate(this.budgetEtFinance[0]?.dateMiseÀJourSource as string);
  }

  public dataGraphiqueCharges(budget: EntitéJuridiqueBudgetFinance): HistogrammeLine {
    return new HistogrammeLine(
      [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      [
        budget.totalDepensesGlobal,
        budget?.depensesTitreIGlobal,
        budget?.depensesTitreIIGlobal,
        budget?.depensesTitreIIIGlobal,
        budget?.depensesTitreIVGlobal,
      ].map(Number),
      [
        {
          label: "Charges Principales", //
          data: [
            budget.totalDepensesPrincipale,
            budget?.depensesTitreIPrincipale,
            budget?.depensesTitreIIPrincipale,
            budget?.depensesTitreIIIPrincipale,
            budget?.depensesTitreIVPrincipale,
          ].map(Number),
          backgroundColor: this.getBackgroundColorBudgetPrincipal(),
        },
        {
          label: "Charges Annexes",
          data: [budget.totalDepensesH, budget?.depensesTitreIH, budget?.depensesTitreIIH, budget?.depensesTitreIIIH, budget?.depensesTitreIVH].map(Number),
          backgroundColor: this.getBackgroundColorBudgetSecondaire(),
        },
      ],
      this.wording.CHARGES
    );
  }

  public dataGraphiqueProduits(budget: EntitéJuridiqueBudgetFinance): HistogrammeLine {
    return new HistogrammeLine(
      [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      [
        budget.totalRecettesGlobal,
        budget?.recettesTitreIGlobal,
        budget?.recettesTitreIIGlobal,
        budget?.recettesTitreIIIGlobal,
        budget?.recettesTitreIVGlobal,
      ].map(Number),
      [
        {
          label: "Produits Principals",
          data: [
            budget.totalRecettesPrincipale,
            budget?.recettesTitreIPrincipale,
            budget?.recettesTitreIIPrincipale,
            budget?.recettesTitreIIIPrincipale,
            budget?.recettesTitreIVPrincipale,
          ].map(Number),
          backgroundColor: this.getBackgroundColorBudgetPrincipal(),
        },
        {
          label: "Produits Annexes",
          data: [budget.totalRecettesH, budget?.recettesTitreIH, budget?.recettesTitreIIH, budget?.recettesTitreIIIH, 0].map(Number),
          backgroundColor: this.getBackgroundColorBudgetSecondaire(),
        },
      ],
      this.wording.PRODUITS
    );
  }

  private getBackgroundColorBudgetSecondaire() {
    return ["#FA794A", "#FB9175", "#FB9175", "#FB9175"];
  }

  private getBackgroundColorBudgetPrincipal() {
    return ["#2F4077", "#4E68BB", "#4E68BB", "#4E68BB", "#4E68BB"];
  }

  get légendeChart(): string[] {
    return ["Budget Principal", "Budgets Annexes"];
  }
}

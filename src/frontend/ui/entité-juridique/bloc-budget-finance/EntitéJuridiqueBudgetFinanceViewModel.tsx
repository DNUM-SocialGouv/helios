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
    return this.budgetEtFinance.length === 0 || this.compteDeResultatVide();
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
    return StringFormater.formateLaDate(this.budgetEtFinance[0].dateMiseÀJourSource as string);
  }

  public dataGraphiqueCharges(budgetEtFinance: EntitéJuridiqueBudgetFinance): HistogrammeLine {
    return {
      labels: [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      totals: [
        budgetEtFinance.totalDepensesGlobal,
        budgetEtFinance.depensesTitreIGlobal,
        budgetEtFinance.depensesTitreIIGlobal,
        budgetEtFinance.depensesTitreIIIGlobal,
        budgetEtFinance.depensesTitreIVGlobal,
      ].map(Number),
      stacks: [
        {
          data: [
            budgetEtFinance.totalDepensesPrincipale,
            budgetEtFinance.depensesTitreIPrincipale,
            budgetEtFinance.depensesTitreIIPrincipale,
            budgetEtFinance.depensesTitreIIIPrincipale,
            budgetEtFinance.depensesTitreIVPrincipale,
          ].map(Number),
          backgroundColor: ["blue"],
        },
        {
          data: [
            budgetEtFinance.totalDepensesH,
            budgetEtFinance.depensesTitreIH,
            budgetEtFinance.depensesTitreIIH,
            budgetEtFinance.depensesTitreIIIH,
            budgetEtFinance.depensesTitreIVH,
          ].map(Number),
          backgroundColor: ["orange"],
        },
      ],
    };
  }

  public dataGraphiqueProduits(budgetEtFinance: EntitéJuridiqueBudgetFinance): HistogrammeLine {
    return {
      labels: [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      totals: [
        budgetEtFinance.totalRecettesGlobal,
        budgetEtFinance.recettesTitreIGlobal,
        budgetEtFinance.recettesTitreIIGlobal,
        budgetEtFinance.recettesTitreIIIGlobal,
        budgetEtFinance.recettesTitreIVGlobal,
      ].map(Number),
      stacks: [
        {
          data: [
            budgetEtFinance.totalRecettesPrincipale,
            budgetEtFinance.recettesTitreIPrincipale,
            budgetEtFinance.recettesTitreIIPrincipale,
            budgetEtFinance.recettesTitreIIIPrincipale,
            budgetEtFinance.recettesTitreIVPrincipale,
          ].map(Number),
          backgroundColor: ["blue"],
        },
        {
          data: [budgetEtFinance.totalRecettesH, budgetEtFinance.recettesTitreIH, budgetEtFinance.recettesTitreIIH, budgetEtFinance.recettesTitreIIIH, 0].map(
            Number
          ),
          backgroundColor: ["orange"],
        },
      ],
    };
  }
}

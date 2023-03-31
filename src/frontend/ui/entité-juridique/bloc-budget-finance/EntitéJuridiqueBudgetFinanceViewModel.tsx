import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { HistogrammeData } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { StringFormater } from "../../commun/StringFormater";
import { ResultatNetComptableViewModel } from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptableViewModel";

export class EntitéJuridiqueBudgetFinanceViewModel {
  private budgetEtFinance: EntitéJuridiqueBudgetFinance[];
  public resultatNetComptable: ResultatNetComptableViewModel;
  private wording: Wording;
  public NOMBRE_ANNEES = 5;

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], wording: Wording) {
    this.wording = wording;
    this.budgetEtFinance = budgetFinance;
    this.resultatNetComptable = new ResultatNetComptableViewModel(budgetFinance);
  }

  public get annéeInitiale() {
    return this.budgetEtFinance[this.budgetEtFinance.length - 1]?.année;
  }

  budgetEtFinanceEnCours(annéeEnCours: number): EntitéJuridiqueBudgetFinance {
    return this.budgetEtFinance.find((budgetEtFinance) => budgetEtFinance.année === annéeEnCours) as EntitéJuridiqueBudgetFinance;
  }

  public get lesDonnéesBudgetEtFinanceNeSontPasRenseignées() {
    return (
      !this.budgetEtFinance || this.budgetEtFinance.length === 0 || (this.compteDeResultatVide() && !this.resultatNetComptable.auMoinsUnResultatNetRenseigné())
    );
  }

  public lesAnnéesManquantesDuCompteDeRésultat(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat(), this.NOMBRE_ANNEES);
  }

  public lesAnnéesEffectivesDuCompteDeRésultat(): number[] {
    return this.budgetEtFinance.filter((budgetEtFinance) => !this.compteResultatVide(budgetEtFinance)).map((budgetFinance) => budgetFinance.année);
  }

  private compteDeResultatVide() {
    return this.budgetEtFinance.every(this.compteResultatVide);
  }

  private compteResultatVide(budgetFinance: EntitéJuridiqueBudgetFinance): boolean {
    return (
      !budgetFinance.depensesTitreIPrincipales &&
      !budgetFinance.depensesTitreIIPrincipales &&
      !budgetFinance.depensesTitreIIIPrincipales &&
      !budgetFinance.depensesTitreIVPrincipales &&
      !budgetFinance.recettesTitreIPrincipales &&
      !budgetFinance.recettesTitreIIPrincipales &&
      !budgetFinance.recettesTitreIIIPrincipales &&
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

  public get dateMiseÀJour(): string {
    return StringFormater.formateLaDate(this.budgetEtFinance[0]?.dateMiseÀJourSource as string);
  }

  public dataGraphiqueCharges(budget: EntitéJuridiqueBudgetFinance): HistogrammeData {
    const depensesGlobales = [
      budget.totalDepensesGlobal,
      budget?.depensesTitreIGlobal,
      budget?.depensesTitreIIGlobal,
      budget?.depensesTitreIIIGlobal,
      budget?.depensesTitreIVGlobal,
    ]
      .map(Number)
      .map(Math.round);
    const depensesPrincipales = [
      budget.totalDepensesPrincipales,
      budget?.depensesTitreIPrincipales,
      budget?.depensesTitreIIPrincipales,
      budget?.depensesTitreIIIPrincipales,
      budget?.depensesTitreIVPrincipales,
    ]
      .map(Number)
      .map(Math.round);
    const depensesAnnexes = [
      budget.totalDepensesAnnexe,
      budget?.depensesTitreIAnnexe,
      budget?.depensesTitreIIAnnexe,
      budget?.depensesTitreIIIAnnexe,
      budget?.depensesTitreIVAnnexe,
    ]
      .map(Number)
      .map(Math.round);
    return new HistogrammeData(
      [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      depensesGlobales,
      [
        {
          backgroundColor: this.getBackgroundColorBudgetPrincipal(),
          data: depensesPrincipales,
          isError: depensesPrincipales.map((depense) => depense > 0),
          label: this.wording.CHARGES_PRINCIPALES,
        },
        {
          label: this.wording.CHARGES_ANNEXES,
          data: depensesAnnexes,
          backgroundColor: this.getBackgroundColorBudgetSecondaire(),
          isError: depensesAnnexes.map((depense) => depense > 0),
        },
      ],
      this.wording.CHARGES
    );
  }

  public dataGraphiqueProduits(budget: EntitéJuridiqueBudgetFinance): HistogrammeData {
    const produitsPrincipaux = [
      budget.totalRecettesPrincipales,
      budget?.recettesTitreIPrincipales,
      budget?.recettesTitreIIPrincipales,
      budget?.recettesTitreIIIPrincipales,
      0,
    ]
      .map(Number)
      .map(Math.round);
    const produitsGlobaux = [
      budget.totalRecettesGlobal,
      budget?.recettesTitreIGlobal,
      budget?.recettesTitreIIGlobal,
      budget?.recettesTitreIIIGlobal,
      budget?.recettesTitreIVGlobal,
    ]
      .map(Number)
      .map(Math.round);
    const produitsAnnexes = [
      budget.totalRecettesAnnexe,
      budget?.recettesTitreIAnnexe,
      budget?.recettesTitreIIAnnexe,
      budget?.recettesTitreIIIAnnexe,
      budget?.recettesTitreIVAnnexe,
    ]
      .map(Number)
      .map(Math.round);
    return new HistogrammeData(
      [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV],
      produitsGlobaux,
      [
        {
          label: this.wording.PRODUITS_PRINCIPAUX,
          data: produitsPrincipaux,
          backgroundColor: this.getBackgroundColorBudgetPrincipal(),
          isError: produitsPrincipaux.map((depense) => depense < 0),
        },
        {
          label: this.wording.PRODUITS_ANNEXES,
          data: produitsAnnexes,
          backgroundColor: this.getBackgroundColorBudgetSecondaire(),
          isError: produitsAnnexes.map((depense) => depense < 0),
        },
      ],
      this.wording.PRODUITS
    );
  }

  private getBackgroundColorBudgetSecondaire() {
    return ["#FA794A", "#FB9175", "#FB9175", "#FB9175", "#FB9175"];
  }

  private getBackgroundColorBudgetPrincipal() {
    return ["#2F4077", "#4E68BB", "#4E68BB", "#4E68BB", "#4E68BB"];
  }

  get légendeChart(): string[] {
    return [this.wording.BUDGET_PRINCIPAL, this.wording.BUDGET_ANNEXE];
  }
}

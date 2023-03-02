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

  public dataGraphiqueCharges(budgetEtFinance: EntitéJuridiqueBudgetFinance): HistogrammeLine[] {
    return [
      {
        libellé: this.wording.TOTAL,
        total: Number(budgetEtFinance.totalDepensesGlobal),
        stacks: [Number(budgetEtFinance.totalDepensesPrincipale), Number(budgetEtFinance.totalDepensesH)],
      },
      {
        libellé: this.wording.TITRE_I,
        total: Number(budgetEtFinance.depensesTitreIGlobal),
        stacks: [Number(budgetEtFinance.depensesTitreIPrincipale), Number(budgetEtFinance.depensesTitreIH)],
      },
      {
        libellé: this.wording.TITRE_II,
        total: Number(budgetEtFinance.depensesTitreIIGlobal),
        stacks: [Number(budgetEtFinance.depensesTitreIIPrincipale), Number(budgetEtFinance.depensesTitreIIH)],
      },
      {
        libellé: this.wording.TITRE_III,
        total: Number(budgetEtFinance.depensesTitreIIIGlobal),
        stacks: [Number(budgetEtFinance.depensesTitreIIIPrincipale), Number(budgetEtFinance.depensesTitreIIIH)],
      },
      {
        libellé: this.wording.TITRE_IV,
        total: Number(budgetEtFinance.depensesTitreIVGlobal),
        stacks: [Number(budgetEtFinance.depensesTitreIVPrincipale), Number(budgetEtFinance.depensesTitreIVH)],
      },
    ];
  }

  public dataGraphiqueProduits(budgetEtFinance: EntitéJuridiqueBudgetFinance): HistogrammeLine[] {
    return [
      {
        libellé: this.wording.TOTAL,
        total: Number(budgetEtFinance.totalRecettesGlobal),
        stacks: [Number(budgetEtFinance.totalRecettesPrincipale), Number(budgetEtFinance.totalRecettesH)],
      },
      {
        libellé: this.wording.TITRE_I,
        total: Number(budgetEtFinance.recettesTitreIGlobal),
        stacks: [Number(budgetEtFinance.recettesTitreIPrincipale), Number(budgetEtFinance.recettesTitreIH)],
      },
      {
        libellé: this.wording.TITRE_II,
        total: Number(budgetEtFinance.recettesTitreIIGlobal),
        stacks: [Number(budgetEtFinance.recettesTitreIIPrincipale), Number(budgetEtFinance.recettesTitreIIH)],
      },
      {
        libellé: this.wording.TITRE_III,
        total: Number(budgetEtFinance.recettesTitreIIIGlobal),
        stacks: [Number(budgetEtFinance.recettesTitreIIIPrincipale), Number(budgetEtFinance.recettesTitreIIIH)],
      },
      {
        libellé: this.wording.TITRE_IV,
        total: Number(budgetEtFinance.recettesTitreIVGlobal),
        stacks: [Number(budgetEtFinance.recettesTitreIVPrincipale)],
      },
    ];
  }
}

import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { annéesManquantes } from "../../../utils/dateUtils";
import { StringFormater } from "../../commun/StringFormater";
import { valeursResultatNetCompatable } from "./ResultatNetComptable";

export class ResultatNetComptableViewModel {
  private budgetEtFinance: EntitéJuridiqueBudgetFinance[];
  // private wording: Wording;
  private NOMBRE_ANNEES = 5;
  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[]) {
    // this.wording = wording;
    this.budgetEtFinance = budgetFinance;
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formateLaDate(this.budgetEtFinance[0]?.dateMiseÀJourSource as string);
  }

  public lesAnnéesManquantesDuCompteDeRésultat(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat(), this.NOMBRE_ANNEES);
  }

  private lesAnnéesEffectivesDuCompteDeRésultat(): number[] {
    return this.budgetEtFinance.filter((budgetEtFinance) => !this.compteResultatVide(budgetEtFinance)).map((budgetFinance) => budgetFinance.année);
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

  private filterAndSortResultatNetComptableAsc(resultatNetComptable: valeursResultatNetCompatable[]): valeursResultatNetCompatable[] {
    const currentAnnee = new Date().getFullYear();
    return resultatNetComptable.filter((resultat) => resultat.année >= currentAnnee - this.NOMBRE_ANNEES).sort((a, b) => (a.année < b.année ? -1 : 1));
  }

  public resultatNetComptable(): { année: number; valeur: string }[] {
    return this.budgetEtFinance.reduce((résultatNetComptableParAnnée: valeursResultatNetCompatable[], budgetEtFinanceEJ) => {
      if (budgetEtFinanceEJ.resultatNetComptable) {
        résultatNetComptableParAnnée.push({
          année: budgetEtFinanceEJ.année,
          valeur: StringFormater.formateLeMontantEnEuros(budgetEtFinanceEJ.resultatNetComptable),
        });
      }
      return this.filterAndSortResultatNetComptableAsc(résultatNetComptableParAnnée);
    }, []);
  }
}

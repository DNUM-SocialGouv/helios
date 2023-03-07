import { CadreBudgétaire } from "../../../../../../database/models/BudgetEtFinancesMédicoSocialModel";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { Wording } from "../../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../../utils/dateUtils";
import { HistogrammeLine } from "../../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { StringFormater } from "../../../commun/StringFormater";

export class CompteDeResultatViewModel {
  private readonly nombreDAnnéesParIndicateur = 3;
  private wording: Wording;

  constructor(private readonly budgetEtFinancesMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances[], wording: Wording) {
    this.wording = wording;
  }

  public intituléDuCompteDeRésultat(annéeEnCours: number) {
    return this.budgetEtFinanceEnCours(annéeEnCours).cadreBudgétaire === CadreBudgétaire.ERRD
      ? this.wording.COMPTE_DE_RÉSULTAT_ERRD
      : this.wording.COMPTE_DE_RÉSULTAT_CA;
  }

  budgetEtFinanceEnCours(annéeEnCours: number): ÉtablissementTerritorialMédicoSocialBudgetEtFinances {
    return this.budgetEtFinancesMédicoSocial.find(
      (budgetEtFinance) => budgetEtFinance.année === annéeEnCours
    ) as ÉtablissementTerritorialMédicoSocialBudgetEtFinances;
  }

  annéesRangéesParAntéChronologie(): number[] {
    return this.budgetEtFinancesMédicoSocial
      .filter(filtreParCadreBudgétaireEtRecettesEtDépenses)
      .map((budgetEtFinance) => budgetEtFinance.année)
      .reverse();

    function filtreParCadreBudgétaireEtRecettesEtDépenses(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances): boolean {
      if (
        budgetEtFinance.cadreBudgétaire !== CadreBudgétaire.CA_PA &&
        (budgetEtFinance.recettesEtDépenses.dépensesGroupe1 !== null ||
          budgetEtFinance.recettesEtDépenses.dépensesGroupe2 !== null ||
          budgetEtFinance.recettesEtDépenses.dépensesGroupe3 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe1 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe2 !== null ||
          budgetEtFinance.recettesEtDépenses.recettesGroupe3 !== null)
      ) {
        return true;
      } else if (
        budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA &&
        (budgetEtFinance.chargesEtProduits.charges !== null || budgetEtFinance.chargesEtProduits.produits !== null)
      ) {
        return true;
      }
      return false;
    }
  }

  public dépensesOuCharges(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) {
    const dépensesOuCharges = [];
    if (budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA) {
      const totalDesCharges = budgetEtFinance.chargesEtProduits.charges as number;
      dépensesOuCharges.push(totalDesCharges);
    } else {
      const dépensesGroupeI = budgetEtFinance.recettesEtDépenses.dépensesGroupe1 as number;
      const dépensesGroupeII = budgetEtFinance.recettesEtDépenses.dépensesGroupe2 as number;
      const dépensesGroupeIII = budgetEtFinance.recettesEtDépenses.dépensesGroupe3 as number;
      const totalDesDépenses = dépensesGroupeI + dépensesGroupeII + dépensesGroupeIII;
      dépensesOuCharges.push(totalDesDépenses, dépensesGroupeI, dépensesGroupeII, dépensesGroupeIII);
    }

    const defaultLineColor = ["#000091", "#4E68BB", "#4E68BB", "#4E68BB", "#4E68BB"];
    const lineColors = dépensesOuCharges.map((dépenses, index) => {
      return dépenses <= 0 ? defaultLineColor[index] : "#C9191E";
    });

    return {
      labels: this.libellés(budgetEtFinance),
      totals: dépensesOuCharges,
      stacks: [{ data: dépensesOuCharges, backgroundColor: lineColors, label: this.entêtesDesAutresColonnes(budgetEtFinance)[0] }],
    };
  }

  public recettesOuProduits(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances): HistogrammeLine {
    const recettesOuProduits = [];
    if (budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA) {
      const totalDesProduits = budgetEtFinance.chargesEtProduits.produits as number;
      recettesOuProduits.push(totalDesProduits);
    } else {
      const recettesGroupeI = budgetEtFinance.recettesEtDépenses.recettesGroupe1 as number;
      const recettesGroupeII = budgetEtFinance.recettesEtDépenses.recettesGroupe2 as number;
      const recettesGroupeIII = budgetEtFinance.recettesEtDépenses.recettesGroupe3 as number;
      const totalDesRecettes = recettesGroupeI + recettesGroupeII + recettesGroupeIII;
      recettesOuProduits.push(totalDesRecettes, recettesGroupeI, recettesGroupeII, recettesGroupeIII);
    }

    const defaultLineColor = ["#000091", "#4E68BB", "#4E68BB", "#4E68BB", "#4E68BB"];
    const lineColors = recettesOuProduits.map((recette, index) => {
      return recette >= 0 ? defaultLineColor[index] : "#C9191E";
    });

    return {
      labels: this.libellés(budgetEtFinance),
      totals: recettesOuProduits,
      stacks: [{ data: recettesOuProduits, backgroundColor: lineColors, label: this.entêtesDesAutresColonnes(budgetEtFinance)[1] }],
    };
  }

  public libellés(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) {
    return budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA
      ? [this.wording.TOTAL]
      : [this.wording.TOTAL, this.wording.GROUPE_I, this.wording.GROUPE_II, this.wording.GROUPE_III];
  }

  public ratioHistogramme(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) {
    const RATIO_CA_PA = 5;
    const DEFAULT_RATIO = 2;
    return budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA ? RATIO_CA_PA : DEFAULT_RATIO;
  }

  public entêtesDesAutresColonnes(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) {
    return budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA
      ? [this.wording.CHARGES, this.wording.PRODUITS]
      : [this.wording.DÉPENSES, this.wording.RECETTES];
  }

  public get leCompteDeRésultatEstIlRenseigné(): boolean {
    return this.lesAnnéesManquantesDuCompteDeRésultat().length < this.nombreDAnnéesParIndicateur;
  }

  public lesAnnéesManquantesDuCompteDeRésultat(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat());
  }

  private lesAnnéesEffectivesDuCompteDeRésultat(): number[] {
    const années: number[] = [];

    this.budgetEtFinancesMédicoSocial.forEach((budgetEtFinance) => {
      if (budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA) {
        if (budgetEtFinance.chargesEtProduits.charges !== null && budgetEtFinance.chargesEtProduits.produits !== null) {
          années.push(budgetEtFinance.année);
        }
      } else {
        if (
          budgetEtFinance.recettesEtDépenses.dépensesGroupe1 !== null &&
          budgetEtFinance.recettesEtDépenses.dépensesGroupe2 !== null &&
          budgetEtFinance.recettesEtDépenses.dépensesGroupe3 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe1 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe2 !== null &&
          budgetEtFinance.recettesEtDépenses.recettesGroupe3 !== null
        ) {
          années.push(budgetEtFinance.année);
        }
      }
    });

    return années;
  }

  public get annéeInitiale() {
    return this.budgetEtFinancesMédicoSocial[this.budgetEtFinancesMédicoSocial.length - 1]?.année;
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formateLaDate(this.budgetEtFinancesMédicoSocial[0].tauxDeVétustéConstruction?.dateMiseÀJourSource as string);
  }
}

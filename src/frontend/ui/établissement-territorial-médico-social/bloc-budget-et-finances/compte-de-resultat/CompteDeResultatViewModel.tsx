import { CadreBudgétaire } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { Wording } from "../../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../../utils/dateUtils";
import { HistogrammeData } from "../../../commun/Graphique/DeuxHistogrammesHorizontaux";
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

  anneesAvecCompteDeResultat(): number[] {
    return this.budgetEtFinancesMédicoSocial.filter(filtreParCadreBudgétaireEtRecettesEtDépenses).map((budgetEtFinance) => budgetEtFinance.année);

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

    return new HistogrammeData(
      this.libellés(budgetEtFinance),
      dépensesOuCharges,
      [
        {
          data: dépensesOuCharges,
          backgroundColor: this.getLineColors(),
          label: this.entêtesDesAutresColonnes(budgetEtFinance)[0],
          isError: dépensesOuCharges.map((depenses) => depenses > 0),
        },
      ],
      this.entêtesDesAutresColonnes(budgetEtFinance)[0],
      this.ratioHistogramme(budgetEtFinance)
    );
  }

  private getLineColors() {
    return ["#000091", "#4E68BB", "#4E68BB", "#4E68BB", "#4E68BB"];
  }

  public recettesOuProduits(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances): HistogrammeData {
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

    return new HistogrammeData(
      this.libellés(budgetEtFinance),
      recettesOuProduits,
      [
        {
          data: recettesOuProduits,
          backgroundColor: this.getLineColors(),
          label: this.entêtesDesAutresColonnes(budgetEtFinance)[1],
          isError: recettesOuProduits.map((recette) => recette < 0),
        },
      ],
      this.entêtesDesAutresColonnes(budgetEtFinance)[1],
      this.ratioHistogramme(budgetEtFinance)
    );
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

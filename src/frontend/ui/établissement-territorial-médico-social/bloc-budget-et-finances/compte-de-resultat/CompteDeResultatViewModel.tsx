import { CadreBudgétaire } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { Wording } from "../../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../../utils/dateUtils";
import { couleurDuFondHistogrammePrimaire, couleurDuFondHistogrammeSecondaire } from "../../../commun/Graphique/couleursGraphique";
import { HistogrammeData } from "../../../commun/Graphique/HistogrammesHorizontaux";
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
      dépensesOuCharges.push(Math.abs(totalDesCharges));
    } else {
      const dépensesGroupeI = budgetEtFinance.recettesEtDépenses.dépensesGroupe1 as number;
      const dépensesGroupeII = budgetEtFinance.recettesEtDépenses.dépensesGroupe2 as number;
      const dépensesGroupeIII = budgetEtFinance.recettesEtDépenses.dépensesGroupe3 as number;
      const totalDesDépenses = dépensesGroupeI + dépensesGroupeII + dépensesGroupeIII;
      dépensesOuCharges.push(Math.abs(totalDesDépenses), Math.abs(dépensesGroupeI), Math.abs(dépensesGroupeII), Math.abs(dépensesGroupeIII));
    }

    return new HistogrammeData(
      this.entêtesDesAutresColonnes(budgetEtFinance)[0],
      this.libellés(budgetEtFinance),
      dépensesOuCharges,
      [
        {
          data: dépensesOuCharges,
          backgroundColor: this.getLineColors(),
          label: this.entêtesDesAutresColonnes(budgetEtFinance)[0],
          // isError: dépensesOuCharges.map((depenses) => depenses > 0),
        },
      ],
      StringFormater.formatInEuro
    );
  }

  private getLineColors() {
    return [
      couleurDuFondHistogrammePrimaire,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
      couleurDuFondHistogrammeSecondaire,
    ];
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
      this.entêtesDesAutresColonnes(budgetEtFinance)[1],
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
      StringFormater.formatInEuro
    );
  }

  public libellés(budgetEtFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances) {
    return budgetEtFinance.cadreBudgétaire === CadreBudgétaire.CA_PA
      ? [this.wording.TOTAL]
      : [this.wording.TOTAL, this.wording.GROUPE_I, this.wording.GROUPE_II, this.wording.GROUPE_III];
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
    const anneesTriees = this.lesAnnéesEffectivesDuCompteDeRésultat().sort((année1, année2) => année2 - année1);
    return anneesTriees[0];
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.budgetEtFinancesMédicoSocial[0].recettesEtDépenses?.dateMiseÀJourSource as string);
  }
}

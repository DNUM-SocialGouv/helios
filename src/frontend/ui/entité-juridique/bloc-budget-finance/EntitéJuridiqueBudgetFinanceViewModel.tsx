import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";

export class EntitéJuridiqueBudgetFinanceViewModel {
  private budgetEtFinance: EntitéJuridiqueBudgetFinance[];
  private wording: Wording;

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
    return annéesManquantes(this.lesAnnéesEffectivesDuCompteDeRésultat());
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

  public entêtesColonnes() {
    return [this.wording.CHARGES, this.wording.PRODUITS];
  }

  public libellés() {
    return [this.wording.TOTAL, this.wording.TITRE_I, this.wording.TITRE_II, this.wording.TITRE_III, this.wording.TITRE_IV];
  }

  public produitsPrincipaux(budgetEtFinance: EntitéJuridiqueBudgetFinance) {
    const produitsTitreIPrincipal = Number(budgetEtFinance.recettesTitreIGlobal) - Number(budgetEtFinance.recettesTitreIH);
    const produitsTitreIIPrincipal = Number(budgetEtFinance.recettesTitreIIGlobal) - Number(budgetEtFinance.recettesTitreIIH);
    const produitsTitreIIIPrincipal = Number(budgetEtFinance.recettesTitreIIIGlobal) - Number(budgetEtFinance.recettesTitreIIIH);
    const produitsTitreIVPrincipal = Number(budgetEtFinance.recettesTitreIVGlobal);

    const totalProduitsPrincipaux = produitsTitreIPrincipal + produitsTitreIIPrincipal + produitsTitreIIIPrincipal + produitsTitreIVPrincipal;

    return [totalProduitsPrincipaux, produitsTitreIPrincipal, produitsTitreIIPrincipal, produitsTitreIIIPrincipal, produitsTitreIVPrincipal];
  }

  public chargesPrincipales(budgetEtFinance: EntitéJuridiqueBudgetFinance) {
    const chargesTitreIPrincipal = Number(budgetEtFinance.depensesTitreIGlobal) - Number(budgetEtFinance.depensesTitreIH);
    const chargesTitreIIPrincipal = Number(budgetEtFinance.depensesTitreIIGlobal) - Number(budgetEtFinance.depensesTitreIIH);
    const chargesTitreIIIPrincipal = Number(budgetEtFinance.depensesTitreIIIGlobal) - Number(budgetEtFinance.depensesTitreIIIH);
    const chargesTitreIVPrincipal = Number(budgetEtFinance.depensesTitreIVGlobal) - Number(budgetEtFinance.depensesTitreIVH);

    const totalChargesPrincipales = chargesTitreIPrincipal + chargesTitreIIPrincipal + chargesTitreIIIPrincipal + chargesTitreIVPrincipal;

    return [totalChargesPrincipales, chargesTitreIPrincipal, chargesTitreIIPrincipal, chargesTitreIIIPrincipal, chargesTitreIVPrincipal];
  }
}

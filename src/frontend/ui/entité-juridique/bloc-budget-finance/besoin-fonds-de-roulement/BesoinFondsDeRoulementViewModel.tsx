import { EntitéJuridiqueBudgetFinance } from "../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import {
  couleurDuFond,
  couleurDuFondHistogrammeSecondaire,
  couleurErreur,
  CouleurHistogramme,
  couleurIdentifiant,
  TaillePoliceTick,
} from "../../../commun/Graphique/couleursGraphique";
import StringFormater from "../../../commun/StringFormater";

type BesoinFondsDeRoulement = { valeur: number | null; année: number; dateDeMiseÀJour: string };

export class BesoinFondsDeRoulementViewModel {
  readonly NOMBRE_ANNEES = 5;
  private besoinFondsDeRoulement: BesoinFondsDeRoulement[];
  private autorisations: any;

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], autorisations: any) {
    this.besoinFondsDeRoulement = budgetFinance
      .filter((budget) => budget.besoinFondsDeRoulement !== null && budget.besoinFondsDeRoulement !== undefined && budget.besoinFondsDeRoulement !== 0)
      .map((budget) => ({
        année: budget.année,
        valeur: budget.besoinFondsDeRoulement,
        dateDeMiseÀJour: budget.dateMiseÀJourSource,
      }));
    this.autorisations = autorisations;
  }

  public get années(): number[] {
    return this.besoinFondsDeRoulement.map((bfdr) => bfdr.année);
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.besoinFondsDeRoulement[0]?.dateDeMiseÀJour);
  }

  public auMoinsUnBesoinFondsDeRoulementRenseigné(): boolean {
    return this.besoinFondsDeRoulement.some(this.valeurRemplie);
  }

  public get besoinFondsDeRoulementEstIlAutorisé(): boolean {
    return this.autorisations.budgetEtFinance?.besoinFondsDeRoulement === 'ok';
  }

  private valeurRemplie(bfdr: BesoinFondsDeRoulement): boolean {
    return bfdr.valeur !== null;
  }

  public get valeurs(): number[] {
    return this.besoinFondsDeRoulement.map((bfdr) => bfdr.valeur as number);
  }

  public construisLesLibellésDesTicks(): TaillePoliceTick[] {
    return this.besoinFondsDeRoulement.map(() => "normal");
  }

  public construisLesCouleursDesLibelles(): string[] {
    return this.besoinFondsDeRoulement.map(() => couleurIdentifiant);
  }

  get couleursDeLHistogramme(): CouleurHistogramme[] {
    return this.besoinFondsDeRoulement.map((bfdr) => ({
      premierPlan: this.valeurEstEnErreur(bfdr) ? couleurErreur : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond,
    }));
  }

  private valeurEstEnErreur(bfdr: BesoinFondsDeRoulement): boolean {
    return bfdr.valeur === null;
  }
}

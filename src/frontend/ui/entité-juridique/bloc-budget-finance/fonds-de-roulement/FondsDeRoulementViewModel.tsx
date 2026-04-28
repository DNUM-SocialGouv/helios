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

type FondsDeRoulement = { valeur: number | null | ''; année: number; dateDeMiseÀJour: string };

export class FondsDeRoulementViewModel {
  readonly NOMBRE_ANNEES = 5;
  private fondsDeRoulement: FondsDeRoulement[];
  private autorisations: any;

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], autorisations: any) {
    this.fondsDeRoulement = budgetFinance
      .filter((budget) => budget.fondsDeRoulement !== null && budget.fondsDeRoulement !== undefined && budget.fondsDeRoulement !== 0)
      .map((budget) => ({
        année: budget.année,
        valeur: budget.fondsDeRoulement,
        dateDeMiseÀJour: budget.dateMiseÀJourSource,
      }));
    this.autorisations = autorisations;
  }

  public get années(): number[] {
    return this.fondsDeRoulement.map((fdr) => fdr.année);
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.fondsDeRoulement[0]?.dateDeMiseÀJour);
  }

  public auMoinsUnFondsDeRoulementRenseigné(): boolean {
    return this.fondsDeRoulement.some(this.valeurRemplie);
  }

  public get fondsDeRoulementEstIlAutorisé(): boolean {
    return this.autorisations.budgetEtFinance?.fondsDeRoulement === 'ok';
  }

  private valeurRemplie(fdr: FondsDeRoulement): boolean {
    return fdr.valeur !== null && fdr.valeur !== '';
  }

  public get valeurs(): number[] {
    return this.fondsDeRoulement.map((fdr) => fdr.valeur as number);
  }

  public construisLesLibellésDesTicks(): TaillePoliceTick[] {
    return this.fondsDeRoulement.map(() => "normal");
  }

  public construisLesCouleursDesLibelles(): string[] {
    return this.fondsDeRoulement.map(() => couleurIdentifiant);
  }

  get couleursDeLHistogramme(): CouleurHistogramme[] {
    return this.fondsDeRoulement.map((fdr) => ({
      premierPlan: this.valeurEstEnErreur(fdr) ? couleurErreur : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond,
    }));
  }

  private valeurEstEnErreur(fdr: FondsDeRoulement): boolean {
    return fdr.valeur === null || fdr.valeur === '';
  }
}

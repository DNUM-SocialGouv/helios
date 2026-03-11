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

type Tresorerie = { valeur: number | null; année: number; dateDeMiseÀJour: string };

export class TresorerieViewModel {
  readonly NOMBRE_ANNEES = 5;
  private tresorerie: Tresorerie[];
  private autorisations: any;

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[], autorisations: any) {
    this.tresorerie = budgetFinance
      .filter((budget) => budget.tresorerie !== null && budget.tresorerie !== undefined)
      .map((budget) => ({
        année: budget.année,
        valeur: budget.tresorerie,
        dateDeMiseÀJour: budget.dateMiseÀJourSource,
      }));
    this.autorisations = autorisations;
  }

  public get années(): number[] {
    return this.tresorerie.map((t) => t.année);
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.tresorerie[0]?.dateDeMiseÀJour);
  }

  public auMoinsUneTresorerieRenseignée(): boolean {
    return this.tresorerie.some(this.valeurRemplie);
  }

  public get tresorerieEstIlAutorisé(): boolean {
    return this.autorisations.budgetEtFinance?.tresorerie === 'ok';
  }

  private valeurRemplie(t: Tresorerie): boolean {
    return t.valeur !== null;
  }

  public get valeurs(): number[] {
    return this.tresorerie.map((t) => t.valeur as number);
  }

  public construisLesLibellésDesTicks(): TaillePoliceTick[] {
    return this.tresorerie.map(() => "normal");
  }

  public construisLesCouleursDesLibelles(): string[] {
    return this.tresorerie.map(() => couleurIdentifiant);
  }

  get couleursDeLHistogramme(): CouleurHistogramme[] {
    return this.tresorerie.map((t) => ({
      premierPlan: this.valeurEstEnErreur(t) ? couleurErreur : couleurDuFondHistogrammeSecondaire,
      secondPlan: couleurDuFond,
    }));
  }

  private valeurEstEnErreur(t: Tresorerie): boolean {
    return t.valeur === null;
  }
}

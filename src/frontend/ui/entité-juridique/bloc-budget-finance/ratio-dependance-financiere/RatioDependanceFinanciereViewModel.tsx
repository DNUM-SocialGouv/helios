import { EntitéJuridiqueBudgetFinance } from "../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { LibelléDeDonnéeGraphe, LibelléDeTickGraphe } from "../../../commun/Graphique/GraphiqueViewModel";
import { CouleurHistogramme } from "../../../commun/Graphique/HistogrammeVertical";
import { StringFormater } from "../../../commun/StringFormater";

type RatioDependanceFinanciere = { ratio: number | null; année: number; dateDeMiseÀJour: string };

export class RatioDependanceFinanciereViewModel {
  readonly NOMBRE_ANNEES = 5;
  private ratioDependanceFinanciere: RatioDependanceFinanciere[];

  constructor(budgetFinance: EntitéJuridiqueBudgetFinance[]) {
    this.ratioDependanceFinanciere = budgetFinance.map((budget) => ({
      année: budget.année,
      ratio: budget.ratioDependanceFinanciere,
      dateDeMiseÀJour: budget.dateMiseÀJourSource,
    }));
  }

  public get années(): number[] {
    return this.ratioDependanceFinanciere.map((ratio) => ratio.année);
  }

  public get dateMiseÀJour(): string {
    return StringFormater.formatDate(this.ratioDependanceFinanciere[0]?.dateDeMiseÀJour);
  }

  public auMoinsUnRatioRenseigné() {
    return this.ratioDependanceFinanciere.length > 0 && this.ratioDependanceFinanciere.every(this.ratioRemplis);
  }

  private ratioRemplis(ratio: RatioDependanceFinanciere): boolean {
    return !!ratio.ratio;
  }

  public get valeurs(): number[] {
    return this.ratioDependanceFinanciere.map((ratio) => StringFormater.transformInRate(ratio.ratio as number));
  }

  public construisLesLibellésDesTicks(): LibelléDeTickGraphe[] {
    return this.ratioDependanceFinanciere.map(() => ({ tailleDePolice: "normal" }));
  }

  public construisLesLibellésDesValeurs(): LibelléDeDonnéeGraphe[] {
    const couleurDuFond = "#E8EDFF";
    const SEUIL_DE_CONTRASTE_DES_LIBELLÉS_DES_TAUX = 0.2;
    return this.ratioDependanceFinanciere.map((ratio) => ({
      couleur: (ratio.ratio as number) > SEUIL_DE_CONTRASTE_DES_LIBELLÉS_DES_TAUX ? couleurDuFond : "#000",
    }));
  }

  get couleursDeLHistogramme(): CouleurHistogramme[] {
    const couleurDuFondHistogrammeSecondaire = "#4E68BB";
    return this.ratioDependanceFinanciere.map((ratio) => {
      return {
        premierPlan: this.ratioEstEnErreur(ratio) ? "#C9191E" : couleurDuFondHistogrammeSecondaire,
        secondPlan: "#E8EDFF",
      };
    });
  }

  private ratioEstEnErreur(ratioDependanceFinanciere: RatioDependanceFinanciere): boolean {
    const ratio = ratioDependanceFinanciere.ratio;
    const RATIO_MAXIMUM = 0.5;
    const RATION_MINIMUM = 0;
    return ratio === null || ratio > RATIO_MAXIMUM || ratio < RATION_MINIMUM;
  }
}

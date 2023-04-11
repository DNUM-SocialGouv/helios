import { EntitéJuridiqueBudgetFinance } from "../../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { annéesManquantes } from "../../../../utils/dateUtils";
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

  private lesAnnéesEffectivesDuRatioDeDépendanceFinanciere(): number[] {
    return this.ratioDependanceFinanciere.filter(this.ratioRemplis).map((budget) => budget.année);
  }

  public lesAnnéesManquantesDuRatio(): number[] {
    return annéesManquantes(this.lesAnnéesEffectivesDuRatioDeDépendanceFinanciere(), this.NOMBRE_ANNEES);
  }

  public valeursRatio(): { année: number; valeur: string }[] {
    return this.ratioDependanceFinanciere
      .filter(this.ratioRemplis)
      .filter((ratio) => this.estDansLesAnneesVisible(ratio))
      .sort(this.trierParAnnée)
      .map(this.formatRatioDependanceFinanciere);
  }

  public get valeurs(): number[] {
    return this.ratioDependanceFinanciere.map((ratio) => StringFormater.transformInRate(ratio.ratio as number));
  }

  private estDansLesAnneesVisible(ratio: RatioDependanceFinanciere): boolean {
    const currentAnnee = new Date().getFullYear();
    return ratio.année >= currentAnnee - this.NOMBRE_ANNEES;
  }

  private trierParAnnée(ratio1: RatioDependanceFinanciere, ratio2: RatioDependanceFinanciere) {
    return ratio1.année < ratio2.année ? -1 : 1;
  }

  private formatRatioDependanceFinanciere(ratio: RatioDependanceFinanciere) {
    return {
      année: ratio.année,
      valeur: StringFormater.addPercent(StringFormater.transformInRate(ratio.ratio as number).toString()),
    };
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
    return this.ratioDependanceFinanciere.map(() => {
      return {
        premierPlan: couleurDuFondHistogrammeSecondaire,
        secondPlan: "#E8EDFF",
      };
    });
  }
}

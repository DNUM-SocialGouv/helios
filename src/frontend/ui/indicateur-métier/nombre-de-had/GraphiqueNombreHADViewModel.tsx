import { annéesManquantes } from "../../../utils/dateUtils";
import { StringFormater } from "../../commun/StringFormater";
import { IndicateurActivité } from "../IndicateurActivité";
import { couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";

export class GraphiqueNombreHADViewModel {
  public NOMBRE_ANNEES = 5;
  public valeurs: number[];
  private readonly années: number[];

  constructor(private readonly indicateurActivité: IndicateurActivité[]) {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs();
    this.valeurs = valeurs;
    this.années = années;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formatDate(this.indicateurActivité[0]?.dateMiseÀJourSource);
  }

  private construisLesAnnéesEtSesValeurs(): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.indicateurActivité.forEach((indicateur: IndicateurActivité) => {
      if (indicateur.value !== null) {
        années.push(indicateur.année);
      }

      if (indicateur.value !== null) {
        valeurs.push(indicateur.value);
      }
    });

    return [valeurs, années];
  }

  get couleursDeLHistogramme() {
    return this.valeurs.map(() => {
      return { premierPlan: couleurDuFondHistogrammeSecondaire };
    });
  }

  public annéesManquantes(): number[] {
    return annéesManquantes(this.années, this.NOMBRE_ANNEES);
  }

  get libellés(): string[] {
    return this.années.map((annee) => annee.toString());
  }
}

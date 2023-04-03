import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { HistogrammeData } from "../../commun/Graphique/HistogrammesHorizontaux";
import { StringFormater } from "../../commun/StringFormater";
import { IndicateurActivité } from "../IndicateurActivité";

export class GraphiqueNombreHADViewModel {
  public NOMBRE_ANNEES = 5;
  public valeurs: number[];
  private années: number[];

  constructor(private readonly indicateurActivité: IndicateurActivité[], private wording: Wording) {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs();
    this.valeurs = valeurs;
    this.années = années;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formateLaDate(this.indicateurActivité[0]?.dateMiseÀJourSource);
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

  public valeursHAD(): HistogrammeData {
    return new HistogrammeData(this.wording.NOMBRE_DE_HAD, this.libellés, this.valeurs, [
      {
        data: this.valeurs,
        barColor: ["#4E68BB"],
        isError: [false],
        label: this.wording.NOMBRE_DE_HAD,
      },
    ]);
  }

  public annéesManquantes(): number[] {
    return annéesManquantes(this.années, this.NOMBRE_ANNEES);
  }

  get libellés(): string[] {
    return this.années.map((annee) => annee.toString());
  }

  get totals() {
    return this.valeurs;
  }

  public get nombreDeHADSontIlsRenseignes(): boolean {
    return this.valeurs.some((had) => had !== null);
  }
}

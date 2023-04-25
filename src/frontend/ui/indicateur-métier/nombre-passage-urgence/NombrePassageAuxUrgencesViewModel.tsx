import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import { couleurDuFondHistogrammePrimaire, couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { StringFormater } from "../../commun/StringFormater";
import { IndicateurActivité } from "../IndicateurActivité";

export class NombrePassageAuxUrgencesViewModel {
  public valeurs: number[];
  private années: number[];
  public nombreDeLibelléTotal = 5;

  constructor(private readonly indicateurActivité: IndicateurActivité[], private wording: Wording) {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs();
    this.valeurs = valeurs;
    this.années = années;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formatDate(this.indicateurActivité[0]?.dateMiseÀJourSource);
  }

  get libellés(): string[] {
    return this.années.map((année) => année.toString());
  }

  get libellésDeValeursManquantes() {
    return annéesManquantes(this.années, 5);
  }

  get identifiant() {
    return this.wording.NOMBRE_DE_PASSAGES_AUX_URGENCES;
  }

  get couleursDeLHistogramme() {
    return this.années.map((année: number) => {
      return { premierPlan: estCeLAnnéePassée(année) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire };
    });
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
}

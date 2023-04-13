import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import { couleurDuFond, couleurDuFondHistogrammePrimaire, couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { CouleurHistogramme, GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";
import { IndicateurActivité } from "../IndicateurActivité";

export class NombrePassageAuxUrgencesViewModel extends GraphiqueViewModel {
  public valeurs: number[];
  private années: number[];
  public nombreDeLibelléTotal = 5;

  constructor(private readonly indicateurActivité: IndicateurActivité[], wording: Wording) {
    super(wording);
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
    const construisLaCouleurDeLaBarreHorizontale = (_valeur: number, année: number | string): CouleurHistogramme => {
      return estCeLAnnéePassée(année)
        ? {
            premierPlan: couleurDuFondHistogrammePrimaire,
            secondPlan: couleurDuFond,
          }
        : {
            premierPlan: couleurDuFondHistogrammeSecondaire,
            secondPlan: couleurDuFond,
          };
    };
    return this.construisLesCouleursDeLHistogramme(this.valeurs, this.années, construisLaCouleurDeLaBarreHorizontale);
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

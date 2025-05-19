import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import { couleurDuFondHistogrammePrimaire, couleurDuFondHistogrammeSecondaire } from "../../commun/Graphique/couleursGraphique";
import { StringFormater } from "../../commun/StringFormater";
import { IndicateurActivité } from "../IndicateurActivité";


export class NombreDeJourneesUsldViewModel {
  public valeurs: number[];
  private années: number[];
  public nombreDeLibelléTotal = 5;

  constructor(private readonly indicateursNombreJourneesUsld: IndicateurActivité[], private wording: Wording) {
    const [valeurs, années] = this.construisLesAnneesEtSesValeurs();
    this.valeurs = valeurs;
    this.années = années;
  }

  public get dateMiseAJour(): string {
    return StringFormater.formatDate(this.indicateursNombreJourneesUsld[0]?.dateMiseÀJourSource);
  }

  get libellés(): string[] {
    return this.années.map((année) => année.toString());
  }

  get libellesDeValeursManquantes() {
    return annéesManquantes(this.années, 5);
  }

  get identifiant() {
    return this.wording.NOMBRE_DE_JOURNEES_USLD;
  }

  get couleursDeLHistogramme() {
    return this.années.map((année: number) => {
      return { premierPlan: estCeLAnnéePassée(année) ? couleurDuFondHistogrammePrimaire : couleurDuFondHistogrammeSecondaire };
    });
  }

  private construisLesAnneesEtSesValeurs(): number[][] {
    const valeurs: number[] = [];
    const annees: number[] = [];
    this.indicateursNombreJourneesUsld.forEach((indicateur: IndicateurActivité) => {
      if (indicateur.value !== null) {
        annees.push(indicateur.année);
      }

      if (indicateur.value !== null && indicateur.value !== "") {
        valeurs.push(indicateur.value);
      }
    });

    return [valeurs, annees];
  }
}

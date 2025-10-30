import { ActiviteMoyenneMCO } from "./IndicateurDureeMoyenneDesSejoursMCO";
import { Wording } from "../../../configuration/wording/Wording";
import {
  couleurDuFondHistogrammeBleuFoncé,
  couleurDuFondHistogrammeRougeFoncé,
  couleurDuFondHistogrammeVertFoncé,
} from "../../commun/Graphique/couleursGraphique";
import { StringFormater } from "../../commun/StringFormater";

type IndicateurDureeMoyenneDesSejoursMCO = Readonly<{
  dureeMoyenneSejourMedecine: { x: number; y: number | null | '' }[];
  dureeMoyenneSejourChirurgie: { x: number; y: number | null | '' }[];
  dureeMoyenneSejourObstetrique: { x: number; y: number | null | '' }[];
}>;
export class DureeMoyenneSejourMCOViewModel {
  public NOMBRE_ANNEES = 5;
  readonly identifiantDeLaLégendeDureeSejoursMCO = "légende-graphique-sanitaire-durée-séjours-mco";

  private readonly dureeDeSejours: IndicateurDureeMoyenneDesSejoursMCO;
  readonly années: number[];
  constructor(private readonly activitesMoyenneMCO: ActiviteMoyenneMCO[], private readonly wording: Wording) {
    const [dureeDeSejours, années] = this.construisLesMoyenneSejoursMCOParAnnée();
    this.dureeDeSejours = dureeDeSejours;
    this.années = années;
  }

  public get moyenneSejoursMCOSontIlsRenseignés(): boolean {
    return this.activitesMoyenneMCO.some(this.activitesMoyenneMCORenseignees);
  }

  public get moyenneSejoursMCOSontIlsAutorisés(): boolean {
    return this.activitesMoyenneMCO.some(this.activitesMoyenneMCOAutorisees);
  }

  private activitesMoyenneMCORenseignees(activité: ActiviteMoyenneMCO): boolean {
    return (
      activité["dureeMoyenneSejourMedecine"].value !== null ||
      activité["dureeMoyenneSejourChirurgie"].value !== null ||
      activité["dureeMoyenneSejourObstetrique"].value !== null
    );
  }

  private activitesMoyenneMCOAutorisees(activité: ActiviteMoyenneMCO): boolean {
    return (
      activité["dureeMoyenneSejourMedecine"].dateMiseÀJourSource !== '' ||
      activité["dureeMoyenneSejourChirurgie"].dateMiseÀJourSource !== '' ||
      activité["dureeMoyenneSejourObstetrique"].dateMiseÀJourSource !== ''
    );
  }

  public get dateDeMiseÀJourDureeMoyenneSejoursMédecineChirurgieObstétrique(): string {
    return StringFormater.formatDate(this.activitesMoyenneMCO[0]?.dureeMoyenneSejourMedecine?.dateMiseÀJourSource);
  }

  private construisLesMoyenneSejoursMCOParAnnée(): [IndicateurDureeMoyenneDesSejoursMCO, number[]] {
    const nombreDeSéjours: IndicateurDureeMoyenneDesSejoursMCO = {
      dureeMoyenneSejourMedecine: [],
      dureeMoyenneSejourChirurgie: [],
      dureeMoyenneSejourObstetrique: [],
    };
    const années: number[] = [];

    this.activitesMoyenneMCO.filter(this.activitesMoyenneMCORenseignees).forEach((activité: ActiviteMoyenneMCO) => {
      années.push(activité.année);
      nombreDeSéjours.dureeMoyenneSejourMedecine.push({
        x: activité.année,
        y: activité.dureeMoyenneSejourMedecine.value,
      });
      nombreDeSéjours.dureeMoyenneSejourChirurgie.push({
        x: activité.année,
        y: activité.dureeMoyenneSejourChirurgie.value,
      });
      nombreDeSéjours.dureeMoyenneSejourObstetrique.push({
        x: activité.année,
        y: activité.dureeMoyenneSejourObstetrique.value,
      });
    });
    return [nombreDeSéjours, années];
  }

  getHistogrammeDataSet() {
    const [dureeMoyenneSejour, années] = this.construisLesMoyenneSejoursMCOParAnnée();
    return {
      datasets: [
        {
          backgroundColor: couleurDuFondHistogrammeBleuFoncé,
          borderColor: couleurDuFondHistogrammeBleuFoncé,
          data: dureeMoyenneSejour.dureeMoyenneSejourMedecine,
          label: this.wording.DUREE_MOYENNE_SEJOUR_MEDECINE,
          stack: "Stack 1",
        },
        {
          backgroundColor: couleurDuFondHistogrammeVertFoncé,
          borderColor: couleurDuFondHistogrammeVertFoncé,
          data: dureeMoyenneSejour.dureeMoyenneSejourChirurgie,
          label: this.wording.DUREE_MOYENNE_SEJOUR_CHIRURGIE,
          stack: "Stack 2",
        },
        {
          backgroundColor: couleurDuFondHistogrammeRougeFoncé,
          borderColor: couleurDuFondHistogrammeRougeFoncé,
          data: dureeMoyenneSejour.dureeMoyenneSejourObstetrique,
          label: this.wording.DUREE_MOYENNE_SEJOUR_OBSTETRIQUE,
          stack: "Stack 3",
        },
      ],
      labels: années,
    };
  }

  public getIdentifiantTableIndicateur() {
    return [
      this.wording.DUREE_MOYENNE_SEJOUR_MEDECINE,
      this.wording.DUREE_MOYENNE_SEJOUR_CHIRURGIE,
      this.wording.DUREE_MOYENNE_SEJOUR_OBSTETRIQUE,
    ];
  }

  public getValeurTableIndicateur() {
    return [
      this.valeursMoyenneDeSejour(this.dureeDeSejours.dureeMoyenneSejourMedecine),
      this.valeursMoyenneDeSejour(this.dureeDeSejours.dureeMoyenneSejourChirurgie),
      this.valeursMoyenneDeSejour(this.dureeDeSejours.dureeMoyenneSejourObstetrique),
    ];
  }

  private valeursMoyenneDeSejour(moyenneSejour: { x: number; y: number | null | '' }[]): (string | null)[] {
    return moyenneSejour.map((nombreSéjour) => {
      return nombreSéjour.y ? nombreSéjour.y.toLocaleString("fr") : null;
    });
  }

  public tooltipMoyenneSejoursMCO() {
    return function (context: any) {
      return `${context.dataset.label} : ${context.parsed.y.toLocaleString("fr")}`;
    };
  }
}

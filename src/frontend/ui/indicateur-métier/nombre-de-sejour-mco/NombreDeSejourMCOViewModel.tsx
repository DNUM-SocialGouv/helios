import { ActivitéMCO } from "./IndicateurDesSejoursMCO";
import { Wording } from "../../../configuration/wording/Wording";
import {
  couleurDuFondHistogrammeBleuClair,
  couleurDuFondHistogrammeBleuFoncé,
  couleurDuFondHistogrammeRougeClair,
  couleurDuFondHistogrammeRougeFoncé,
  couleurDuFondHistogrammeVertClair,
  couleurDuFondHistogrammeVertFoncé,
} from "../../commun/Graphique/couleursGraphique";
import { StringFormater } from "../../commun/StringFormater";

type IndicateurDesSejoursMCO = Readonly<{
  nombreSéjoursCompletsMédecine: { x: number; y: number | null | '' }[];
  nombreSéjoursCompletsChirurgie: { x: number; y: number | null | '' }[];
  nombreSéjoursCompletsObstétrique: { x: number; y: number | null | '' }[];
  nombreSéjoursPartielsMédecine: { x: number; y: number | null | '' }[];
  nombreSéjoursPartielsChirurgie: { x: number; y: number | null | '' }[];
  nombreSéjoursPartielsObstétrique: { x: number; y: number | null | '' }[];
}>;
export class NombreDeSejourMCOViewModel {
  public NOMBRE_ANNEES = 5;
  readonly identifiantDeLaLégendeDesSéjoursMCO = "légende-graphique-sanitaire-journées-séjours-mco";

  private nombreDeSéjours: IndicateurDesSejoursMCO;
  readonly années: number[];
  constructor(private readonly activitésMCO: ActivitéMCO[], private wording: Wording) {
    const [nombreDeSéjours, années] = this.construisLesSéjoursMCOParAnnée();
    this.nombreDeSéjours = nombreDeSéjours;
    this.années = années;
  }

  public get nombreDeSéjoursMCOSontIlsRenseignés(): boolean {
    return this.activitésMCO.some(this.activitesMCORenseignees);
  }

  public get nombreDeSéjoursMCOSontIlsAutorisés(): boolean {
    return this.activitésMCO.some(this.activitesMCOAutorisees);
  }

  private activitesMCORenseignees(activité: ActivitéMCO): boolean {
    return (
      activité["nombreSéjoursPartielsMédecine"].value !== null ||
      activité["nombreSéjoursCompletsMédecine"].value !== null ||
      activité["nombreSéjoursPartielsChirurgie"].value !== null ||
      activité["nombreSéjoursCompletsChirurgie"].value !== null ||
      activité["nombreSéjoursPartielsObstétrique"].value !== null ||
      activité["nombreSéjoursCompletsObstétrique"].value !== null
    );
  }

  private activitesMCOAutorisees(activité: ActivitéMCO): boolean {
    return (
      activité["nombreSéjoursPartielsMédecine"].dateMiseÀJourSource !== '' ||
      activité["nombreSéjoursCompletsMédecine"].dateMiseÀJourSource !== '' ||
      activité["nombreSéjoursPartielsChirurgie"].dateMiseÀJourSource !== '' ||
      activité["nombreSéjoursCompletsChirurgie"].dateMiseÀJourSource !== '' ||
      activité["nombreSéjoursPartielsObstétrique"].dateMiseÀJourSource !== '' ||
      activité["nombreSéjoursCompletsObstétrique"].dateMiseÀJourSource !== ''
    );
  }

  public get dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique(): string {
    return StringFormater.formatDate(this.activitésMCO[0]?.nombreSéjoursCompletsMédecine?.dateMiseÀJourSource);
  }

  private construisLesSéjoursMCOParAnnée(): [IndicateurDesSejoursMCO, number[]] {
    const nombreDeSéjours: IndicateurDesSejoursMCO = {
      nombreSéjoursCompletsChirurgie: [],
      nombreSéjoursCompletsMédecine: [],
      nombreSéjoursCompletsObstétrique: [],
      nombreSéjoursPartielsChirurgie: [],
      nombreSéjoursPartielsMédecine: [],
      nombreSéjoursPartielsObstétrique: [],
    };
    const années: number[] = [];

    this.activitésMCO.filter(this.activitesMCORenseignees).forEach((activité: ActivitéMCO) => {
      années.push(activité.année);
      nombreDeSéjours.nombreSéjoursCompletsChirurgie.push({
        x: activité.année,
        y: activité.nombreSéjoursCompletsChirurgie.value,
      });
      nombreDeSéjours.nombreSéjoursCompletsMédecine.push({
        x: activité.année,
        y: activité.nombreSéjoursCompletsMédecine.value,
      });
      nombreDeSéjours.nombreSéjoursCompletsObstétrique.push({
        x: activité.année,
        y: activité.nombreSéjoursCompletsObstétrique.value,
      });
      nombreDeSéjours.nombreSéjoursPartielsChirurgie.push({
        x: activité.année,
        y: activité.nombreSéjoursPartielsChirurgie.value,
      });
      nombreDeSéjours.nombreSéjoursPartielsMédecine.push({
        x: activité.année,
        y: activité.nombreSéjoursPartielsMédecine.value,
      });
      nombreDeSéjours.nombreSéjoursPartielsObstétrique.push({
        x: activité.année,
        y: activité.nombreSéjoursPartielsObstétrique.value,
      });
    });
    return [nombreDeSéjours, années];
  }

  getHistogrammeDataSet() {
    const [nombreDeSéjours, années] = this.construisLesSéjoursMCOParAnnée();
    return {
      datasets: [
        {
          backgroundColor: couleurDuFondHistogrammeBleuClair,
          borderColor: couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsMédecine,
          label: this.wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
          stack: "Stack 1",
        },
        {
          backgroundColor: couleurDuFondHistogrammeBleuFoncé,
          borderColor: couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsMédecine,
          label: this.wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
          stack: "Stack 1",
        },
        {
          backgroundColor: couleurDuFondHistogrammeVertClair,
          borderColor: couleurDuFondHistogrammeVertFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsChirurgie,
          label: this.wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
          stack: "Stack 2",
        },
        {
          backgroundColor: couleurDuFondHistogrammeVertFoncé,
          borderColor: couleurDuFondHistogrammeVertFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsChirurgie,
          label: this.wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
          stack: "Stack 2",
        },
        {
          backgroundColor: couleurDuFondHistogrammeRougeClair,
          borderColor: couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsObstétrique,
          label: this.wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
          stack: "Stack 3",
        },
        {
          backgroundColor: couleurDuFondHistogrammeRougeFoncé,
          borderColor: couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsObstétrique,
          label: this.wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
          stack: "Stack 3",
        },
      ],
      labels: années,
    };
  }

  public getIdentifiantTableIndicateur() {
    return [
      this.wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
      this.wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
      this.wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
      this.wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
      this.wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
      this.wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
    ];
  }

  public getValeurTableIndicateur() {
    return [
      this.valeursDesNombresDeSéjours(this.nombreDeSéjours.nombreSéjoursPartielsMédecine),
      this.valeursDesNombresDeSéjours(this.nombreDeSéjours.nombreSéjoursCompletsMédecine),
      this.valeursDesNombresDeSéjours(this.nombreDeSéjours.nombreSéjoursPartielsChirurgie),
      this.valeursDesNombresDeSéjours(this.nombreDeSéjours.nombreSéjoursCompletsChirurgie),
      this.valeursDesNombresDeSéjours(this.nombreDeSéjours.nombreSéjoursPartielsObstétrique),
      this.valeursDesNombresDeSéjours(this.nombreDeSéjours.nombreSéjoursCompletsObstétrique),
    ];
  }

  private valeursDesNombresDeSéjours(nombresSéjours: { x: number; y: number | null | '' }[]): (string | null)[] {
    return nombresSéjours.map((nombreSéjour) => {
      return nombreSéjour.y ? nombreSéjour.y.toLocaleString("fr") : null;
    });
  }

  public tooltipSéjoursMCO(wording: Wording) {
    return function (context: any) {
      const label = `${context.dataset.label} : ${context.parsed.y.toLocaleString("fr")}`;

      if (context.datasetIndex <= 1) {
        const nombreSéjoursHospitalisationPartielleMédecine = context.parsed._stacks.y["0"];
        const nombreSéjoursHospitalisationComplèteMédecine = context.parsed._stacks.y["1"];
        return [
          label,
          `${wording.TOTAL_HOSPITALISATION_MÉDECINE} : ${(
            nombreSéjoursHospitalisationPartielleMédecine + nombreSéjoursHospitalisationComplèteMédecine
          ).toLocaleString("fr")}`,
        ];
      }
      if (context.datasetIndex === 2 || context.datasetIndex === 3) {
        const nombreSéjoursHospitalisationPartielleChirurgie = context.parsed._stacks.y["2"];
        const nombreSéjoursHospitalisationComplèteChirurgie = context.parsed._stacks.y["3"];
        return [
          label,
          `${wording.TOTAL_HOSPITALISATION_CHIRURGIE} : ${(
            nombreSéjoursHospitalisationPartielleChirurgie + nombreSéjoursHospitalisationComplèteChirurgie
          ).toLocaleString("fr")}`,
        ];
      }
      if (context.datasetIndex === 4 || context.datasetIndex === 5) {
        const nombreSéjoursHospitalisationPartielleObstétrique = context.parsed._stacks.y["4"];
        const nombreSéjoursHospitalisationComplèteObstétrique = context.parsed._stacks.y["5"];
        return [
          label,
          `${wording.TOTAL_HOSPITALISATION_OBSTÉTRIQUE} : ${(
            nombreSéjoursHospitalisationPartielleObstétrique + nombreSéjoursHospitalisationComplèteObstétrique
          ).toLocaleString("fr")}`,
        ];
      }
      return label;
    };
  }
}

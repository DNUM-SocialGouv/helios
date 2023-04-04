import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";

type DonnéesDeDiagrammeDesJournéesPsyEtSsr = Readonly<{
  nombreJournéesComplètesPsy: { x: number; y: number | null }[];
  nombreJournéesComplètesSsr: { x: number; y: number | null }[];
  nombreJournéesPartiellesPsy: { x: number; y: number | null }[];
  nombreJournéesPartiellesSsr: { x: number; y: number | null }[];
}>;

export type ActivitesPsySSR = Pick<
  ÉtablissementTerritorialSanitaireActivité,
  "année" | "nombreJournéesPartiellesPsy" | "nombreJournéesCompletesSsr" | "nombreJournéesCompletePsy" | "nombreJournéesPartielsSsr"
>;

export class NombreDeJourneesPsySSRViewModel extends GraphiqueViewModel {
  readonly couleurDuFondHistogrammeBleuClair = "#DEE5FD";
  readonly couleurDuFondHistogrammeBleuFoncé = "#2F4077";
  readonly couleurDuFondHistogrammeRougeClair = "#FEE9E6";
  readonly couleurDuFondHistogrammeRougeFoncé = "#A94645";
  readonly identifiantDeLaLégendeDesJournéesPsyEtSsr = "légende-graphique-sanitaire-journées-psy-et-ssr";
  private nombreDeJournées: DonnéesDeDiagrammeDesJournéesPsyEtSsr;
  années: number[];

  constructor(private activitésPsySSR: ActivitesPsySSR[], wording: Wording) {
    super(wording);
    const [nombreDeJournées, années] = this.construisLesJournéesPsyEtSsrParAnnée();
    this.nombreDeJournées = nombreDeJournées;
    this.années = années;
  }

  public get nombreDeJournéesPsyEtSsrSontIlsRenseignés(): boolean {
    return this.activitésPsySSR.some(
      (activité: ActivitesPsySSR) =>
        activité["nombreJournéesPartiellesPsy"].value !== null ||
        activité["nombreJournéesCompletesSsr"].value !== null ||
        activité["nombreJournéesPartielsSsr"].value !== null ||
        activité["nombreJournéesCompletePsy"].value !== null
    );
  }

  public get dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr(): string {
    return StringFormater.formateLaDate(this.activitésPsySSR[0]?.nombreJournéesCompletePsy?.dateMiseÀJourSource);
  }

  private construisLesJournéesPsyEtSsrParAnnée(): [DonnéesDeDiagrammeDesJournéesPsyEtSsr, number[]] {
    const nombreDeJournées: DonnéesDeDiagrammeDesJournéesPsyEtSsr = {
      nombreJournéesComplètesPsy: [],
      nombreJournéesComplètesSsr: [],
      nombreJournéesPartiellesPsy: [],
      nombreJournéesPartiellesSsr: [],
    };
    const années: number[] = [];

    this.activitésPsySSR.forEach((activité: ActivitesPsySSR) => {
      années.push(activité.année);
      nombreDeJournées.nombreJournéesComplètesPsy.push({
        x: activité.année,
        y: activité.nombreJournéesCompletePsy.value,
      });
      nombreDeJournées.nombreJournéesComplètesSsr.push({
        x: activité.année,
        y: activité.nombreJournéesCompletesSsr.value,
      });
      nombreDeJournées.nombreJournéesPartiellesPsy.push({
        x: activité.année,
        y: activité.nombreJournéesPartiellesPsy.value,
      });
      nombreDeJournées.nombreJournéesPartiellesSsr.push({
        x: activité.année,
        y: activité.nombreJournéesPartielsSsr.value,
      });
    });
    return [nombreDeJournées, années];
  }

  public getOptionsHistogramme() {
    return this.optionsHistogrammeÀBandes(this.identifiantDeLaLégendeDesJournéesPsyEtSsr, this.tooltipJournéesPsyEtSsr);
  }

  public get histogrammeDataSet() {
    return {
      datasets: [
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuClair,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: this.nombreDeJournées.nombreJournéesPartiellesSsr,
          label: this.wording.HOSPITALISATION_PARTIELLE_SSR,
          stack: "Stack 1",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuFoncé,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: this.nombreDeJournées.nombreJournéesComplètesSsr,
          label: this.wording.HOSPITALISATION_COMPLÈTE_SSR,
          stack: "Stack 1",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeClair,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: this.nombreDeJournées.nombreJournéesPartiellesPsy,
          label: this.wording.HOSPITALISATION_PARTIELLE_PSY,
          stack: "Stack 2",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeFoncé,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: this.nombreDeJournées.nombreJournéesComplètesPsy,
          label: this.wording.HOSPITALISATION_COMPLÈTE_PSY,
          stack: "Stack 2",
        },
      ],
      labels: this.années,
    };
  }

  get identifiants() {
    return [
      this.wording.HOSPITALISATION_PARTIELLE_SSR,
      this.wording.HOSPITALISATION_COMPLÈTE_SSR,
      this.wording.HOSPITALISATION_PARTIELLE_PSY,
      this.wording.HOSPITALISATION_COMPLÈTE_PSY,
    ];
  }

  get valeurs() {
    return [
      this.valeursDesNombresDeSéjours(this.nombreDeJournées.nombreJournéesPartiellesSsr),
      this.valeursDesNombresDeSéjours(this.nombreDeJournées.nombreJournéesComplètesSsr),
      this.valeursDesNombresDeSéjours(this.nombreDeJournées.nombreJournéesPartiellesPsy),
      this.valeursDesNombresDeSéjours(this.nombreDeJournées.nombreJournéesComplètesPsy),
    ];
  }

  private valeursDesNombresDeSéjours(nombresSéjours: { x: number; y: number | null }[]): (string | null)[] {
    return nombresSéjours.map((nombreSéjour) => {
      return nombreSéjour.y ? nombreSéjour.y.toLocaleString("fr") : null;
    });
  }

  private tooltipJournéesPsyEtSsr(wording: Wording) {
    return function (context: any) {
      const label = `${context.dataset.label} : ${context.parsed.y.toLocaleString("fr")}`;

      if (context.datasetIndex <= 1) {
        const nombreSéjoursHospitalisationPartielleSsr = context.parsed._stacks.y["0"];
        const nombreSéjoursHospitalisationComplèteSsr = context.parsed._stacks.y["1"];
        return [
          label,
          `${wording.TOTAL_HOSPITALISATION_SSR} : ${(nombreSéjoursHospitalisationPartielleSsr + nombreSéjoursHospitalisationComplèteSsr).toLocaleString("fr")}`,
        ];
      }
      if (context.datasetIndex === 2 || context.datasetIndex === 3) {
        const nombreSéjoursHospitalisationPartiellePsy = context.parsed._stacks.y["2"];
        const nombreSéjoursHospitalisationComplètePsy = context.parsed._stacks.y["3"];
        return [
          label,
          `${wording.TOTAL_HOSPITALISATION_PSY} : ${(nombreSéjoursHospitalisationPartiellePsy + nombreSéjoursHospitalisationComplètePsy).toLocaleString("fr")}`,
        ];
      }
      return label;
    };
  }
}

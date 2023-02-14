import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";
import { TableIndicateur } from "../../commun/TableIndicateur/TableIndicateur";
import { IndicateurActivité } from "../../indicateur-métier/IndicateurActivité";
import { NombreDeSejourMCOViewModel } from "../../indicateur-métier/nombre-de-sejour-mco/NombreDeSejourMCOViewModel";
import { NombrePassageAuxUrgencesViewModel } from "../../indicateur-métier/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";
import stylesBlocActivité from "./BlocActivitéSanitaire.module.css";

type DonnéesDeDiagrammeDesJournéesPsyEtSsr = Readonly<{
  nombreJournéesComplètesPsy: { x: number; y: number | null }[];
  nombreJournéesComplètesSsr: { x: number; y: number | null }[];
  nombreJournéesPartiellesPsy: { x: number; y: number | null }[];
  nombreJournéesPartiellesSsr: { x: number; y: number | null }[];
}>;

export class NombreDeJourneesPsySSRViewModel extends GraphiqueViewModel {
  readonly couleurDuFondHistogrammeBleuClair = "#DEE5FD";
  readonly couleurDuFondHistogrammeBleuFoncé = "#2F4077";
  readonly couleurDuFondHistogrammeRougeClair = "#FEE9E6";
  readonly couleurDuFondHistogrammeRougeFoncé = "#A94645";
  readonly identifiantDeLaLégendeDesJournéesPsyEtSsr = "légende-graphique-sanitaire-journées-psy-et-ssr";
  constructor(private activitésPsySSR: ÉtablissementTerritorialSanitaireActivité[], wording: Wording) {
    super(wording);
  }

  public get nombreDeJournéesPsyEtSsrSontIlsRenseignés(): boolean {
    return this.activitésPsySSR.some(
      (activité: ÉtablissementTerritorialSanitaireActivité) =>
        activité["nombreJournéesPartiellesPsy"].value !== null ||
        activité["nombreJournéesCompletesSsr"].value !== null ||
        activité["nombreJournéesPartiellesPsy"].value !== null ||
        activité["nombreJournéesCompletePsy"].value !== null
    );
  }

  public get nombreDeJournéesPsyEtSsr(): ReactElement {
    const [nombreDeJournées, années] = this.construisLesJournéesPsyEtSsrParAnnée();

    return this.afficheLHistogrammeDesJournéesPsyEtSsr(nombreDeJournées, années);
  }

  public get dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr(): string {
    return StringFormater.formateLaDate(this.activitésPsySSR[0].nombreJournéesCompletePsy.dateMiseÀJourSource);
  }

  private construisLesJournéesPsyEtSsrParAnnée(): [DonnéesDeDiagrammeDesJournéesPsyEtSsr, number[]] {
    const nombreDeJournées: DonnéesDeDiagrammeDesJournéesPsyEtSsr = {
      nombreJournéesComplètesPsy: [],
      nombreJournéesComplètesSsr: [],
      nombreJournéesPartiellesPsy: [],
      nombreJournéesPartiellesSsr: [],
    };
    const années: number[] = [];

    this.activitésPsySSR.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
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
  private afficheLHistogrammeDesJournéesPsyEtSsr(nombreDeJournées: DonnéesDeDiagrammeDesJournéesPsyEtSsr, années: number[]): ReactElement {
    const data = {
      datasets: [
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuClair,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeJournées.nombreJournéesPartiellesSsr,
          label: this.wording.HOSPITALISATION_PARTIELLE_SSR,
          stack: "Stack 1",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuFoncé,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeJournées.nombreJournéesComplètesSsr,
          label: this.wording.HOSPITALISATION_COMPLÈTE_SSR,
          stack: "Stack 1",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeClair,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeJournées.nombreJournéesPartiellesPsy,
          label: this.wording.HOSPITALISATION_PARTIELLE_PSY,
          stack: "Stack 2",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeFoncé,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeJournées.nombreJournéesComplètesPsy,
          label: this.wording.HOSPITALISATION_COMPLÈTE_PSY,
          stack: "Stack 2",
        },
      ],
      labels: années,
    };

    const options = this.getOptionsHistogramme();

    return (
      <>
        <Bar data={data} options={options} />
        <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id={this.identifiantDeLaLégendeDesJournéesPsyEtSsr} />
        <TableIndicateur
          entêteLibellé={this.wording.ANNÉE}
          identifiants={[
            this.wording.HOSPITALISATION_PARTIELLE_SSR,
            this.wording.HOSPITALISATION_COMPLÈTE_SSR,
            this.wording.HOSPITALISATION_PARTIELLE_PSY,
            this.wording.HOSPITALISATION_COMPLÈTE_PSY,
          ]}
          libellés={années}
          valeurs={[
            this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesPartiellesSsr),
            this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesComplètesSsr),
            this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesPartiellesPsy),
            this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesComplètesPsy),
          ]}
        />
      </>
    );
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

export class ÉtablissementTerritorialSanitaireActivitéViewModel extends GraphiqueViewModel {
  // @ts-ignore
  nombreDePassagesAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  nombreJourneesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;

  constructor(private readonly établissementTerritorialSanitaireActivités: ÉtablissementTerritorialSanitaire["activités"], wording: Wording) {
    super(wording);
    this.createNombrePassageUrgenceViewModel(wording);
    this.nombreDeSejourMCOViewModel = new NombreDeSejourMCOViewModel(établissementTerritorialSanitaireActivités, wording);
    this.nombreJourneesPsySSRViewModel = new NombreDeJourneesPsySSRViewModel(établissementTerritorialSanitaireActivités, wording);
  }

  private createNombrePassageUrgenceViewModel(wording: Wording) {
    const indicateurNombrePassage: IndicateurActivité[] = this.établissementTerritorialSanitaireActivités.map((activité) => {
      return {
        année: activité.année,
        dateMiseÀJourSource: activité.nombreDePassagesAuxUrgences.dateMiseÀJourSource,
        value: activité.nombreDePassagesAuxUrgences.value,
      };
    });
    this.nombreDePassagesAuxUrgencesViewModel = new NombrePassageAuxUrgencesViewModel(indicateurNombrePassage, wording);
  }

  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return (
      !this.activitéEstElleRenseignée ||
      (!this.nombreDeSejourMCOViewModel.nombreDeSéjoursMCOSontIlsRenseignés &&
        !this.nombreJourneesPsySSRViewModel.nombreDeJournéesPsyEtSsrSontIlsRenseignés &&
        !this.nombreDePassagesAuxUrgencesEstIlRenseigné)
    );
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorialSanitaireActivités.length !== 0;
  }

  public get nombreDePassagesAuxUrgencesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("nombreDePassagesAuxUrgences");
  }

  private lIndicateurEstIlRenseigné(
    indicateur: Exclude<keyof ÉtablissementTerritorialSanitaireActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): boolean {
    return this.établissementTerritorialSanitaireActivités.some((activité: ÉtablissementTerritorialSanitaireActivité) => activité[indicateur].value !== null);
  }
}

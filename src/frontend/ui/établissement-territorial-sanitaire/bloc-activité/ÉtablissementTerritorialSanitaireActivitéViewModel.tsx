import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { Wording } from "../../../configuration/wording/Wording";
import { CouleurHistogramme, GraphiqueViewModel } from "../../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../../commun/StringFormater";
import { TableIndicateur } from "../../commun/TableIndicateur/TableIndicateur";
import { HistogrammeHorizontal } from "../../entité-juridique/bloc-activité/HistogrammeHorizontal";
import stylesBlocActivité from "./BlocActivitéSanitaire.module.css";

type DonnéesDeDiagrammeDesSéjoursMCO = Readonly<{
  nombreSéjoursCompletsMédecine: { x: number; y: number | null }[];
  nombreSéjoursCompletsChirurgie: { x: number; y: number | null }[];
  nombreSéjoursCompletsObstétrique: { x: number; y: number | null }[];
  nombreSéjoursPartielsMédecine: { x: number; y: number | null }[];
  nombreSéjoursPartielsChirurgie: { x: number; y: number | null }[];
  nombreSéjoursPartielsObstétrique: { x: number; y: number | null }[];
}>;

type DonnéesDeDiagrammeDesJournéesPsyEtSsr = Readonly<{
  nombreJournéesComplètesPsy: { x: number; y: number | null }[];
  nombreJournéesComplètesSsr: { x: number; y: number | null }[];
  nombreJournéesPartiellesPsy: { x: number; y: number | null }[];
  nombreJournéesPartiellesSsr: { x: number; y: number | null }[];
}>;

export class ÉtablissementTerritorialSanitaireActivitéViewModel extends GraphiqueViewModel {
  readonly couleurDuFondHistogrammeBleuClair = "#DEE5FD";
  readonly couleurDuFondHistogrammeBleuFoncé = "#2F4077";
  readonly couleurDuFondHistogrammeVertClair = "#DFFDF7";
  readonly couleurDuFondHistogrammeVertFoncé = "#006A6F";
  readonly couleurDuFondHistogrammeRougeClair = "#FEE9E6";
  readonly couleurDuFondHistogrammeRougeFoncé = "#A94645";
  readonly identifiantDeLaLégendeDesSéjoursMCO = "légende-graphique-sanitaire-journées-séjours-mco";
  readonly identifiantDeLaLégendeDesJournéesPsyEtSsr = "légende-graphique-sanitaire-journées-psy-et-ssr";
  readonly ratioHistogrammeNombreDePassagesAuxUrgences = 7;

  constructor(private readonly établissementTerritorialSanitaireActivités: ÉtablissementTerritorialSanitaire["activités"], wording: Wording) {
    super(wording);
  }

  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return (
      !this.activitéEstElleRenseignée ||
      (!this.nombreDeSéjoursMCOSontIlsRenseignés && !this.nombreDeJournéesPsyEtSsrSontIlsRenseignés && !this.nombreDePassagesAuxUrgencesEstIlRenseigné)
    );
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.établissementTerritorialSanitaireActivités.length === 0 ? false : true;
  }

  public get nombreDeSéjoursMCOSontIlsRenseignés(): boolean {
    return this.établissementTerritorialSanitaireActivités.some(
      (activité: ÉtablissementTerritorialSanitaireActivité) =>
        activité["nombreSéjoursPartielsMédecine"].value !== null ||
        activité["nombreSéjoursCompletsMédecine"].value !== null ||
        activité["nombreSéjoursPartielsChirurgie"].value !== null ||
        activité["nombreSéjoursCompletsChirurgie"].value !== null ||
        activité["nombreSéjoursPartielsObstétrique"].value !== null ||
        activité["nombreSéjoursCompletsObstétrique"].value !== null
    );
  }

  public get nombreDeSéjoursMédecineChirurgieObstétrique(): ReactElement {
    const [nombreDeSéjours, années] = this.construisLesSéjoursMCOParAnnée();

    return this.afficheLHistogrammeDesSéjoursMCO(nombreDeSéjours, années);
  }

  public get dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireActivités[0].nombreSéjoursCompletsMédecine.dateMiseÀJourSource);
  }

  public get nombreDeJournéesPsyEtSsrSontIlsRenseignés(): boolean {
    return this.établissementTerritorialSanitaireActivités.some(
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
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireActivités[0].nombreJournéesCompletePsy.dateMiseÀJourSource);
  }

  public get nombreDePassagesAuxUrgencesEstIlRenseigné(): boolean {
    return this.lIndicateurEstIlRenseigné("nombreDePassagesAuxUrgences");
  }

  public get nombreDePassagesAuxUrgences(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesValeurs("nombreDePassagesAuxUrgences");
    const annéesManquantes = this.annéesManquantes(années, 5);
    const construisLaCouleurDeLaBarreHorizontale = (_valeur: number, année: number | string): CouleurHistogramme => {
      return this.estCeLAnnéePassée(année)
        ? {
            premierPlan: this.couleurDuFondHistogrammePrimaire,
            secondPlan: this.couleurDuFond,
          }
        : {
            premierPlan: this.couleurDuFondHistogrammeSecondaire,
            secondPlan: this.couleurDuFond,
          };
    };

    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={this.construisLesCouleursDeLHistogramme(valeurs, années, construisLaCouleurDeLaBarreHorizontale)}
        entêteLibellé={this.wording.ANNÉE}
        identifiant={this.wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
        libellés={années}
        libellésDeValeursManquantes={annéesManquantes}
        libellésDesTicks={années.map((année) => ({ tailleDePolice: this.estCeLAnnéePassée(année) ? this.policeGrasse : this.policeNormale }))}
        libellésDesValeurs={Array(valeurs.length).fill({ couleur: this.couleurIdentifiant })}
        nombreDeLibelléTotal={5}
        ratioLargeurSurHauteur={this.ratioHistogrammeNombreDePassagesAuxUrgences}
        valeurs={valeurs}
      />
    );
  }

  public get dateDeMiseÀJourDuNombreDePassagesAuxUrgences(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireActivités[0].nombreDePassagesAuxUrgences.dateMiseÀJourSource);
  }

  private construisLesSéjoursMCOParAnnée(): [DonnéesDeDiagrammeDesSéjoursMCO, number[]] {
    const nombreDeSéjours: DonnéesDeDiagrammeDesSéjoursMCO = {
      nombreSéjoursCompletsChirurgie: [],
      nombreSéjoursCompletsMédecine: [],
      nombreSéjoursCompletsObstétrique: [],
      nombreSéjoursPartielsChirurgie: [],
      nombreSéjoursPartielsMédecine: [],
      nombreSéjoursPartielsObstétrique: [],
    };
    const années: number[] = [];

    this.établissementTerritorialSanitaireActivités.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
      années.push(activité.année);
      nombreDeSéjours.nombreSéjoursCompletsChirurgie.push({ x: activité.année, y: activité.nombreSéjoursCompletsChirurgie.value });
      nombreDeSéjours.nombreSéjoursCompletsMédecine.push({ x: activité.année, y: activité.nombreSéjoursCompletsMédecine.value });
      nombreDeSéjours.nombreSéjoursCompletsObstétrique.push({ x: activité.année, y: activité.nombreSéjoursCompletsObstétrique.value });
      nombreDeSéjours.nombreSéjoursPartielsChirurgie.push({ x: activité.année, y: activité.nombreSéjoursPartielsChirurgie.value });
      nombreDeSéjours.nombreSéjoursPartielsMédecine.push({ x: activité.année, y: activité.nombreSéjoursPartielsMédecine.value });
      nombreDeSéjours.nombreSéjoursPartielsObstétrique.push({ x: activité.année, y: activité.nombreSéjoursPartielsObstétrique.value });
    });
    return [nombreDeSéjours, années];
  }

  private construisLesJournéesPsyEtSsrParAnnée(): [DonnéesDeDiagrammeDesJournéesPsyEtSsr, number[]] {
    const nombreDeJournées: DonnéesDeDiagrammeDesJournéesPsyEtSsr = {
      nombreJournéesComplètesPsy: [],
      nombreJournéesComplètesSsr: [],
      nombreJournéesPartiellesPsy: [],
      nombreJournéesPartiellesSsr: [],
    };
    const années: number[] = [];

    this.établissementTerritorialSanitaireActivités.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
      années.push(activité.année);
      nombreDeJournées.nombreJournéesComplètesPsy.push({ x: activité.année, y: activité.nombreJournéesCompletePsy.value });
      nombreDeJournées.nombreJournéesComplètesSsr.push({ x: activité.année, y: activité.nombreJournéesCompletesSsr.value });
      nombreDeJournées.nombreJournéesPartiellesPsy.push({ x: activité.année, y: activité.nombreJournéesPartiellesPsy.value });
      nombreDeJournées.nombreJournéesPartiellesSsr.push({ x: activité.année, y: activité.nombreJournéesPartielsSsr.value });
    });
    return [nombreDeJournées, années];
  }

  private construisLesAnnéesEtSesValeurs(
    indicateur: Exclude<keyof ÉtablissementTerritorialSanitaireActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.établissementTerritorialSanitaireActivités.forEach((activité: ÉtablissementTerritorialSanitaireActivité) => {
      if (activité[indicateur].value !== null) {
        années.push(activité.année);
      }

      if (activité[indicateur].value !== null) {
        // @ts-ignore
        valeurs.push(activité[indicateur].value);
      }
    });

    return [valeurs, années];
  }

  private lIndicateurEstIlRenseigné(
    indicateur: Exclude<keyof ÉtablissementTerritorialSanitaireActivité, "année" | "dateMiseÀJourSource" | "numéroFinessÉtablissementTerritorial">
  ): boolean {
    return this.établissementTerritorialSanitaireActivités.some((activité: ÉtablissementTerritorialSanitaireActivité) => activité[indicateur].value !== null);
  }

  private afficheLHistogrammeDesSéjoursMCO(nombreDeSéjours: DonnéesDeDiagrammeDesSéjoursMCO, années: number[]): ReactElement {
    const data = {
      datasets: [
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuClair,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsMédecine,
          label: this.wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
          stack: "Stack 1",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeBleuFoncé,
          borderColor: this.couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsMédecine,
          label: this.wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
          stack: "Stack 1",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeVertClair,
          borderColor: this.couleurDuFondHistogrammeVertFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsChirurgie,
          label: this.wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
          stack: "Stack 2",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeVertFoncé,
          borderColor: this.couleurDuFondHistogrammeVertFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsChirurgie,
          label: this.wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
          stack: "Stack 2",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeClair,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeSéjours.nombreSéjoursPartielsObstétrique,
          label: this.wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
          stack: "Stack 3",
        },
        {
          backgroundColor: this.couleurDuFondHistogrammeRougeFoncé,
          borderColor: this.couleurDuFondHistogrammeRougeFoncé,
          data: nombreDeSéjours.nombreSéjoursCompletsObstétrique,
          label: this.wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
          stack: "Stack 3",
        },
      ],
      labels: années,
    };

    const options = this.optionsHistogrammeÀBandes(this.identifiantDeLaLégendeDesSéjoursMCO, this.tooltipSéjoursMCO);

    return (
      <>
        <Bar data={data} options={options} />
        <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id={this.identifiantDeLaLégendeDesSéjoursMCO} />
        <TableIndicateur
          entêteLibellé={this.wording.ANNÉE}
          identifiants={[
            this.wording.HOSPITALISATION_PARTIELLE_MÉDECINE,
            this.wording.HOSPITALISATION_COMPLÈTE_MÉDECINE,
            this.wording.HOSPITALISATION_PARTIELLE_CHIRURGIE,
            this.wording.HOSPITALISATION_COMPLÈTE_CHIRURGIE,
            this.wording.HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE,
            this.wording.HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE,
          ]}
          libellés={années}
          valeurs={[
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsMédecine),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsMédecine),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsChirurgie),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsChirurgie),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsObstétrique),
            this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsObstétrique),
          ]}
        />
      </>
    );
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

    const options = this.optionsHistogrammeÀBandes(this.identifiantDeLaLégendeDesJournéesPsyEtSsr, this.tooltipJournéesPsyEtSsr);

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

  private tooltipSéjoursMCO(wording: Wording) {
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

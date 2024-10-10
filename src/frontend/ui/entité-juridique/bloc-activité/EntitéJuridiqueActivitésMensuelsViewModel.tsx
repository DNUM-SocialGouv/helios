import { ActiviteSanitaireMensuel, ActivitesSanitaireMensuel } from "../../../../backend/métier/entities/ActivitesSanitaireMensuel";
import { Wording } from "../../../configuration/wording/Wording";
import {
  couleurDuFondHistogrammeBleuClair,
  couleurDuFondHistogrammeBleuFoncé,
  couleurDuFondHistogrammeRougeClair,
  couleurDuFondHistogrammeRougeFoncé,
  couleurDuFondHistogrammeVertClair,
  couleurDuFondHistogrammeVertFoncé,
} from "../../commun/Graphique/couleursGraphique";

interface ActivitesSanitaireMensuelParAnnee {
  [key: number]: ActiviteSanitaireMensuel[];
}

type IndicateurDesSejoursMCO = Readonly<{
  nombreSéjoursCompletsMédecine: { x: number; y: number | null | '' }[];
  nombreSéjoursCompletsChirurgie: { x: number; y: number | null | '' }[];
  nombreSéjoursCompletsObstétrique: { x: number; y: number | null | '' }[];
  nombreSéjoursPartielsMédecine: { x: number; y: number | null | '' }[];
  nombreSéjoursPartielsChirurgie: { x: number; y: number | null | '' }[];
  nombreSéjoursPartielsObstétrique: { x: number; y: number | null | '' }[];
}>;

type DonnéesDeDiagrammeDesJournéesPsyEtSsr = Readonly<{
  nombreJournéesComplètesPsy: { x: number; y: number | null | "" }[];
  nombreJournéesComplètesSsr: { x: number; y: number | null | "" }[];
  nombreJournéesPartiellesPsy: { x: number; y: number | null | "" }[];
  nombreJournéesPartiellesSsr: { x: number; y: number | null | "" }[];
}>;

export class ActivitésMensuelViewModel {
  public activitésMensuellesParAnnee: ActivitesSanitaireMensuelParAnnee;
  public annees: number[];
  readonly identifiantDeLaLégendeDesSéjoursMensuelMCO = "légende-graphique-sanitaire-journées-séjours-mensuels-mco";
  readonly identifiantDeLaLégendeDesSéjoursMensuelPsySsr = "légende-graphique-sanitaire-journées-séjours-mensuels-psy-ssr";

  public listeDesMois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];


  constructor(private readonly activitésMensuels: ActivitesSanitaireMensuel, private wording: Wording) {
    this.activitésMensuellesParAnnee = this.grouperLesActivitesParAnnee();
    this.annees = Object.keys(this.activitésMensuellesParAnnee) as unknown as number[];
  }

  private grouperLesActivitesParAnnee(): ActivitesSanitaireMensuelParAnnee {
    return this.activitésMensuels.activitesSanitaireMensuelList.reduce((grouped, activite) => {
      (grouped[activite["année"]] = grouped[activite["année"]] || []).push(activite);
      return grouped;
    }, {} as ActivitesSanitaireMensuelParAnnee);
  }

  private construisLesSéjoursMCOParMois(annee: number): IndicateurDesSejoursMCO {
    const nombreDeSéjours: IndicateurDesSejoursMCO = {
      nombreSéjoursCompletsChirurgie: [],
      nombreSéjoursCompletsMédecine: [],
      nombreSéjoursCompletsObstétrique: [],
      nombreSéjoursPartielsChirurgie: [],
      nombreSéjoursPartielsMédecine: [],
      nombreSéjoursPartielsObstétrique: [],
    };

    if (this.annees.length === 0) return nombreDeSéjours;

    this.activitésMensuellesParAnnee[annee].forEach((activité: ActiviteSanitaireMensuel) => {
      nombreDeSéjours.nombreSéjoursCompletsChirurgie.push({
        x: activité.mois,
        y: activité.nombreSéjoursCompletsChirurgie
      });
      nombreDeSéjours.nombreSéjoursCompletsMédecine.push({
        x: activité.mois,
        y: activité.nombreSéjoursCompletsMédecine
      });
      nombreDeSéjours.nombreSéjoursCompletsObstétrique.push({
        x: activité.mois,
        y: activité.nombreSéjoursCompletsObstétrique
      });
      nombreDeSéjours.nombreSéjoursPartielsChirurgie.push({
        x: activité.mois,
        y: activité.nombreSéjoursPartielsChirurgie
      });
      nombreDeSéjours.nombreSéjoursPartielsMédecine.push({
        x: activité.mois,
        y: activité.nombreSéjoursPartielsMédecine
      });
      nombreDeSéjours.nombreSéjoursPartielsObstétrique.push({
        x: activité.mois,
        y: activité.nombreSéjoursPartielsObstétrique
      });
    });
    return nombreDeSéjours;
  }

  getHistogrammeDataSet(annee: number, activite: string) {
    const nombreDeSéjours = this.construisLesSéjoursMCOParMois(annee);
    if (activite === this.wording.MÉDECINE) {
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
          }
        ],
        labels: this.listeDesMois,
      }
    }
    if (activite === this.wording.CHIRURGIE) {
      return {
        datasets: [
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
        ],
        labels: this.listeDesMois,
      }
    }
    return {
      datasets: [
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
      labels: this.listeDesMois,
    };
  }

  private construisLesJournéesPsyEtSsrParMois(annee: number): DonnéesDeDiagrammeDesJournéesPsyEtSsr {
    const nombreDeJournées: DonnéesDeDiagrammeDesJournéesPsyEtSsr = {
      nombreJournéesComplètesPsy: [],
      nombreJournéesComplètesSsr: [],
      nombreJournéesPartiellesPsy: [],
      nombreJournéesPartiellesSsr: [],
    };

    if (this.annees.length === 0) return nombreDeJournées;

    this.activitésMensuellesParAnnee[annee].forEach((activité: ActiviteSanitaireMensuel) => {
      nombreDeJournées.nombreJournéesComplètesPsy.push({
        x: activité.mois,
        y: 0,
      });
      nombreDeJournées.nombreJournéesComplètesSsr.push({
        x: activité.mois,
        y: activité.nombreJournéesCompletesSsr,
      });
      nombreDeJournées.nombreJournéesPartiellesPsy.push({
        x: activité.mois,
        y: 0,
      });
      nombreDeJournées.nombreJournéesPartiellesSsr.push({
        x: activité.mois,
        y: activité.nombreJournéesPartiellesSsr,
      });
    });
    return nombreDeJournées;
  }

  getHistogrammePsySsrDataSet(annee: number, selectedActivity: string) {
    const nombreDeJournées = this.construisLesJournéesPsyEtSsrParMois(annee);
    if (selectedActivity !== this.wording.SSR) {
      return {
        datasets: [
          {
            backgroundColor: couleurDuFondHistogrammeRougeClair,
            borderColor: couleurDuFondHistogrammeRougeFoncé,
            data: nombreDeJournées.nombreJournéesPartiellesPsy,
            label: this.wording.HOSPITALISATION_PARTIELLE_PSY,
            stack: "Stack 2",
          },
          {
            backgroundColor: couleurDuFondHistogrammeRougeFoncé,
            borderColor: couleurDuFondHistogrammeRougeFoncé,
            data: nombreDeJournées.nombreJournéesComplètesPsy,
            label: this.wording.HOSPITALISATION_COMPLÈTE_PSY,
            stack: "Stack 2",
          },
        ],
        labels: this.listeDesMois,
      }
    }
    return {
      datasets: [
        {
          backgroundColor: couleurDuFondHistogrammeBleuClair,
          borderColor: couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeJournées.nombreJournéesPartiellesSsr,
          label: this.wording.HOSPITALISATION_PARTIELLE_SSR,
          stack: "Stack 1",
        },
        {
          backgroundColor: couleurDuFondHistogrammeBleuFoncé,
          borderColor: couleurDuFondHistogrammeBleuFoncé,
          data: nombreDeJournées.nombreJournéesComplètesSsr,
          label: this.wording.HOSPITALISATION_COMPLÈTE_SSR,
          stack: "Stack 1",
        },
      ],
      labels: this.listeDesMois,
    }
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

  public getValeurTableIndicateur(annee: number) {
    const nombreDeSéjours = this.construisLesSéjoursMCOParMois(annee);

    return [
      this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsMédecine),
      this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsMédecine),
      this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsChirurgie),
      this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsChirurgie),
      this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursPartielsObstétrique),
      this.valeursDesNombresDeSéjours(nombreDeSéjours.nombreSéjoursCompletsObstétrique),
    ];
  }

  public getIdentifiantTablePsyIndicateur() {
    return [
      this.wording.HOSPITALISATION_PARTIELLE_SSR,
      this.wording.HOSPITALISATION_COMPLÈTE_SSR,
    ];
  }

  public getValeurTablePsyIndicateur(annee: number) {
    const nombreDeJournées = this.construisLesJournéesPsyEtSsrParMois(annee);
    return [
      this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesPartiellesSsr),
      this.valeursDesNombresDeSéjours(nombreDeJournées.nombreJournéesComplètesSsr),
    ];
  }

  private valeursDesNombresDeSéjours(nombresSéjours: { x: number; y: number | null | '' }[]): (string | null)[] {
    return nombresSéjours.map((nombreSéjour) => {
      return nombreSéjour.y !== null ? nombreSéjour.y.toLocaleString("fr") : null;
    });
  }
}

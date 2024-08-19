import { ChartData, ChartOptions, ScriptableScaleContext } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import { EntitéJuridiqueBudgetFinance } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes, estCeLAnnéePassée } from "../../../utils/dateUtils";
import {
  couleurDelAbscisse,
  couleurDuFond,
  couleurDuFondDeLaLigne,
  couleurDuFondHistogrammePrimaire,
  couleurDuFondHistogrammeSecondaire,
  couleurDuSeuil,
  couleurErreur,
  TaillePoliceTick,
  CouleurHistogramme,
} from "../../commun/Graphique/couleursGraphique";
import { MiseEnExergue } from "../../commun/MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../../commun/StringFormater";
import { Transcription } from "../../commun/Transcription/Transcription";

type TauxDeCaf = Readonly<{ année: number; valeur: number | null | "" }>;

export class TauxDeCafViewModel {
  private readonly seuilDuTauxDeCaf = 2;
  private readonly seuilMinimalDuTauxDeCaf = -21;
  private readonly seuilMaximalDuTauxDeCaf = 21;
  private readonly autorisations: any;

  static fromBudgetFinanceMedicoSocial(budgetFinance: ÉtablissementTerritorialMédicoSocialBudgetEtFinances[], autorisations: any, wording: Wording) {
    const tauxDeCaf: TauxDeCaf[] = budgetFinance && budgetFinance.map((budget) => ({
      année: budget.année,
      valeur: budget.tauxDeCafNette.valeur,
    }));
    const dateMiseÀJourSource = budgetFinance && budgetFinance.length > 0 ? budgetFinance[0].tauxDeCafNette?.dateMiseÀJourSource : "";
    return new TauxDeCafViewModel(tauxDeCaf, dateMiseÀJourSource, autorisations, wording, 3);
  }

  static fromBudgetFinanceEntiteJuridique(budgetFinance: EntitéJuridiqueBudgetFinance[], autorisations: any, wording: Wording) {
    const tauxDeCaf: TauxDeCaf[] = budgetFinance && budgetFinance.map((budget) => ({
      année: budget.année,
      valeur: budget.tauxDeCafNetSan,
    }));
    const dateMiseÀJourSource = budgetFinance && budgetFinance.length > 0 ? budgetFinance[0].dateMiseÀJourSource : "";
    return new TauxDeCafViewModel(tauxDeCaf, dateMiseÀJourSource, autorisations, wording);
  }

  constructor(private tauxDeCafParAnnée: TauxDeCaf[], private dateMiseÀJourSource: string, autorisations: any, private wording: Wording, private nombreDAnnéesParIndicateur = 5) {
    this.autorisations = autorisations;
  }

  public get leTauxDeCafEstIlRenseigné(): boolean {
    const [années] = this.construisLesAnnéesEtSesTaux();

    return années.length > 0;
  }

  public get leTauxDeCafEstIlAutorisé(): boolean {
    if (
      this.autorisations &&
      this.autorisations.budgetEtFinance &&
      this.autorisations.budgetEtFinance.tauxDeCafNette &&
      this.autorisations.budgetEtFinance.tauxDeCafNette === 'ok') {
      return true
    }
    return false
  }


  private construisLesAnnéesEtSesTaux(): number[][] {
    const valeurs: number[] = [];
    const années: number[] = [];
    this.tauxDeCafParAnnée.forEach((tauxDeCaf: TauxDeCaf) => {
      const valeur = tauxDeCaf.valeur;
      if (valeur !== null && valeur !== "") {
        années.push(tauxDeCaf.année);
        valeurs.push(StringFormater.transformInRate(valeur));
      }
    });

    return [valeurs, années];
  }

  public get tauxDeCaf(): ReactElement {
    const [valeurs, années] = this.construisLesAnnéesEtSesTaux();
    const libellésDesValeurs = valeurs.map(() => couleurDuFond);
    const taillePoliceTick = années.map((année) => (estCeLAnnéePassée(année) ? "bold" : "normal"));

    return this.afficheLHistogrammeDuTauxDeCaf(
      valeurs,
      années,
      valeurs.map((valeur: number, index: number) => {
        let premierPlan = couleurDuFondHistogrammeSecondaire;
        if (estCeLAnnéePassée(années[index])) {
          premierPlan = couleurDuFondHistogrammePrimaire;
        }
        if (this.leTauxDeCafEstIlAberrant(valeur)) {
          premierPlan = couleurErreur;
        }
        return { premierPlan };
      }),
      libellésDesValeurs,
      taillePoliceTick
    );
  }

  private leTauxDeCafEstIlAberrant = (valeur: number): boolean => {
    return valeur < this.seuilMinimalDuTauxDeCaf || valeur > this.seuilMaximalDuTauxDeCaf;
  };

  private afficheLHistogrammeDuTauxDeCaf(
    valeurs: number[],
    années: number[],
    couleursDeLHistogramme: CouleurHistogramme[],
    couleurDesLibelles: string[],
    taillePoliceTick: TaillePoliceTick[]
  ) {
    const minDeLHistogramme = Math.min(...valeurs) < this.seuilMinimalDuTauxDeCaf ? this.seuilMinimalDuTauxDeCaf : undefined;
    const maxDeLHistogramme = Math.max(...valeurs) > this.seuilMaximalDuTauxDeCaf ? this.seuilMaximalDuTauxDeCaf : undefined;
    const data: ChartData = {
      datasets: [
        {
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          data: valeurs,
          datalabels: { labels: { title: { color: couleurDesLibelles } } },
          maxBarThickness: 60,
          type: "bar",
          xAxisID: "x",
        },
        {
          borderColor: couleurDuSeuil,
          data: [
            {
              x: -1,
              y: this.seuilDuTauxDeCaf,
            },
            {
              x: 2,
              y: this.seuilDuTauxDeCaf,
            },
          ],
          type: "line",
          xAxisID: "xLine",
        },
        {
          borderColor: couleurDelAbscisse,
          data: [
            {
              x: -1,
              y: 0,
            },
            {
              x: 2,
              y: 0,
            },
          ],
          type: "line",
          xAxisID: "xLine2",
        },
      ],
      labels: années,
    };
    const listeAnnéesManquantes = annéesManquantes(années, this.nombreDAnnéesParIndicateur);

    return (
      <>
        {listeAnnéesManquantes.length < this.nombreDAnnéesParIndicateur && (
          <Bar
            // @ts-ignore
            data={data}
            options={this.construisLesOptionsDeLHistogrammeDuTauxDeCaf(couleursDeLHistogramme, taillePoliceTick, maxDeLHistogramme, minDeLHistogramme)}
          />
        )}
        {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
        <Transcription
          disabled={listeAnnéesManquantes.length === this.nombreDAnnéesParIndicateur}
          entêteLibellé={this.wording.ANNÉE}
          identifiants={[this.wording.TAUX_DE_CAF]}
          libellés={années}
          valeurs={[StringFormater.addPercentToValues(valeurs)]}
        />
      </>
    );
  }

  private construisLesOptionsDeLHistogrammeDuTauxDeCaf(
    couleursDeLHistogramme: CouleurHistogramme[],
    taillePoliceTick: TaillePoliceTick[],
    maxDeLHistogramme: number | undefined,
    minDeLHistogramme: number | undefined
  ): ChartOptions<"bar"> {
    return {
      aspectRatio: 1.5,
      animation: false,
      plugins: {
        datalabels: {
          align: "end",
          anchor: "start",
          clamp: true,
          font: {
            family: "Marianne",
            size: 12,
            weight: 700,
          },
          formatter: (value: number, _context: Context): string => value.toLocaleString("fr") + " %",
          textStrokeColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          textStrokeWidth: 2,
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          grid: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            color: couleurDelAbscisse,
            // @ts-ignore
            font: { weight: taillePoliceTick },
            padding: 10,
          },
        },
        xLine: {
          display: false,
          max: 1,
          min: 0,
          type: "linear",
        },
        xLine2: {
          display: false,
          max: 1,
          min: 0,
          type: "linear",
        },
        y: {
          grid: {
            color: couleurDuFondDeLaLigne,
            drawBorder: false,
            drawOnChartArea: true,
            drawTicks: false,
          },
          max: maxDeLHistogramme,
          min: minDeLHistogramme,
          ticks: {
            callback: (tickValue: string | number) => {
              return tickValue === this.seuilDuTauxDeCaf ? `${tickValue} (seuil)` : tickValue;
            },
            color: couleurDelAbscisse,
            // @ts-ignore
            font: {
              weight: (context: ScriptableScaleContext) => (context.tick && context.tick.value === this.seuilDuTauxDeCaf ? "bold" : "normal"),
            },
            includeBounds: false,
            stepSize: 2,
          },
        },
      },
    };
  }

  public get dateMiseÀJourTauxDeCaf(): string {
    return StringFormater.formatDate(this.dateMiseÀJourSource);
  }
}

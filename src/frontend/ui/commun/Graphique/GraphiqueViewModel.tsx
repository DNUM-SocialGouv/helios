import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";
import { HistogrammeVertical } from "./HistogrammeVertical";
import { construisLePluginDeLaLegende } from "./LegendPlugin";

export type LibelléDeDonnéeGraphe = Readonly<{
  couleur: string;
}>;

export type LibelléDeTickGraphe = Readonly<{
  tailleDePolice: string;
}>;

export type CouleurHistogramme = Readonly<{
  premierPlan: string;
  secondPlan?: string;
}>;

export class GraphiqueViewModel {
  protected readonly SEUIL_DE_CONTRASTE_DES_LIBELLÉS_DES_TAUX = 20;
  readonly couleurDuFond = "#E8EDFF";
  readonly couleurDuFondHistogrammePrimaire = "#000091";
  readonly couleurDuFondHistogrammeSecondaire = "#4E68BB";
  readonly couleurDuFondDeLaLigne = "#929292";
  readonly couleurDuFondHistogrammeDeDépassement = "#C9191E";
  readonly couleurSecondPlanHistogrammeDeDépassement = "#FFE9E9";
  readonly couleurDelAbscisse = "#161616";
  readonly couleurIdentifiant = "#000";
  readonly policeGrasse = "bold";
  readonly policeNormale = "normal";
  readonly borneMaximaleDeLHistogrammeVertical = 105;

  constructor(protected readonly wording: Wording) {
    ChartJS.register(
      BarElement,
      CategoryScale,
      ChartDataLabels,
      Legend,
      LinearScale,
      LineController,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      construisLePluginDeLaLegende()
    );
  }

  protected afficheUnHistogrammeVertical(
    valeurs: number[],
    libellés: (number | string)[],
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesValeurs: LibelléDeDonnéeGraphe[],
    libellésDesTicks: LibelléDeTickGraphe[],
    entêteLibellé: string,
    identifiant: string,
    annéesTotales: number = 3
  ): ReactElement {
    return (
      <HistogrammeVertical
        annéesTotales={annéesTotales}
        couleursDeLHistogramme={couleursDeLHistogramme}
        entêteLibellé={entêteLibellé}
        identifiant={identifiant}
        libellés={libellés}
        libellésDesTicks={libellésDesTicks}
        libellésDesValeurs={libellésDesValeurs}
        valeurs={valeurs}
      />
    );
  }

  protected construisLesCouleursDeLHistogramme(
    valeurs: number[],
    libellés: (number | string)[],
    calculeLaCouleurDesBarresDeLHistogramme: (valeur: number, libellés: number | string) => CouleurHistogramme
  ): CouleurHistogramme[] {
    return valeurs.map((valeur: number, index: number) => {
      return calculeLaCouleurDesBarresDeLHistogramme(valeur, libellés[index]);
    });
  }

  private optionsHistogrammeVertical(grosseursDePoliceDesLibellés: string[]): ChartOptions<"bar"> {
    return {
      animation: false,
      plugins: {
        datalabels: {
          align: "end",
          anchor: "start",
          font: {
            family: "Marianne",
            size: 16,
            weight: 700,
          },
          formatter: (value: number, _context: Context): string => value.toLocaleString("fr") + " %",
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
      radius: false,
      scales: {
        x: {
          grid: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          stacked: true,
          ticks: {
            color: this.couleurDelAbscisse,
            // @ts-ignore
            font: { weight: grosseursDePoliceDesLibellés },
            padding: 10,
          },
        },
        xLine: {
          display: false,
          max: 1,
          min: 0,
          type: "linear",
        },
        y: {
          display: false,
          max: this.borneMaximaleDeLHistogrammeVertical,
        },
      },
    };
  }
}

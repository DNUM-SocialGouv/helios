import { ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";

import { StringFormater } from "../StringFormater";
import { CouleurHistogramme } from "./GraphiqueViewModel";
import { HistogrammeData, HistogrammesHorizontaux } from "./HistogrammesHorizontaux";

type HistogrammeHorizontalProps = {
  valeurs: number[];
  libellés: string[];
  couleursDeLHistogramme: CouleurHistogramme[];
  ratioLargeurSurHauteur?: number;
  entêteLibellé: string;
  identifiant: string;
  libellésDeValeursManquantes: number[];
  nombreDeLibelléTotal: number;
};

export function optionsHistogrammeHorizontal(
  ratioLargeurSurHauteur: number,
  valeurMaximale: number,
  grosseursDePoliceDesLibellés: string[],
  title: string = ""
): ChartOptions<"bar"> {
  const couleurDelAbscisse = "#161616";
  const couleurIdentifiant = "#000";

  return {
    animation: false,
    aspectRatio: ratioLargeurSurHauteur,
    indexAxis: "y",
    plugins: {
      datalabels: {
        align: "end",
        anchor: "end",
        font: {
          family: "Marianne",
          size: 14,
        },
        formatter: (value: string, _context: Context): string => parseFloat(value).toLocaleString("fr"),
      },
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        max: 1.45 * (valeurMaximale > 0 ? valeurMaximale : 1),
        min: 0,
        position: "top",
        ticks: { display: false },
        title: {
          align: "start",
          color: couleurIdentifiant,
          display: title === "" ? false : true,
          font: { weight: "bold" },
          text: title,
        },
      },
      y: {
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          color: couleurDelAbscisse,
          // @ts-ignore
          font: { weight: grosseursDePoliceDesLibellés },
          padding: 8,
        },
      },
    },
  };
}

export const HistogrammeHorizontal = ({
  valeurs,
  libellés,
  couleursDeLHistogramme,
  entêteLibellé,
  identifiant,
  libellésDeValeursManquantes,
  nombreDeLibelléTotal = 3,
}: HistogrammeHorizontalProps): ReactElement => {
  const valeursDesHistogrammes: HistogrammeData[] = [
    new HistogrammeData(
      "",
      libellés,
      valeurs,
      [
        {
          data: valeurs,
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          label: identifiant,
        },
      ],
      StringFormater.formateEnFrancais
    ),
  ];

  return (
    <HistogrammesHorizontaux
      annéesManquantes={libellésDeValeursManquantes}
      epaisseur="FIN"
      nom={entêteLibellé}
      nombreDAnnéeTotale={nombreDeLibelléTotal}
      valeursDesHistogrammes={valeursDesHistogrammes}
    />
  );
};

import { ChartData, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

import { annéesManquantes } from "../../../utils/dateUtils";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";

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

export function HistogrammeVertical(props: {
  valeurs: number[];
  libellés: (number | string)[];
  couleursDeLHistogramme: CouleurHistogramme[];
  libellésDesValeurs: LibelléDeDonnéeGraphe[];
  libellésDesTicks: LibelléDeTickGraphe[];
  entêteLibellé: string;
  identifiant: string;
  annéesTotales: number;
}): ReactElement {
  const { wording } = useDependencies();
  const couleurDuFondDeLaLigne = "#929292";

  const data: ChartData = {
    datasets: [
      {
        borderColor: couleurDuFondDeLaLigne,
        borderDash: [3, 3],
        borderWidth: 2,
        data: [
          {
            x: -1,
            y: 100,
          },
          {
            x: 2,
            y: 100,
          },
        ],
        datalabels: { display: false },
        type: "line",
        xAxisID: "xLine",
      },
      {
        backgroundColor: props.couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
        data: props.valeurs,
        datalabels: { labels: { title: { color: props.libellésDesValeurs.map((libellé) => libellé.couleur) } } },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
      {
        backgroundColor: props.couleursDeLHistogramme.map((couleur) => couleur.secondPlan),
        data: Array(props.valeurs.length).fill(100),
        datalabels: { display: false },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
    ],
    labels: props.libellés,
  };
  const listeAnnéesManquantes = annéesManquantes(props.libellés, props.annéesTotales);

  return (
    <>
      {listeAnnéesManquantes.length < props.annéesTotales && (
        <Bar
          // @ts-ignore
          data={data}
          options={optionsHistogrammeVertical(props.libellésDesTicks.map((libelléDuTick) => libelléDuTick.tailleDePolice))}
        />
      )}
      {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
      <Transcription
        disabled={listeAnnéesManquantes.length === props.annéesTotales}
        entêteLibellé={props.entêteLibellé}
        identifiants={[props.identifiant]}
        libellés={props.libellés}
        valeurs={[StringFormater.ajouteLePourcentage(props.valeurs)]}
      />
    </>
  );
}

function optionsHistogrammeVertical(grosseursDePoliceDesLibellés: string[]): ChartOptions<"bar"> {
  const borneMaximaleDeLHistogrammeVertical = 105;
  const couleurDelAbscisse = "#161616";

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
          color: couleurDelAbscisse,
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
        max: borneMaximaleDeLHistogrammeVertical,
      },
    },
  };
}

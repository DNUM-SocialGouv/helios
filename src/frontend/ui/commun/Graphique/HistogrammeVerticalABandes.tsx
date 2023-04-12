import { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import { Wording } from "../../../configuration/wording/Wording";
import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { Transcription } from "../Transcription/Transcription";
import { couleurDelAbscisse } from "./couleursGraphique";

function optionsHistogrammeÀBandes(idDeLaLégende: string, créeLeLibelléDuTooltip: Function, wording: Wording): ChartOptions<"bar"> {

  return {
    animation: false,
    elements: { bar: { borderWidth: 2 } },
    plugins: {
      datalabels: { display: false },
      // @ts-ignore
      htmlLegend: { containerID: idDeLaLégende },
      legend: { display: false },
      tooltip: { callbacks: { label: créeLeLibelléDuTooltip(wording) } },
    },
    responsive: true,
    scales: {
      x: {
        grid: { drawOnChartArea: false },
        ticks: { color: "var(--text-default-grey)" },
      },
      y: {
        grid: {
          color: couleurDelAbscisse,
          drawBorder: false,
        },
        stacked: true,
        ticks: { color: "var(--text-default-grey)" },
      },
    },
  };
}

export function HistogrammeVerticalABandes(props: {
  data: {
    datasets: (
      | { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null }[]; label: string }
      | { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null }[]; label: string }
      | { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null }[]; label: string }
      | { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null }[]; label: string }
    )[];
    labels: number[];
  };
  id: string;
  identifiants: string[];
  libellés: number[];
  valeurs: (string | null)[][];
  idDeLaLégende: string;
  créeLeLibelléDuTooltip: Function;
}) {
  const { wording } = useDependencies();

  return (
    <>
      <Bar data={props.data} options={optionsHistogrammeÀBandes(props.idDeLaLégende, props.créeLeLibelléDuTooltip, wording)} />
      <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id={props.id} />
      <Transcription entêteLibellé={wording.ANNÉE} identifiants={props.identifiants} libellés={props.libellés} valeurs={props.valeurs} />
    </>
  );
}

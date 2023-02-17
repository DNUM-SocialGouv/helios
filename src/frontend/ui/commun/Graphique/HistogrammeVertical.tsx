import { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { Transcription } from "../Transcription/Transcription";

export function HistogrammeVertical(props: {
  data: {
    datasets: (
      | { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null }[]; label: string }
      | { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null }[]; label: string }
      | { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null }[]; label: string }
      | { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null }[]; label: string }
    )[];
    labels: number[];
  };
  optionsHistogramme: ChartOptions<"bar">;
  id: string;
  identifiants: string[];
  libellés: number[];
  valeurs: (string | null)[][];
}) {
  const { wording } = useDependencies();

  return (
    <>
      <Bar data={props.data} options={props.optionsHistogramme} />
      <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id={props.id} />
      <Transcription entêteLibellé={wording.ANNÉE} identifiants={props.identifiants} libellés={props.libellés} valeurs={props.valeurs} />
    </>
  );
}

import { ChartOptions } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import { couleurDelAbscisse } from "./couleursGraphique";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { Transcription } from "../Transcription/Transcription";
import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";


function optionsHistogrammeÀBandes(idDeLaLégende: string, créeLeLibelléDuTooltip: Function, wording: Wording, cacheLesValeursBasse?: boolean): ChartOptions<"bar"> {
  return {
    animation: false,
    elements: { bar: { borderWidth: 2 } },
    plugins: {
      datalabels: {
        display: true,
        color: "black",
        backgroundColor: "white",
        borderRadius: 2,
        padding: {
          top: -1,
          bottom: -2,
        },
        formatter: (value) => {
          const valueNumber = value.y as number;
          if (cacheLesValeursBasse && valueNumber > 0 && valueNumber <= 5) {
            return "1 à 5";
          }
          return value.y;
        },
        font: {
          weight: "bolder",
        },
        anchor: "end",
        align: "top",
        offset: -2,
        clamp: true,
      },
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

export function HistogrammeVerticalABandes(props: Readonly<{
  data: {
    datasets: { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null | "" }[]; label: string }[];
    labels: (string | number)[];
  };
  id: string;
  identifiants: string[];
  libellés: (string | number)[];
  valeurs: (string | null)[][];
  idDeLaLégende: string;
  créeLeLibelléDuTooltip: Function;
  annéesTotales: number;
  grapheMensuel: boolean;
  cacheLesValeursBasse?: boolean;
}>) {
  const { wording } = useDependencies();

  const listeAnnéesManquantes = annéesManquantes(props.libellés, props.annéesTotales);
  const aucuneDonnee = listeAnnéesManquantes.length >= props.annéesTotales;
  const [indexPremierMoisNonRenseigne, setIndexPremierMoisNonRenseigne] = useState(props.valeurs.length)

  useEffect(() => {
    setIndexPremierMoisNonRenseigne(props.valeurs[0].length);
  }, [props.valeurs])

  return (
    <>
      {!aucuneDonnee || props.grapheMensuel ? (
        <>
          <Bar data={props.data} options={optionsHistogrammeÀBandes(props.idDeLaLégende, props.créeLeLibelléDuTooltip, wording, props.cacheLesValeursBasse)} />
          <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id={props.id} style={props.grapheMensuel ? { justifyContent: 'center' } : {}} />
        </>
      ) : null}
      {!props.grapheMensuel && listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
      {props.grapheMensuel && indexPremierMoisNonRenseigne < 12 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE_MENSUEL} ${props.libellés[indexPremierMoisNonRenseigne]}`}</MiseEnExergue>}
      <Transcription
        disabled={props.grapheMensuel ? false : aucuneDonnee}
        entêteLibellé={props.grapheMensuel ? wording.MOIS : wording.ANNÉE}
        identifiants={props.identifiants}
        libellés={props.libellés}
        valeurs={props.valeurs}
      />
    </>
  );
}

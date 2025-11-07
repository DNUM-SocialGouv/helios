import { ChartOptions } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import { couleurDelAbscisse } from "./couleursGraphique";
import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";
import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

const MIN_VALUE = 5;

function optionsHistogrammeÀBandes(idDeLaLégende: string, wording: Wording, créeLeLibelléDuTooltip?: Function, cacheLesValeursBasse?: boolean): ChartOptions<"bar"> {
  let tooltip;
  if (créeLeLibelléDuTooltip) {
    tooltip = { callbacks: { label: créeLeLibelléDuTooltip(wording) } }
  } else {
    tooltip = { enabled: false }
  }
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
          if (cacheLesValeursBasse && valueNumber > 0 && valueNumber <= MIN_VALUE) {
            return wording.PLACEHOLDER_VALEUR_INFERIEUR_A_5;
          }
          return StringFormater.roundFormatInFrench(valueNumber);
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
      tooltip: tooltip,
    },
    responsive: true,
    scales: {
      x: {
        grid: { drawOnChartArea: false },
        ticks: { color: "var(--text-default-grey)" },
      },
      y: {
        border: {
          display: false
        },
        grid: {
          color: couleurDelAbscisse,
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
  créeLeLibelléDuTooltip?: Function;
  annéesTotales: number;
  grapheMensuel: boolean;
  cacheLesValeursBasse?: boolean;
  legendeCentreeUneLigne?: boolean;
}>) {
  const { wording } = useDependencies();

  const listeAnnéesManquantes = annéesManquantes(props.libellés, props.annéesTotales);
  const aucuneDonnee = listeAnnéesManquantes.length >= props.annéesTotales;
  const [indexPremierMoisNonRenseigne, setIndexPremierMoisNonRenseigne] = useState(props.valeurs.length)

  useEffect(() => {
    setIndexPremierMoisNonRenseigne(props.valeurs[0].length);
  }, [props.valeurs])

  let hasSomeValuesToHide = false;
  const valeursTranscription = props.valeurs.map((valeurs) => valeurs.map((valeur) => {
    if (valeur) {
      const numValue = Number.parseFloat(valeur.replaceAll(/\s/g, "").replaceAll(/,/g, "."));
      if (props.cacheLesValeursBasse && numValue > 0 && numValue <= MIN_VALUE) {
        hasSomeValuesToHide = true;
        return wording.PLACEHOLDER_VALEUR_INFERIEUR_A_5;
      }
      return StringFormater.roundFormatInFrench(numValue);
    }
    return valeur;
  })
  );

  const legendStyle: { justifyContent?: string, gridTemplateRows?: string } = {};
  // Si la légende doit être centrée ou si c’est in graph mensuel on centre la légende
  if (props.legendeCentreeUneLigne || props.grapheMensuel) {
    legendStyle.justifyContent = "center";
  }
  // Si la légende doit être centrée, on la met sur une ligne
  if (props.legendeCentreeUneLigne) {
    legendStyle.gridTemplateRows = "repeat(1, 1fr)";
  }

  return (
    <>
      {!aucuneDonnee || props.grapheMensuel ? (
        <>
          <Bar data={props.data} options={optionsHistogrammeÀBandes(props.idDeLaLégende, wording, props.créeLeLibelléDuTooltip, props.cacheLesValeursBasse)} />
          <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id={props.id} style={legendStyle} />
        </>
      ) : null}
      {!props.grapheMensuel && listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
      {props.grapheMensuel && indexPremierMoisNonRenseigne < 12 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE_MENSUEL} ${props.libellés[indexPremierMoisNonRenseigne]}`}</MiseEnExergue>}
      {hasSomeValuesToHide && <MiseEnExergue>{`${wording.VALEURS_INFERIEUR_A_5_CACHÉS}`}</MiseEnExergue>}
      <Transcription
        disabled={props.grapheMensuel ? false : aucuneDonnee}
        entêteLibellé={props.grapheMensuel ? wording.MOIS : wording.ANNÉE}
        identifiants={props.identifiants}
        libellés={props.libellés}
        valeurs={valeursTranscription}
      />
    </>
  );
}

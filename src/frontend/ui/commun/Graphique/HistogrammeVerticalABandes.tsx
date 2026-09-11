import { ChartOptions } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import StringFormater from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";
import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

const MIN_VALUE = 5;

function optionsHistogrammeÀBandes(
  idDeLaLégende: string,
  wording: Wording,
  couleurDesAxes: string,
  créeLeLibelléDuTooltip?: (wording: Wording) => (ctx: any) => string | string[],
  cacheLesValeursBasse?: boolean
): ChartOptions<"bar"> {
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
      // @ts-expect-error Param non standard utilisé
      htmlLegend: { containerID: idDeLaLégende },
      legend: { display: false },
      tooltip: tooltip,
    },
    responsive: true,
    scales: {
      x: {
        border: { color: couleurDesAxes },
        grid: {
          color: couleurDesAxes,
          drawOnChartArea: false,
        },
        ticks: { color: couleurDesAxes },
      },
      y: {
        border: {
          display: false
        },
        grid: {
          color: couleurDesAxes,
        },
        stacked: true,
        ticks: { color: couleurDesAxes },
      },
    },
  };
}

export function HistogrammeVerticalABandes(props: Readonly<{
  etabTitle: string;
  etabFiness: string;
  nomGraph: string;
  data: {
    datasets: { backgroundColor: string; borderColor: string; stack: string; data: { x: number; y: number | null | "" }[]; label: string }[];
    labels: (string | number)[];
  };
  id: string;
  identifiants: string[];
  libellés: (string | number)[];
  valeurs: (string | null)[][];
  idDeLaLégende: string;
  créeLeLibelléDuTooltip?: (wording: Wording) => (ctx: any) => string | string[];
  annéesTotales: number;
  grapheMensuel: boolean;
  cacheLesValeursBasse?: boolean;
  legendeCentreeUneLigne?: boolean;
}>) {
  const { wording } = useDependencies();
  const [couleursDuTheme, setCouleursDuTheme] = useState({
    axe: "#161616",
  });

  useEffect(() => {
    const root = document.documentElement;

    const resoutVariableCss = (stylesDuTheme: CSSStyleDeclaration, nomDeVariable: string, couleurParDefaut: string): string => {
      let valeurResolue = stylesDuTheme.getPropertyValue(nomDeVariable).trim();
      const variablesVisitees = new Set<string>();

      while (valeurResolue.startsWith("var(")) {
        const correspondance = valeurResolue.match(/var\((--[^),\s]+)/);

        if (!correspondance || variablesVisitees.has(correspondance[1])) {
          break;
        }

        variablesVisitees.add(correspondance[1]);
        valeurResolue = stylesDuTheme.getPropertyValue(correspondance[1]).trim();
      }

      return valeurResolue || couleurParDefaut;
    };

    const metAJourLesCouleurs = () => {
      const stylesDuTheme = getComputedStyle(root);

      setCouleursDuTheme({
        axe: resoutVariableCss(stylesDuTheme, "--text-title-grey", "#161616"),
      });
    };

    metAJourLesCouleurs();

    const observer = new MutationObserver((mutations) => {
      const themeChange = mutations.some((mutation) => mutation.attributeName === "data-fr-theme" || mutation.attributeName === "data-fr-scheme");

      if (themeChange) {
        metAJourLesCouleurs();
      }
    });

    observer.observe(root, { attributes: true, attributeFilter: ["data-fr-theme", "data-fr-scheme"] });

    return () => observer.disconnect();
  }, []);

  const listeAnnéesManquantes = annéesManquantes(props.libellés, props.annéesTotales);
  const aucuneDonnee = listeAnnéesManquantes.length >= props.annéesTotales;
  const [indexPremierMoisNonRenseigne, setIndexPremierMoisNonRenseigne] = useState(props.valeurs.length)

  useEffect(() => {
    setIndexPremierMoisNonRenseigne(props.valeurs[0].length);
  }, [props.valeurs])

  let hasSomeValuesToHide = false;
  const valeursTranscription = props.valeurs.map((valeurs) => valeurs.map((valeur) => {
    if (valeur) {
      const numValue = Number.parseFloat(valeur.replaceAll(/\s/g, "").replace(",", "."));
      if (Number.isNaN(numValue)) {
        return valeur;
      }
      if (props.cacheLesValeursBasse && numValue > 0 && numValue <= MIN_VALUE) {
        // La valeur est set utilisée uniquement au premier render
        // eslint-disable-next-line react-hooks/immutability
        hasSomeValuesToHide = true;
        return wording.PLACEHOLDER_VALEUR_INFERIEUR_A_5;
      }
      return StringFormater.roundFormatInFrench(numValue);
    }
    return valeur;
  }));

  const legendStyle: { justifyContent?: string, gridTemplateRows?: string } = {};
  // Si la légende doit être centrée ou si c’est in graph mensuel on centre la légende
  if (props.legendeCentreeUneLigne || props.grapheMensuel) {
    legendStyle.justifyContent = "center";
  }
  // Si la légende doit être centrée, on la met sur une ligne
  if (props.legendeCentreeUneLigne) {
    legendStyle.gridTemplateRows = "repeat(1, 1fr)";
  }

  const idDeLaTranscription = props.identifiants[0]?.replaceAll(/\s/g, "");

  return (
    <>
      {!aucuneDonnee || props.grapheMensuel ? (
        <>
          <Bar 
          aria-describedby={idDeLaTranscription}
          data={props.data}
          options={optionsHistogrammeÀBandes(props.idDeLaLégende, wording, couleursDuTheme.axe, props.créeLeLibelléDuTooltip, props.cacheLesValeursBasse)}
          title={`Graphique ${props.nomGraph}`}
          />
          <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id={props.id} style={legendStyle} />
        </>
      ) : null}
      {!props.grapheMensuel && listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
      {props.grapheMensuel && indexPremierMoisNonRenseigne < 12 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE_MENSUEL} ${props.libellés[indexPremierMoisNonRenseigne]}`}</MiseEnExergue>}
      {hasSomeValuesToHide && <MiseEnExergue>{`${wording.VALEURS_INFERIEUR_A_5_CACHÉS}`}</MiseEnExergue>}
      <Transcription
        disabled={props.grapheMensuel ? false : aucuneDonnee}
        entêteLibellé={props.grapheMensuel ? wording.MOIS : wording.ANNÉE}
        etabFiness={props.etabFiness}
        etabTitle={props.etabTitle}
        identifiants={props.identifiants}
        libellés={props.libellés}
        nomGraph={props.nomGraph}
        valeurs={valeursTranscription}
      />
    </>
  );
}

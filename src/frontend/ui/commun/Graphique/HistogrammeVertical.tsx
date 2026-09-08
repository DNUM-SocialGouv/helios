import { ChartData, ChartOptions, ScriptableScaleContext } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

import { couleurDuFondDeLaLigne, CouleurHistogramme, TaillePoliceTick } from "./couleursGraphique";
import { annéesManquantes, annéesManquantesVigieRh } from "../../../utils/dateUtils";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import StringFormater from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";

export function HistogrammeVertical(props: Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  valeurs: number[];
  libellés: (number | string)[];
  couleursDeLHistogramme: CouleurHistogramme[];
  couleurDesLibelles: string[];
  taillePoliceTicks: TaillePoliceTick[];
  entêteLibellé: string;
  identifiant: string;
  annéesTotales: number;
  isVigieRh: boolean;
}>): ReactElement {
  const { wording } = useDependencies();
  const [couleursDuTheme, setCouleursDuTheme] = useState({
    texte: "#161616",
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
        texte: resoutVariableCss(stylesDuTheme, "--text-title-grey", "#161616"),
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
        datalabels: { labels: { title: { color: props.couleurDesLibelles } } },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
      {
        backgroundColor: props.couleursDeLHistogramme.map((couleur) => couleur.secondPlan),
        data: new Array(props.valeurs.length).fill(100),
        datalabels: { display: false },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
    ],
    labels: props.libellés,
  };
  const listeAnnéesManquantes = props.isVigieRh ? annéesManquantesVigieRh(props.libellés, props.annéesTotales) : annéesManquantes(props.libellés, props.annéesTotales);
  const idDeLaTranscription = props.identifiant?.replaceAll(/\s/g, "");

  return (
    <>
      {listeAnnéesManquantes.length < props.annéesTotales && (
        <Bar
          aria-describedby={idDeLaTranscription}
          data={data as ChartData<"bar">}
          options={optionsHistogrammeVertical(props.taillePoliceTicks, couleursDuTheme.texte)}
          title={`Graphique ${props.nomGraph}`}
        />
      )}
      {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
      <Transcription
        disabled={listeAnnéesManquantes.length === props.annéesTotales}
        entêteLibellé={props.entêteLibellé}
        etabFiness={props.etabFiness}
        etabTitle={props.etabTitle}
        identifiants={[props.identifiant]}
        libellés={props.libellés}
        nomGraph={props.nomGraph}
        valeurs={[StringFormater.addPercentToValues(props.valeurs)]}
      />
    </>
  );
}

function optionsHistogrammeVertical(grosseursDePoliceDesLibellés: string[], couleurDesLibellesAxeX: string): ChartOptions<"bar"> {
  const borneMaximale = 105;
  const borneMinimale = -1;

  return {
    animation: false,
    plugins: {
      datalabels: {
        align: "end",
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value > 0 ? "start" : "end";
        },
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
        formatter: (value: number, _context: Context): string => value.toLocaleString("fr") + " %",
      },
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        stacked: true,
        ticks: {
          color: couleurDesLibellesAxeX,
          font: {
            weight: (context: ScriptableScaleContext) => {
              const index = context && (context as any).tick && typeof (context as any).tick.index === "number" ? (context as any).tick.index : 0;
              return (grosseursDePoliceDesLibellés[index] as any) ?? "normal";
            }
          },
          padding: 10,
        },
        border: {
          display: false
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
        max: borneMaximale,
        min: borneMinimale,
      },
    },
  };
}

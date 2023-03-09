import { ChartData } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";

type Stack = { label?: string; data: number[]; backgroundColor: string[]; isError: boolean[] };

function useChartData(charts: HistogrammeData[]) {
  const [chartsData, setChartsData] = useState(charts);
  useEffect(() => setChartsData(charts), charts);

  return {
    histogrammes: chartsData.map((chartData) => ({
      transcriptionTitles: chartData.transcriptionTitles,
      chartData: chartData.chartData,
      optionsHistogramme: chartData.optionsHistogramme,
      legendColors: chartData.legendColors,
      labels: chartData.labels,
      transcriptionsValeurs: chartData.transcriptionValeurs,
      nom: chartData.nom,
      areStacksVisible: chartData.areStacksVisible,
    })),
    toggleStackVisibility: (stackIndex: number) => {
      setChartsData((chartsData): HistogrammeData[] => {
        chartsData.forEach((chart) => chart.toggleStack(stackIndex));
        return [chartsData[0], chartsData[1]];
      });
    },
  };
}

export class HistogrammeData {
  couleurIdentifiant = "#000";
  public areStacksVisible: boolean[];
  constructor(public labels: string[], private totals: number[], private stacks: Stack[], public nom: string, private aspectRatio = 2) {
    this.areStacksVisible = new Array(stacks.length).fill(true);
  }

  public get chartData(): ChartData {
    return {
      labels: this.labels,
      datasets: this.visibleStacks.map((stack) => {
        return {
          ...stack,
          borderWidth: { top: 0, bottom: 0, left: 0, right: 2 },
          borderColor: "white",
          backgroundColor: this.stackBackgroundColor(stack),
          data: stack.data.map(Math.abs),
          maxBarThickness: 60,
          datalabels: {
            font: { weight: "bold" },
            labels: {
              title: { color: this.labelsColor },
            },
          },
        };
      }),
    };
  }

  private couleurErreur = "#C9191E";

  public get visibleStacks(): Stack[] {
    return this.stacks.filter((_, index) => this.areStacksVisible[index]);
  }

  private get labelsColor(): string[] {
    const isLabelsError = this.visibleStacks
      .map((stack) => stack.isError)
      .reduce((isLabelInError, isErrorStack) => {
        return isLabelInError.map((isError, index) => isError || isErrorStack[index]);
      });
    return isLabelsError.map((error) => (error ? this.couleurErreur : this.couleurIdentifiant));
  }

  private stackBackgroundColor(stack: Stack) {
    return stack.isError.map((error, index) => (error ? this.couleurErreur : stack.backgroundColor[index]));
  }

  public get transcriptionTitles(): string[] {
    const stackLabels = this.stacks.map((stack) => stack.label) as string[];
    return stackLabels.length > 1 ? [...stackLabels, this.nom] : stackLabels;
  }

  public get transcriptionValeurs(): string[][] {
    const stacksValues = this.stacks.map((stack) => stack.data.map(StringFormater.formateLeMontantEnEuros));
    const totalsEuros = this.totals.map(StringFormater.formateLeMontantEnEuros);
    return stacksValues.length > 1 ? [...stacksValues, totalsEuros] : stacksValues;
  }

  public get legendColors(): string[] {
    return this.stacks.map((stack) => stack.backgroundColor[0]);
  }

  public get legendId(): string {
    return this.nom + "-legend";
  }

  public toggleStack(index: number) {
    this.areStacksVisible[index] = !this.areStacksVisible[index];
  }

  public get optionsHistogramme() {
    const couleurIdentifiant = "#000";
    const couleurDelAbscisse = "#161616";
    const valeurMax = Math.max(...this.totals.map(Math.abs));

    return {
      animation: false,
      aspectRatio: this.aspectRatio,
      indexAxis: "y",
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          max: 1.45 * (valeurMax > 0 ? valeurMax : 1),
          stacked: true,
          min: 0,
          position: "top",
          ticks: { display: false },
          title: { align: "start", color: couleurIdentifiant, display: this.nom !== "", font: { weight: "bold" }, text: this.nom },
        },
        y: {
          stacked: true,
          grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
          ticks: { color: couleurDelAbscisse, font: { weight: ["400"] }, padding: 8 },
        },
      },
      plugins: {
        htmlLegend: { containerID: this.legendId },
        datalabels: {
          align: "end",
          anchor: "end",
          font: { family: "Marianne", size: 14 },
          formatter: (_: number, _context: Context): string => {
            const hasMultipleStacks = this.visibleStacks.length > 1;
            const sum = hasMultipleStacks ? this.totals[_context.dataIndex] : this.visibleStacks[0].data[_context.dataIndex];
            const isLastStack = _context.datasetIndex === _context.chart.data.datasets.length - 1;
            return isLastStack ? StringFormater.formateLeMontantEnEuros(sum) : "";
          },
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };
  }
}

type HistogrammeHorizontalNewProps = {
  nom: string;
  valeursDeGauche: HistogrammeData;
  valeursDeDroite: HistogrammeData;
  annéesManquantes: number[] | string[];
  nombreDAnnéeTotale: number;
  légendes?: string[];
};
export const DeuxHistogrammesHorizontaux = ({
  nom,
  valeursDeGauche,
  valeursDeDroite,
  annéesManquantes,
  nombreDAnnéeTotale = 5,
  légendes,
}: HistogrammeHorizontalNewProps): ReactElement => {
  const { wording } = useDependencies();
  const { histogrammes, toggleStackVisibility } = useChartData([valeursDeGauche, valeursDeDroite]);

  function transcriptionTitles(): string[] {
    return histogrammes.map((histogramme) => histogramme.transcriptionTitles).flat() as string[];
  }

  function getTranscriptionValeurs() {
    return histogrammes.flatMap((histogramme) => histogramme.transcriptionsValeurs);
  }

  return (
    <>
      {annéesManquantes.length < nombreDAnnéeTotale && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 50%)",
            marginBottom: "3rem",
          }}
        >
          {histogrammes.map((histogramme) => (
            <div key={histogramme.nom}>
              {/*
                 // @ts-ignore */}
              <Bar data={histogramme.chartData} options={histogramme.optionsHistogramme} />
            </div>
          ))}
        </div>
      )}
      {légendes && (
        <LegendeDeuxHistogrammes
          areStacksVisible={histogrammes[0].areStacksVisible}
          color={histogrammes[0].legendColors}
          legends={légendes}
          toggleStackVisibility={toggleStackVisibility}
        />
      )}
      {annéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(", ")}`}</MiseEnExergue>}
      <Transcription
        disabled={annéesManquantes.length === nombreDAnnéeTotale}
        entêteLibellé={nom}
        identifiantUnique={nom}
        identifiants={transcriptionTitles()}
        libellés={histogrammes[0].labels}
        valeurs={getTranscriptionValeurs()}
      />
    </>
  );
};

function LegendeDeuxHistogrammes({
  legends,
  color,
  toggleStackVisibility,
  areStacksVisible,
}: {
  legends: string[];
  color: string[];
  toggleStackVisibility: (index: number) => void;
  areStacksVisible: boolean[];
}) {
  return (
    <div aria-hidden="true" className="fr-checkbox-group " style={{ display: "flex", marginLeft: "2rem", marginBottom: "2rem" }}>
      {legends.map((légende, index) => (
        <div className="fr-mr-5w" key={légende}>
          <input
            checked={areStacksVisible[index]}
            id={"checkboxes-" + légende}
            name={"checkboxes-" + légende}
            onChange={() => toggleStackVisibility(index)}
            type="checkbox"
          />
          <label className="fr-label" htmlFor={"checkboxes-" + légende} id={"checkboxes-" + légende}>
            <span style={{ background: color[index], borderRadius: "50%", width: "0.8rem", marginRight: "0.25rem", height: "0.8rem" }}>&nbsp;</span>
            {légende}
          </label>
        </div>
      ))}
    </div>
  );
}

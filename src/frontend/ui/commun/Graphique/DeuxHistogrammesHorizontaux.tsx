import { ChartData } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";

type Stack = { label?: string; data: number[]; backgroundColor: string[]; isError: boolean[] };

function useHistogrammeData(histogramme: HistogrammeData) {
  const [histogrammeData, setHistogrammeData] = useState(histogramme);
  useEffect(() => setHistogrammeData(histogramme), [histogramme]);
  console.log("new histo :", histogrammeData.chartData.datasets.length);

  return {
    transcriptionTitles: histogrammeData.transcriptionTitles,
    chartData: histogrammeData.chartData,
    optionsHistogramme: histogrammeData.optionsHistogramme,
    legendColors: histogrammeData.legendColors,
    labels: histogrammeData.labels,
    transcriptionsValeurs: histogrammeData.transcriptionValeurs,
    toggleStackVisibility: (stackIndex: number) => {
      setHistogrammeData((histogrammeData): HistogrammeData => {
        const updatedHistogrammeData = histogrammeData.clone();
        updatedHistogrammeData.toggleStack(stackIndex);
        return updatedHistogrammeData;
      });
    },
  };
}

export class HistogrammeData {
  couleurIdentifiant = "#000";
  public areStacksVisible: any[];
  constructor(public labels: string[], private totals: number[], private stacks: Stack[], private nom: string, private aspectRatio = 2) {
    this.areStacksVisible = new Array(stacks.length).fill(true);
  }

  public clone(): HistogrammeData {
    const clone = new HistogrammeData(this.labels, this.totals, this.stacks, this.nom, this.aspectRatio);
    clone.areStacksVisible = this.areStacksVisible;
    return clone;
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
          barThickness: 25,
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
  const gauche = useHistogrammeData(valeursDeGauche);
  const droite = useHistogrammeData(valeursDeDroite);

  function transcriptionTitles(): string[] {
    return [gauche.transcriptionTitles, droite.transcriptionTitles].flat() as string[];
  }

  function getTranscriptionValeurs() {
    return [...gauche.transcriptionsValeurs, ...droite.transcriptionsValeurs];
  }

  function toggleStackVisibility(stackIndex: number) {
    gauche.toggleStackVisibility(stackIndex);
    droite.toggleStackVisibility(stackIndex);
  }

  return (
    <>
      {annéesManquantes.length < nombreDAnnéeTotale && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 50%)",
          }}
        >
          <div>
            {/*
           // @ts-ignore */}
            <Bar data={gauche.chartData} options={gauche.optionsHistogramme} />
          </div>
          <div>
            {/*
          // @ts-ignore */}
            <Bar data={droite.chartData} options={droite.optionsHistogramme} />
          </div>
        </div>
      )}
      {annéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(", ")}`}</MiseEnExergue>}
      {légendes && <LegendeDeuxHistogrammes color={gauche.legendColors} legends={légendes} toggleStackVisibility={toggleStackVisibility} />}
      <Transcription
        disabled={annéesManquantes.length === nombreDAnnéeTotale}
        entêteLibellé={nom}
        identifiantUnique={nom}
        identifiants={transcriptionTitles()}
        libellés={droite.labels}
        valeurs={getTranscriptionValeurs()}
      />
    </>
  );
};

function LegendeDeuxHistogrammes({
  legends,
  color,
  toggleStackVisibility,
}: {
  legends: string[];
  color: string[];
  toggleStackVisibility: (index: number) => void;
}) {
  return (
    <div
      aria-hidden="true"
      className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]}
      style={{ justifyContent: "center", display: "flex" }}
    >
      {legends.map((légende, index) => (
        <>
          <input
            defaultChecked={true}
            id={"checkboxes-" + légende}
            key={légende}
            name={"checkboxes-" + légende}
            onChange={() => toggleStackVisibility(index)}
            type="checkbox"
          />
          <label className="fr-label" htmlFor={"checkboxes-" + légende} id={"checkboxes-" + légende} style={{ background: color[index] }}>
            {légende}
          </label>
        </>
      ))}
    </div>
  );
}

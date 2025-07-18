import { ChartData } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import { couleurDelAbscisse, couleurErreur, couleurIdentifiant } from "./couleursGraphique";
import styles from "./HistogrammeHorizontaux.module.css";

type Stack = { label?: string; data: number[]; backgroundColor: string[]; isError?: boolean[] };

function useChartData(charts: HistogrammeWithToggleData[]) {
  const [chartsData, setChartsData] = useState(charts);
  useEffect(() => setChartsData(charts), chartsData);

  return {
    histogrammes: chartsData.map((chartData) => ({
      chartData: chartData.chartData,
      optionsHistogramme: chartData.optionsHistogramme,
      legendColors: chartData.legendColors,
      labels: chartData?.labels,
      nom: chartData.nom,
      areStacksVisible: chartData.areStacksVisible,
    })),
    toggleStackVisibility: (stackIndex: number, isVisible: boolean) => {
      setChartsData((chartsData): HistogrammeWithToggleData[] => {
        chartsData.forEach((chart) => chart.toggleStack(stackIndex, isVisible));
        return [chartsData[0]];
      });
    },
  };
}

export class HistogrammeWithToggleData {
  public areStacksVisible: boolean[];

  /**
   *
   * @param nom Nom du graphique qui apparaitra au-dessus du graphique
   * @param labels Liste des libellés correspondant à chaque bar
   * @param totals Liste des nombres affichées après chaque bar (si une seule Stack le total correspond aux valeurs de la stack, si plusieurs stack on peut faire la somme de chaque stack)
   * @param stacks Liste des Stack du graphique. La notion de Stack correspond à ChartJS (empilement de plusieurs barre sur une même ligne).
   * Chaque Stack définit sa liste de valeur pour chaque Bar, la couleur et le fait d'être en erreur ou pas.
   * Un graphique n'ayant pas plusieurs Stack est géré comme un graphique avec plusieurs stack mais il n'aura qu'un seul élément dans Stack.
   * @param valueFormatter Une fonction qui sera appliquée à la valeur numérique pour l'afficher dans le format attendu selon l'usage.
   */
  constructor(
    public nom: string,
    public labels: string[],
    private totals: number[],
    private stacks: Stack[],
    private valueFormatter: (value: number) => string = (value) => value?.toString()
  ) {
    this.areStacksVisible = this.makeAllStacksVisible(stacks);
    this.setDefaultErrorStatut();
  }

  private setDefaultErrorStatut() {
    this.stacks.forEach((stack) => {
      if (!stack.isError) {
        stack.isError = new Array(stack.data.length).fill(false);
      }
    });
  }

  private makeAllStacksVisible(stacks: Stack[]): boolean[] {
    return new Array(stacks.length).fill(true);
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
          maxBarThickness: 35,
          datalabels: {
            labels: {
              title: { color: this.labelsColor },
            },
          },
        };
      }),
    };
  }

  public get visibleStacks(): Stack[] {
    return this.stacks.filter((_, index) => this.areStacksVisible[index]);
  }

  private get labelsColor(): string[] {
    const stackErrors = this.visibleStacks
      .map((stack) => stack.isError as boolean[]);
    const defaultArraySize = stackErrors[0].length;

    const isLabelsError = stackErrors.reduce((isLabelInError, isErrorStack) => {
      return isLabelInError.map((isError, index) => isError || isErrorStack[index]);
    }, Array(defaultArraySize).fill(false));

    return isLabelsError.map((error) => (error ? couleurErreur : couleurIdentifiant));
  }

  private stackBackgroundColor(stack: Stack) {
    return (stack.isError as boolean[]).map((error, index) => (error ? couleurErreur : stack.backgroundColor[index]));
  }

  public get legendColors(): string[] {
    return this.stacks.map((stack) => stack.backgroundColor[0]);
  }

  public get legendId(): string {
    return this.nom + "-legend";
  }

  public toggleStack(index: number, isVisible: boolean) {
    this.areStacksVisible[index] = isVisible;
  }

  public get optionsHistogramme() {
    const valeurMax = Math.max(...this.totals.map(Math.abs));

    return {
      maintainAspectRatio: false,
      animation: false,
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
          font: { family: "Marianne", size: 12, weight: "700" },
          formatter: (_: number, _context: Context): string => {
            const hasMultipleStacks = this.visibleStacks.length > 1;
            const sum = hasMultipleStacks ? this.totals[_context.dataIndex] : this.visibleStacks[0].data[_context.dataIndex];
            const isLastStack = _context.datasetIndex === _context.chart.data.datasets.length - 1;
            return isLastStack ? this.valueFormatter(sum) : "";
          },
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };
  }
}

type HistogrammeHorizontalWithToggleNewProps = {
  valeursDesHistogrammes: HistogrammeWithToggleData[];
  légende?: string[];
  epaisseur?: "FIN" | "EPAIS";
  filterEventsEIGS: (index: number, isVisible: boolean) => void;
};
export const HistogrammeHorizontalWithToggle = ({
  valeursDesHistogrammes,
  légende,
  epaisseur = "EPAIS",
  filterEventsEIGS,
}: HistogrammeHorizontalWithToggleNewProps): ReactElement => {
  const { histogrammes, toggleStackVisibility } = useChartData(valeursDesHistogrammes);

  const ASPECT_RATIO = epaisseur === "EPAIS" ? 5 : 7;
  const aspectRatio = ASPECT_RATIO / valeursDesHistogrammes.length;

  return (
    <>
      <div>
        {histogrammes.map((histogramme) => (
          <div className={styles["barWithToggleWidth"]} key={histogramme.nom}>
            {/*
                 // @ts-ignore */}
            <Bar data={histogramme.chartData} options={{ ...histogramme.optionsHistogramme, aspectRatio }} />
          </div>
        ))}
      </div>
      {légende && (
        <LegendeHistogrammes
          areStacksVisible={histogrammes[0].areStacksVisible}
          color={histogrammes[0].legendColors}
          filterEventsEIGS={filterEventsEIGS}
          legend={légende}
          toggleStackVisibility={toggleStackVisibility}
        />
      )}
    </>
  );
};

function LegendeHistogrammes({
  legend,
  color,
  toggleStackVisibility,
  areStacksVisible,
  filterEventsEIGS,
}: {
  legend: string[];
  color: string[];
  toggleStackVisibility: (index: number, isVisible: boolean) => void;
  areStacksVisible: boolean[];
  filterEventsEIGS: (index: number, isVisible: boolean) => void;
}) {
  const onChangeToggleVisibility = (index: number, isVisible: boolean) => {
    filterEventsEIGS(index, isVisible);
    toggleStackVisibility(index, isVisible);
  };

  return (
    <div aria-hidden="true" className="fr-checkbox-group " style={{ display: "flex", marginLeft: "2rem", marginBottom: "2rem" }}>
      {legend.map((légende, index) => (
        <div className="fr-mr-5w" key={légende}>
          <input
            checked={areStacksVisible[index]}
            id={"checkboxes-" + légende}
            name={"checkboxes-" + légende}
            onChange={(event) => onChangeToggleVisibility(index, event.target.checked)}
            type="checkbox"
          />
          <label className="fr-label" htmlFor={"checkboxes-" + légende}>
            <span style={{ background: color[index], borderRadius: "50%", width: "0.8rem", marginRight: "0.25rem", height: "0.8rem" }}>&nbsp;</span>
            {légende}
          </label>
        </div>
      ))}
    </div>
  );
}

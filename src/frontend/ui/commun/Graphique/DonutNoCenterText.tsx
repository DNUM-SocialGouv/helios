import { ArcElement, Chart as ChartJS, ChartOptions, DoughnutController, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

import { CouleurHistogramme } from "./couleursGraphique";
import styles from "./DonutNoCenterText.module.css";
import { construisLePluginDeLaLegendeDonut } from "./LegendPluginDonutNoCenterText";

ChartJS.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  construisLePluginDeLaLegendeDonut(),
  ChartDataLabels
);

export function DonutNoCenterText(props: {
  title?: string;
  valeurs: number[];
  libellés: string[];
  couleursDuDoughnut: CouleurHistogramme[];
  couleursLibelle: string[];
  total: number;
  idDeLaLégende: string;
}): JSX.Element {
  const data = {
    datasets: [
      {
        label: "",
        backgroundColor: props.couleursDuDoughnut.map((couleur) => couleur.premierPlan),
        data: props.valeurs,
        hoverBackgroundColor: props.couleursDuDoughnut.map((couleur) => couleur.premierPlan),
      },
    ],
    hoverOffset: 50,
    labels: props.libellés,
  };

  return (
    <>
      {props.title && <div className={styles["repBigTitleDonut"]}>{props.title}</div>}

      <div className={styles["donut-wrapper"]}>
        <div>
          <Doughnut
            data={data}
            options={optionsDiagrammeDoughnut(props.idDeLaLégende, props.libellés)}
            plugins={[construisLePluginDeLaLegendeDonut()]}
          />
        </div>
        <menu className={styles["légende-donut"]} id={props.idDeLaLégende} />
      </div>
    </>
  );
}

function optionsDiagrammeDoughnut(idDeLaLégende: string, libellés: string[]): ChartOptions<"doughnut"> {
  return {
    cutout: "40%",
    plugins: {
      datalabels: {
        display: () => {
          return false;
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = libellés[context.dataIndex];
            return label;
          }
        }
      },
      // @ts-ignore
      htmlLegend: { containerID: idDeLaLégende },
      legend: { display: false },
    },
    responsive: true,
  };
}

export const couleurDesArcsDuDonut = {
  opaque: ["#6a6af4", "#000091", "#9898f8", "#aeaef9", "#2323ff", "#cbcbfa", "#a1a1f8", "#313178", "#5757ad", "#6c6cbb", "#4a4a7d", "#5e5e90", "#272747", "#518fff", "#273961", "#0078f3", "#b1c6ff", "#95b4ff", "#f4f6ff", "#dde5ff"],

  transparent: [
    "rgba(22, 29, 55, 0.1)",
    "rgba(22, 29, 56, 0.1)",
    "rgba(22, 29, 57, 0.1)",
    "rgba(22, 29, 58, 0.1)",
    "rgba(22, 29, 59, 0.1)",
    "rgba(22, 29, 60, 0.1)",
  ],
};

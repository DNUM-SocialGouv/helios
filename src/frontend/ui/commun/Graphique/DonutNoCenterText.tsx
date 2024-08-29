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

export const getRandomBlueShade = (toGenerate: number): string[] => {
  const colors = new Set<string>();

  while (colors.size < toGenerate) {
    const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const color = `#0000${blue}`;
    colors.add(color);
  }

  return Array.from(colors);
}

export const couleurDesArcsDuDonut = (length: number) => {
  return {
    opaque: getRandomBlueShade(length),

    transparent: [
      "rgba(22, 29, 55, 0.1)",
      "rgba(22, 29, 56, 0.1)",
      "rgba(22, 29, 57, 0.1)",
      "rgba(22, 29, 58, 0.1)",
      "rgba(22, 29, 59, 0.1)",
      "rgba(22, 29, 60, 0.1)",
    ],
  }
};

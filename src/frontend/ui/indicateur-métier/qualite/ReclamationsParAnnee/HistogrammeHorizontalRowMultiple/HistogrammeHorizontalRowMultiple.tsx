import { Bar } from "react-chartjs-2";

import { CouleurHistogramme } from "../../../../commun/Graphique/couleursGraphique";
import styles from "./HistogrammeHorizontalRowMultiple.module.css";


export const colorsAllocations: CouleurHistogramme[] = [
  { premierPlan: "#6a6af4" },
  { premierPlan: "#000091" },
  { premierPlan: "#9898f8" },
  { premierPlan: "#aeaef9" },
  { premierPlan: "#2323ff" },
  { premierPlan: "#cbcbfa" },
  { premierPlan: "#a1a1f8" },
  { premierPlan: "#313178" },
  { premierPlan: "#5757ad" },
  { premierPlan: "#6c6cbb" },
  { premierPlan: "#4a4a7d" },
  { premierPlan: "#5e5e90" },
  { premierPlan: "#272747" },
  { premierPlan: "#518fff" },
  { premierPlan: "#273961" },
  { premierPlan: "#0078f3" },
  { premierPlan: "#b1c6ff" },
  { premierPlan: "#95b4ff" },
  { premierPlan: "#f4f6ff" },
  { premierPlan: "#dde5ff" },
];

type HistogrammeHorizontalRowMultipleProps = Readonly<{
  data: {
    key: string;
    value: number;
  }[];
}>;

export const HistogrammeHorizontalRowMultiple = ({ data }: HistogrammeHorizontalRowMultipleProps) => {
  const dataTest = {
    labels: [''],
    datasets: data.map((elt, index) => {
      return {
        label: '',
        data: [elt.value],
        backgroundColor: colorsAllocations[index].premierPlan,
        borderWidth: 0
      }
    })
  };
  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        stacked: true,
        display: false
      }
    },
    plugins: {
      legend: {
        display: false // Hide legend
      }
    },
    aspectRatio: 8,
    tooltips: {
      enabled: false // Disable tooltips completely
    }
  };
  return (
    <div className={styles["histogramme_horizontal_row_container"]}>
      <Bar data={dataTest} options={options} />
    </div>
  )
};

import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

import styles from "./GraphiqueLine.module.css";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { Transcription } from "../../../commun/Transcription/Transcription";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title);

interface MonthYear {
  mois: number;
  annee: number;
}

export interface EffectifsData {
  dataFiliere: number[];
  dataEtab: number[];
  dataMoisAnnee: MonthYear[];
}
export interface CategorieData {
  categorie: string;
  data: EffectifsData;
}

interface LineChartProps {
  classContainer: string;
  categorieName: string;
  couleurCategorie: string;
  couleurEffectifsTottaux: string;
  dataEffectifs: EffectifsData;
}

const LineChart = ({ classContainer, categorieName, couleurCategorie, couleurEffectifsTottaux, dataEffectifs }: LineChartProps) => {

  const { wording } = useDependencies();

  const gtidColor = "#c8c8c880" // gris

  const moisNoms = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const labels = new Array(36).fill(""); // Labels vides

  const labelsTranscription = dataEffectifs.dataMoisAnnee?.map((monthYear) => {
    const mois = moisNoms[monthYear.mois - 1];
    const annee = monthYear.annee;
    return `${mois} ${annee}`;
  });

  const getCategorieName = () => {
    if (categorieName && categorieName.length > 0) {
      return `${categorieName.charAt(0).toUpperCase() + categorieName.slice(1)}`;
    }
    return "";
  }

  const data = {
    labels,
    datasets: [
      {
        data: dataEffectifs.dataFiliere,
        borderColor: couleurCategorie,
        backgroundColor: couleurCategorie,
        borderWidth: 3,
        fill: false,
        pointRadius: 0,
      },
      {
        data: dataEffectifs.dataEtab,
        borderColor: couleurEffectifsTottaux,
        backgroundColor: couleurEffectifsTottaux,
        borderWidth: 3,
        fill: false,
        pointRadius: 0,
      }
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,  // Désactive le saut automatique des labels
          maxRotation: 0,   // Empêche l'inclinaison des labels
          minRotation: 0,   // Force l'affichage horizontal des labels
          color: "#000",
          callback: function (_value: any, index: number): string | number {
            const entry = dataEffectifs?.dataMoisAnnee?.[index];
            const mois = entry?.mois ?? null;
            const annee = entry?.annee ?? null;
            return mois === 1 ? annee : "";
          },
        },
        grid: {
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: function (context: any) {
            // Afficher la ligne verticale uniquement pour janvier
            return context.tick && context.tick.label !== "" ? gtidColor : "transparent";
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: gtidColor,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const moisAnnee = dataEffectifs.dataMoisAnnee[index];
            const moisNom = moisAnnee ? moisNoms[moisAnnee.mois - 1] : "N/A";
            const xValue = moisAnnee ? `${moisNom} ${moisAnnee.annee}` : "N/A";
            const yValue = tooltipItem.raw;

            return ` ${xValue} : ${yValue}`;
          }
        }
      },
      legend: { display: false },
      datalabels: { display: false },
    },
  };
  return (
    <div className={`${classContainer} `}  >
      <div className={`${styles["chartLineDiv"]}`} style={{}} >
        <div className={`${styles["chartLineDiv"]} ${styles["chartLineHeader"]}`}>
          {getCategorieName()}
        </div>
        <div className={`${styles["chartLineDiv"]} ${styles["chartLineBody"]}`} >
          {process.env.NODE_ENV !== 'test' && <Line data={data} options={options} />}
        </div>
        <Transcription
          disabled={false}
          entêteLibellé={wording.MOIS_ANNEES}
          identifiants={[getCategorieName(), wording.EFFECTIFS_TOTAUX]}
          libellés={labelsTranscription}
          valeurs={[dataEffectifs.dataFiliere, dataEffectifs.dataEtab]}
        />
      </div>
    </div>
  );
};

export default LineChart;

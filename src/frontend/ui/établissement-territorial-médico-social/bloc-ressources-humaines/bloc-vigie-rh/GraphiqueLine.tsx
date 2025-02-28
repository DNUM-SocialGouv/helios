import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

import styles from "./GraphiqueLine.module.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title);

interface MonthYear {
    mois: number;
    annee: number;
}

interface EffectifsData {
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
    borderRight?: boolean;
    dataEffectifs: EffectifsData;
}

const LineChart = ({ classContainer, categorieName, borderRight = false, dataEffectifs}: LineChartProps) => {
    const gtidColor = "#c8c8c880" // gris
    const line1Color = "#FB926B"  // orange
    const line2Color = "#E2CF58"  // jaune

    const labels = new Array(36).fill(""); // Labels vides

    const data = {
        labels,
        datasets: [
            {
                label: " Catégorie",
                data: dataEffectifs.dataFiliere,
                borderColor: line1Color,
                backgroundColor: line1Color,
                borderWidth: 3,
                fill: false,
                pointRadius: 0,
            },
            {
                label: " Effectifs totaux",
                data: dataEffectifs.dataEtab,
                borderColor: line2Color,
                backgroundColor: line2Color,
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
            tooltip: { enabled: true },
            legend: { display: false },
            datalabels: { display: false },
        },
    };
    return (
        <div className={`${classContainer} `}  >
            <div className={`${styles["chartLineDiv"]} ${borderRight ? styles["borderRight"] : ''} `}  style={{  }} >
                <div className={`${styles["chartLineDiv"]} ${styles["chartLineHeader"]}`}>
                    {categorieName}
                </div>
                <div className={`${styles["chartLineDiv"]} ${styles["chartLineBody"]}`} >
                    <Line data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default LineChart;

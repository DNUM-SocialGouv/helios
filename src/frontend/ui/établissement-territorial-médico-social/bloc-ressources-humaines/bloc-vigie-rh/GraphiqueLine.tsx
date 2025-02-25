import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title } from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import styles from "./GraphiqueLine.module.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title);

interface LineChartProps {
    classContainer: string;
    categorieName: string;
    borderRight?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ classContainer, categorieName, borderRight = false }) => {
    const gtidColor = "#c8c8c880" // gris
    const line1Color = "#FB926B"  // orange
    const line2Color = "#E2CF58"  // jaune

    const labels = new Array(36).fill(""); // Labels vides

    const data1 = [
        20, 25, 22, 30, 35, 40, 45, 50, 55, 50, 45, 40,
        35, 30, 28, 26, 25, 24, 23, 22, 21, 25, 30, 35,
        40, 45, 50, 55, 60, 62, 65, 70, 75, 80, 85, 90
    ];
    const data2 = [
        15, 18, 20, 22, 25, 28, 30, 35, 38, 36, 34, 32,
        30, 28, 27, 26, 24, 22, 20, 18, 16, 20, 22, 25,
        28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50
    ];
    const dataMonth = [
        { month: 10, year: 2020 }, { month: 11, year: 2020 }, { month: 12, year: 2020 },


        { month: 1, year: 2021 }, { month: 2, year: 2021 }, { month: 3, year: 2021 },
        { month: 4, year: 2021 }, { month: 5, year: 2021 }, { month: 6, year: 2021 },
        { month: 7, year: 2021 }, { month: 8, year: 2021 }, { month: 9, year: 2021 },
        { month: 10, year: 2021 }, { month: 11, year: 2021 }, { month: 12, year: 2021 },


        { month: 1, year: 2022 }, { month: 2, year: 2022 }, { month: 3, year: 2022 },
        { month: 4, year: 2022 }, { month: 5, year: 2022 }, { month: 6, year: 2022 },
        { month: 7, year: 2022 }, { month: 8, year: 2022 }, { month: 9, year: 2022 },
        { month: 10, year: 2022 }, { month: 11, year: 2022 }, { month: 12, year: 2022 },


        { month: 1, year: 2023 }, { month: 2, year: 2023 }, { month: 3, year: 2023 },
        { month: 4, year: 2023 }, { month: 5, year: 2023 }, { month: 6, year: 2023 },
        { month: 7, year: 2023 }, { month: 8, year: 2023 }, { month: 9, year: 2023 },
    ];

    const data = {
        labels,
        datasets: [
            {
                label: " Catégorie",
                data: data1,
                borderColor: line1Color,
                backgroundColor: line1Color,
                borderWidth: 3,
                fill: false,
                pointRadius: 0,
            },
            {
                label: " Effectifs totaux",
                data: data2,
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
                        const { month, year } = dataMonth[index];
                        return month === 1 ? year : "";
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

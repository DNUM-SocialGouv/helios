import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title);

const LineChart = () => {
    const labels = new Array(36).fill(""); // Labels vides
    const beginYear = 2022

    // Données fixes (remplace par tes propres valeurs)
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

    const data = {
        labels,
        datasets: [
            {
                label: "Catégorie",
                data: data1,
                borderColor: "red",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                fill: false,
                pointRadius: 1,
            },
            {
                label: "Effectifs totaux",
                data: data2,
                borderColor: "green",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                fill: false,
                pointRadius: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: {
                ticks: {
                    callback: function (value, index) {
                        // Afficher uniquement l'année pour chaque mois de janvier
                        return index % 12 === 0 ? beginYear + Math.floor(index / 12) : "";
                    },
                    color: "#000",
                    font: { weight: "bold" },
                    rotation: 0, // Force l'affichage horizontal
                },
                grid: { 
                    drawBorder: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: function (context) {
                        // Afficher la ligne verticale uniquement pour janvier
                        return context.tick && context.tick.label !== "" ? "rgba(200, 200, 200, 0.5)" : "transparent";
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: { 
                    drawBorder: true, 
                    drawOnChartArea: true, 
                    drawTicks: true,
                    color: "rgba(200, 200, 200, 0.5)",
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
        <div style={{ width: "80%", height: "400px", margin: "auto" }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;

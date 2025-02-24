import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title);

const LineChart = () => {
    const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];

    const data = {
        labels,
        datasets: [
            {
                data: [20, 40, 35, 55, 75, 85],
                borderColor: "red",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                fill: false,
                pointRadius: 2,
            },
            {
                data: [10, 30, 45, 50, 65, 70],
                borderColor: "green",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                fill: false,
                pointRadius: 2,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
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

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

const PyramidChart = () => {
    const labels = ["80+", "70-79", "60-69", "50-59", "40-49", "30-39", "20-29", "10-19", "0-9"];

    const menData = {
        labels,
        datasets: [
            {
                label: "Men",
                data: [5, 8, 12, 15, 18, 20, 22, 19, 14],
                backgroundColor: "rgba(251,146,107,255)",
            },
        ],
    };

    const womenData = {
        labels,
        datasets: [
            {
                label: "Women",
                data: [6, 9, 13, 16, 19, 21, 23, 20, 15],
                backgroundColor: "rgba(226,207,88,255)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: "y",
        scales: {
            x: {
                ticks: {
                    display: false,
                },
                position: "top",
                grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
                barPercentage: 1,
            },
            y: {
                ticks: {
                    color: '#000',
                    autoSkip: false
                },
                grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                barThickness: 35,
            },
        },
        plugins: {
            tooltip: {
                enabled: false
            },
            datalabels: {
                display: true,
                anchor: "start",
                align: "start",
                color: "#000",
                font: { weight: "bold" },
            },
            legend: { display: false }
        },
    };


    return (
        <div className="fr-grid-row">
            <div className="fr-col-6">
                <Bar
                    data={menData}
                    options={{
                        ...options,
                        scales: {
                            ...options.scales,
                            // @ts-ignore
                            x: {
                                ...options.scales.x,
                                reverse: true,
                                title: { align: "center", color: "#000", display: true, font: { weight: "bold" }, text: "Hommes" },
                            },
                            y: { ...options.scales.y, ticks: { ...options.scales.y.ticks, color: 'white' } }
                        }
                    }} />
            </div>
            <div className="fr-col-6">

                <Bar
                    data={womenData}
                    options={{
                        ...options,
                        scales: {
                            ...options.scales,
                            // @ts-ignore 
                            x: { ...options.scales.x, title: { align: "center", color: "#000", display: true, font: { weight: "bold" }, text: "Femmes" } }
                        },
                        // @ts-ignore
                        plugins: { ...options.plugins, datalabels: { ...options.plugins.datalabels, anchor: "end", align: "end", } }
                    }} />
            </div>
        </div >
    );
};

export default PyramidChart;

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

const PyramidChart = () => {
    const labels = ["65+", "60-65", "55-60", "50-55", "45-50", "40-45", "35-40", "30-35", "25-30", "20-25", "15-20"];
    const refColor = "#929292";

    const menValues = [3, 6, 10, 12, 20, 20, 20, 17, 12, 11, 20];
    const menDataValues = [5, 8, 12, 15, 18, 20, 22, 19, 14, 20, 25];
    const womenValues = [4, 7, 11, 14, 17, 30, 21, 18, 13, 14, 30];


    const womenDataValues = [6, 9, 13, 16, 19, 21, 23, 20, 15, 25, 23];

    const menExtension = menValues.map((val, idx) => Math.max(0, val - menDataValues[idx]));
    const womenExtension = womenValues.map((val, idx) => Math.max(0, val - womenDataValues[idx]));

    const menData: ChartData = {
        datasets: [
            {
                label: "Men",
                backgroundColor: "rgba(251,146,107,255)",
                data: menDataValues,
                yAxisID: "y"

            },
            {
                label: "Men Extension",
                backgroundColor: "rgba(255,249,235,255)",
                data: menExtension,
                yAxisID: "y"

            },
        ],
        labels: labels,
    };

    const womenData = {
        labels,
        datasets: [
            {
                label: "Women",
                data: womenDataValues,
                backgroundColor: "rgba(226,207,88,255)",
                yAxisID: "y"
            },
            {
                label: "Women Extension",
                data: womenExtension,
                backgroundColor: "rgba(255,249,235,255)",
                yAxisID: "y"
            },
        ],
    };

    // Custom Plugin for Vertical Lines
    const verticalLinePlugin = {
        id: "verticalLines",
        afterDraw(chart: any) {
            const { ctx, scales } = chart;
            const isMenChart = chart.data.datasets[0].label === "Men";

            const values = isMenChart ? menValues : womenValues;

            chart.getDatasetMeta(0).data.forEach((bar: any, index: number) => {
                const value = values[index];
                if (value === undefined) return;

                // Get x-position based on reference value
                const xScale = scales.x;
                const xPos = xScale.getPixelForValue(value);

                const yTop = bar.y - bar.height / 2;
                const yBottom = bar.y + bar.height / 2;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(xPos, yTop);
                ctx.lineTo(xPos, yBottom);
                ctx.strokeStyle = refColor;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            });
        },
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
                stacked: true,
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
                stacked: true,
            },
        },
        plugins: {
            tooltip: {
                enabled: true, // Active les tooltips
                callbacks: {
                    label: function (context: any) {
                        const index = context.dataIndex; // Index du groupe d'âge
                        const datasetLabel = context.dataset.label;

                        // Vérifier si c'est un graphique des hommes ou des femmes
                        const isMenChart = datasetLabel.toLowerCase().includes("men");

                        // Récupérer la valeur du référentiel
                        const refValue = isMenChart ? menValues[index] : womenValues[index];

                        return `Référentiel: ${refValue}`;
                    },
                    labelColor: function () {
                        return {
                            borderColor: refColor,
                            backgroundColor: refColor,
                        };
                    },
                },
            },
            datalabels: {
                display: (context: any) => {
                    // Afficher les labels uniquement pour les datasets principaux
                    return context.dataset.label === "Men" || context.dataset.label === "Women";
                },
                anchor: "end",
                color: "#000",
            },
            legend: { display: false },
            verticalLines: {},
        },
    };



    return (
        <div className="fr-grid-row" style={{ paddingRight: "50px", minHeight: "220px" }}>
            <div className="fr-col-6">
                <Bar
                    // @ts-ignore
                    data={menData}
                    options={{
                        ...options,
                        scales: {
                            ...options.scales,
                            // @ts-ignore
                            x: {
                                ...options.scales.x,
                                reverse: true,
                                title: {
                                    align: "center",
                                    color: "#000",
                                    display: true,
                                    font: { weight: "bold" },
                                    text: "Hommes",
                                },
                            },
                            y: { ...options.scales.y, ticks: { ...options.scales.y.ticks, color: "white" } },
                        },
                        plugins: {
                            ...options.plugins,
                            datalabels: {
                                ...options.plugins.datalabels,
                                anchor: "start",
                            }
                        }
                    }}
                    plugins={[verticalLinePlugin]}
                />
            </div>
            <div className="fr-col-6">
                <Bar
                    data={womenData}
                    options={{
                        ...options,
                        scales: {
                            ...options.scales,
                            // @ts-ignore
                            x: {
                                ...options.scales.x,
                                title: {
                                    align: "center",
                                    color: "#000",
                                    display: true,
                                    font: { weight: "bold" },
                                    text: "Femmes",
                                },
                            },
                        },
                    }}
                    plugins={[verticalLinePlugin]}
                />
            </div>
        </div>
    );
};

export default PyramidChart;
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { Transcription } from "../../../commun/Transcription/Transcription";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

type PyramidChartProps = Readonly<{
    labels: string[];
    effectifHomme: number[];
    effectifHommeRef: number[];
    effectifFemme: number[];
    effectifFemmeRef: number[];
}>;

const PyramidChart = ({ labels, effectifFemme, effectifFemmeRef, effectifHomme, effectifHommeRef }: PyramidChartProps) => {
    const refColor = "#929292";

    const { wording } = useDependencies();


    const menExtension = effectifHommeRef.map((val, idx) => Math.max(0, val - effectifHomme[idx]));
    const womenExtension = effectifFemmeRef.map((val, idx) => Math.max(0, val - effectifFemme[idx]));

    const menData: ChartData = {
        datasets: [
            {
                label: "Men",
                backgroundColor: "rgba(251,146,107,255)",
                data: effectifHomme,
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
                data: effectifFemme,
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

            const values = isMenChart ? effectifHommeRef : effectifFemmeRef;

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
                enabled: true,
                position: 'nearest',
                callbacks: {
                    label: function (context: any) {
                        const index = context.dataIndex; // Index du groupe d'âge
                        const datasetLabel = context.dataset.label;

                        // Vérifier si c'est un graphique des hommes ou des femmes
                        const isWomenChart = datasetLabel.toLowerCase().includes("women");

                        const value = isWomenChart ? effectifFemme[index] : effectifHomme[index];
                        const refValue = isWomenChart ? effectifFemmeRef[index] : effectifHommeRef[index];

                        return [`Valeur: ${value}`,
                        `Valeur de référence: ${refValue}`];
                    },
                },
            },
            datalabels: {
                display: (context: any) => {
                    // Afficher les labels uniquement pour les datasets principaux
                    return context.dataset.label === "Men" || context.dataset.label === "Women";
                },
                color: "#000",
            },
            legend: { display: false },
            verticalLines: {},
        },
    };



    return (
        <>
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
            <Transcription
                disabled={false}
                entêteLibellé={wording.TRANCHE_AGE}
                identifiants={[wording.EFFECTIF_HOMMES, wording.EFFECTIF_HOMMES_REF, wording.EFFECTIF_FEMMES, wording.EFFECTIF_FEMMES_REF]}
                libellés={labels}
                valeurs={[effectifHomme, effectifHommeRef, effectifFemme, effectifFemmeRef]}
            />
        </>
    );
};

export default PyramidChart;
import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { ChangeEvent, useCallback, useState } from "react";

import {
  NatureContratsAnnuel,
  NatureContratsTrimestriel,
} from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import { FrequencyFilter } from "../FrequencyFilter";
import styles from "./NatureContrats.module.css";
import { couleurDesTraitsRefHistogramme } from "../../../../commun/Graphique/couleursGraphique";
import { Bar } from "react-chartjs-2";
import { Context } from "chartjs-plugin-datalabels";

type GraphiqueNatureContratsProps = Readonly<{
  blocVigieRhViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueNatureContrats = ({ blocVigieRhViewModel }: GraphiqueNatureContratsProps) => {
  const { wording } = useDependencies();
  const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);
  const handleFrequency = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }, []);
  return (
    <div>
      <FrequencyFilter
        ListeFrquences={[wording.ANNUEL, wording.TRIMESTRIEL]}
        handleFrequency={handleFrequency}
        identifiant="frequency-filter-nature-contrats"
        selectedFrequency={selectedFrequency}
      />
      {selectedFrequency === wording.ANNUEL ? (
        <GraphiqueNatureContratsAnnuel donnees={blocVigieRhViewModel.natureContratsAnnuel} />
      ) : (
        <GraphiqueNatureContratsTrimestriel donnees={blocVigieRhViewModel.natureContratsTrimestriel} />
      )}
    </div>
  );
};

type GraphiqueNatureContratsAnnuelProps = Readonly<{
  donnees: NatureContratsAnnuel[];
}>;

type GraphiqueNatureContratsTrimestrielProps = Readonly<{
  donnees: NatureContratsTrimestriel[];
}>;

const GraphiqueNatureContratsAnnuel = ({ donnees }: GraphiqueNatureContratsAnnuelProps) => {
  return <HistogrammeComparaisonVerticalAvecRef donnees={donnees} />;
};

const GraphiqueNatureContratsTrimestriel = ({ donnees }: GraphiqueNatureContratsTrimestrielProps) => {
  return <></>;
};

type HistogrammeComparaisonVerticalAvecRefProps = Readonly<{
  donnees: DonneesHistogrammeVerticalGroupeAvecRef[];
}>;

type DonneesHistogrammeVerticalGroupeAvecRef = Readonly<{
  groupLabel: string;
  groupData: HistogrammeVerticalGroupeAvecRefData[];
  groupDataRef: HistogrammeVerticalGroupeAvecRefData[];
}>;

type HistogrammeVerticalGroupeAvecRefData = Readonly<{
  label: string;
  value: number;
}>;

const HistogrammeComparaisonVerticalAvecRef = ({ donnees }: HistogrammeComparaisonVerticalAvecRefProps) => {
  const rawData = [
    { annee: "2023", nature: "CDI", effectif: 20, effectif_ref: 20 },
    { annee: "2023", nature: "CDD", effectif: 23, effectif_ref: 30 },
    { annee: "2024", nature: "CDI", effectif: 4, effectif_ref: 40 },
    { annee: "2024", nature: "CDD", effectif: 24, effectif_ref: 50 },
    { annee: "2025", nature: "CDI", effectif: 5, effectif_ref: 60 },
    { annee: "2025", nature: "CDD", effectif: 25, effectif_ref: 70 },
  ];

  const data = {};

  const chartData: ChartData = {
    labels: Array.from(new Set(rawData.map((d) => d.annee))),
    datasets: [
      {
        label: "CDI",
        data: rawData.filter((d) => d.nature === "CDI").map((d) => d.effectif),
        datalabels: { labels: { title: { color: rawData.map(() => "#000") } } },
        backgroundColor: "rgba(234,170,6,0.6)",
        maxBarThickness: 60,
        type: "bar",
        stack: "stack-0",
      },
      {
        label: "CDD",
        data: rawData.filter((d) => d.nature === "CDD").map((d) => d.effectif),
        datalabels: { labels: { title: { color: rawData.map(() => "#000") } } },
        backgroundColor: "rgba(241,94,47,0.6)",
        maxBarThickness: 60,
        type: "bar",
        stack: "stack-1",
      }
    ],
  };
  const rotationRefPlugin = {
    id: "rotationRef",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      for (let i = 0; i < chart.data.datasets.length; i++) {
        if (chart.isDatasetVisible(i) && (i + 1) % 2 === 0) {
          chart.getDatasetMeta(i).data.forEach((bar: any, index: number) => {
            const valeurRef = chart.data.datasets[i].data[index] as number;
            if (valeurRef === undefined) return;
            const yScale = scales["y"];
            const yPos = yScale.getPixelForValue(valeurRef);
            const xLeft = bar.x - bar.width / 2;
            const xRight = bar.x + bar.width / 2;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(xLeft, yPos);
            ctx.lineTo(xRight, yPos);
            ctx.strokeStyle = couleurDesTraitsRefHistogramme;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
          });
        }
      }
    },
  };
  const chatConfig: ChartOptions<"bar"> = {
    maintainAspectRatio: true,
    animation: false,
    responsive: true,
    plugins: {
      htmlLegend: { containerID: "legende" },
      datalabels: {
        align: "end",
        anchor: (context: any) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value > 0 ? "start" : "end";
        },
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
        formatter: (value: number, _context: Context): string => (value ? value.toLocaleString("fr") : ""),
      },
      legend: { display: false },
      tooltip: {
        filter: (tooltipItem) => (tooltipItem.datasetIndex + 1) % 2 === 1,
        callbacks: {
          label: function (context: any) {
            const valeur = context.raw;
            const valeurRef = context.chart.data.datasets[context.datasetIndex + 1].data[context.dataIndex] as number;
            const valeurText = Number.isFinite(valeur as number) ? Math.abs(valeur as number).toLocaleString("fr") : "non renseigné";
            const valeurRefText = Number.isFinite(valeurRef as number) ? Math.abs(valeurRef as number).toLocaleString("fr") : "non renseigné";

            return [`Valeur: ${valeurText}`, `Valeur de référence: ${valeurRefText}`];
          },
        },
      }, // @ts-ignore
      rotationRef: {} as any,
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        stacked: true,
        ticks: {
          color: "#000",
          font: function (context: any) {
            if (context.index === 2) {
              return { weight: "bold" };
            }
            return {};
          },
        },
        beginAtZero: false,
      },
      xAxis2: {
        type: "category",
        position: "bottom",
        border: {
          display: false,
        },
        grid: { drawOnChartArea: false, drawTicks: false },
        ticks: {
          color: "#000",
          callback: (_tickValue, index) => "",
          font: function (context: any) {
            if (context.tick.label === new Date().getFullYear().toString()) {
              return { weight: "bold" };
            }
            return {};
          },
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        display: false,
      },
    },
  };

  const HtmlLegend = () => {
    return <menu className={"fr-checkbox-group " + styles["graphique-legende"]} id="legende" />;
  };

  return (
    <div>
      <Bar data={chartData} options={chatConfig} plugins={[rotationRefPlugin]} />
      <HtmlLegend />
    </div>
  );
};

export default GraphiqueNatureContrats;

import { Chart as ChartJS, Chart, ChartConfiguration, ChartData } from "chart.js";
import { ChangeEvent, useCallback, useState, useEffect, useRef } from "react";

import {
  NatureContratsAnnuel,
  NatureContratsTrimestriel,
} from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import { FrequencyFilter } from "../FrequencyFilter";
import styles from "./NatureContrats.module.css";
import { Context } from "chartjs-plugin-datalabels";
import { couleurDesTraitsRefHistogramme } from "../../../../commun/Graphique/couleursGraphique";

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
  return <HistogrammeComparaisonVerticalAvecRef donnees={donnees} />;
};

type HistogrammeComparaisonVerticalAvecRefProps = Readonly<{
  donnees: any[];
}>;

const HistogrammeComparaisonVerticalAvecRef = ({ donnees }: HistogrammeComparaisonVerticalAvecRefProps) => {
  const rawData = [
    { annee: "2023", nature: "CDI", effectif: 67, effectif_ref: 89 },
    { annee: "2023", nature: "CDD", effectif: 22, effectif_ref: 89 },
    { annee: "2024", nature: "CDI", effectif: 60, effectif_ref: 89 },
    { annee: "2024", nature: "CDD", effectif: 21, effectif_ref: 89 },
    { annee: "2025", nature: "CDI", effectif: 60, effectif_ref: 89 },
    { annee: "2025", nature: "CDD", effectif: 14, effectif_ref: 89 },
  ];

  const chartData: ChartData = {
    labels: Array.from(new Set(rawData.map((d) => d.annee))),
    datasets: [
      {
        label: "CDI",
        data: rawData.filter((d) => d.nature === "CDI").map((d) => d.effectif),
        backgroundColor: "rgba(234,170,6,0.6)",
        maxBarThickness: 60,
        xAxisID: 'x',
        stack:"stack-0"
      },
      {
        label: "Valeur référence CDI",
        data: rawData.filter((d) => d.nature === "CDI").map((d) => d.effectif_ref),
        backgroundColor: "rgba(234,170,6,0)",
        maxBarThickness: 60,
        datalabels: { display: false },
        xAxisID: 'x',
        stack:"stack-0"
      },
      {
        label: "CDD",
        data: rawData.filter((d) => d.nature === "CDD").map((d) => d.effectif),
        backgroundColor: "rgba(241,94,47,0.6)",
        maxBarThickness: 60,
        xAxisID: 'x',
        stack:"stack-1"

      },
      {
        label: "Valeur référence CDD",
        data: rawData.filter((d) => d.nature === "CDD").map((d) => d.effectif_ref),
        backgroundColor: "rgba(241,47,47,0)",
        maxBarThickness: 60,
        xAxisID: 'x',
        stack:"stack-1",
        datalabels: { display: false },
      }
    ],
  };
  const rotationRefPlugin = {
    id: "rotationRef",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      console.log("Options are :  "+JSON.stringify( options ));
      const { valeursRef } = options;
      const values = valeursRef;
      chart.getDatasetMeta(0).data.forEach((bar: any, index: number) => {
        const value = values[index];
        if (value === undefined) return;

        const yScale = scales['y'];
        const yPos = yScale.getPixelForValue(value);

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
    },
  }
  const chatConfig: ChartConfiguration = {
    type: "bar",
    data: chartData,
    options: {
      maintainAspectRatio: true,
      animation: false,
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        }
      },
      plugins: {
        rotationRef:{
          options: donnees
        },
        legend: { display: false },
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
          formatter: (value: number, _context: Context): string => value??"",
        }
      },
    },
    plugins: [{ id: "htmlLegend" },rotationRefPlugin],
  };



  const HtmlLegend = () => {
    return <menu className={"fr-checkbox-group " + styles["graphique-legende"]} id="id-legend" />;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Détruire le chart existant avant d'en créer un nouveau
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(ctx, chatConfig);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
      <HtmlLegend />
    </div>
  );
};

export default GraphiqueNatureContrats;

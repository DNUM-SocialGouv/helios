import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Context } from "chartjs-plugin-datalabels";

import styles from "./HistogrammeComparaisonVerticalAvecRef.module.css";
import { CouleurHistogramme, couleurDesTraitsRefHistogramme } from "./couleursGraphique";
import { Transcription } from "../Transcription/Transcription";

export type HistogrammeComparaisonVerticalAvecRefSerie = Readonly<{
  label: string;
  valeurs: (number | null)[];
  valeursRef: (number | null)[];
  couleurHistogramme: CouleurHistogramme;
  datalabelColor?: string;
}>;

type TranscriptionOptions = Readonly<{
  enteteLibelle: string;
  identifiants?: string[];
  identifiantUnique?: string;
}>;

type HistogrammeComparaisonVerticalAvecRefProps = Readonly<{
  libelles: (number | string)[];
  series: HistogrammeComparaisonVerticalAvecRefSerie[];
  legendReferenceLabel: string;
  legendReferenceColor?: string;
  legendContainerId?: string;
  transcription?: TranscriptionOptions;
  valeurNonRenseigneeLabel: string;
  formatValeur?: (valeur: number | null) => string | null;
  highlightLastLabel?: boolean;
}>;

const valeurFormateeParDefaut = (valeur: number | null): string | null => {
  if (!Number.isFinite(valeur as number) || valeur === null) {
    return null;
  }
  return (valeur as number).toLocaleString("fr");
};

const HistogrammeComparaisonVerticalAvecRef = ({
  libelles,
  series,
  legendReferenceLabel,
  legendReferenceColor = couleurDesTraitsRefHistogramme,
  legendContainerId = "histogramme-comparaison-vertical-legend",
  transcription,
  valeurNonRenseigneeLabel,
  formatValeur = valeurFormateeParDefaut,
  highlightLastLabel = false,
}: HistogrammeComparaisonVerticalAvecRefProps) => {
  const referencesByLabel = series.reduce<Record<string, (number | null)[]>>((acc, serie) => {
    acc[serie.label] = serie.valeursRef;
    return acc;
  }, {});

  const chartData: ChartData<"bar"> = {
    labels: libelles,
    datasets: series.map((serie) => ({
      label: serie.label,
      data: serie.valeurs,
      backgroundColor: serie.couleurHistogramme.premierPlan,
      maxBarThickness: 60,
      type: "bar" as const,
      datalabels: {
        color: serie.datalabelColor ?? "#000",
      },
    })),
  };

  const rotationRefPlugin = {
    id: "rotationRef",
    afterDraw(chart: ChartJS) {
      const { ctx, scales } = chart;
      const refs = referencesByLabel;

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        if (!chart.isDatasetVisible(datasetIndex)) {
          return;
        }

        const label = dataset.label as string | undefined;
        if (!label) {
          return;
        }

        const refValues = refs[label];
        if (!refValues) {
          return;
        }

        chart.getDatasetMeta(datasetIndex).data.forEach((bar: any, index: number) => {
          const valeurRef = refValues[index];
          if (valeurRef === undefined || valeurRef === null) {
            return;
          }

          const yScale = scales["y"];
          if (!yScale) {
            return;
          }

          const yPos = yScale.getPixelForValue(valeurRef);
          const xLeft = bar.x - bar.width / 2;
          const xRight = bar.x + bar.width / 2;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xLeft, yPos);
          ctx.lineTo(xRight, yPos);
          ctx.strokeStyle = legendReferenceColor;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        });
      });
    },
  };

  const dynamicScalePlugin = {
    id: "dynamicScale",
    beforeUpdate(chart: ChartJS) {
      let maxValue = 0;

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        if (!chart.isDatasetVisible(datasetIndex)) {
          return;
        }

        dataset.data.forEach((value) => {
          const numericValue = typeof value === "number" ? value : value === null ? null : Number(value);
          if (numericValue !== null && Number.isFinite(numericValue)) {
            maxValue = Math.max(maxValue, numericValue);
          }
        });

        const datasetLabel = dataset.label as string | undefined;
        if (!datasetLabel) {
          return;
        }

        referencesByLabel[datasetLabel]?.forEach((refValue) => {
          if (refValue !== null && Number.isFinite(refValue)) {
            maxValue = Math.max(maxValue, refValue as number);
          }
        });
      });

      if (!chart.options.scales?.y) {
        return;
      }

      chart.options.scales.y.beginAtZero = true;

      if (maxValue > 0) {
        const padding = maxValue * 0.05;
        chart.options.scales.y.max = maxValue + padding;
      } else {
        chart.options.scales.y.max = undefined;
      }
    },
  };

  const valeursTranscription = series.flatMap((serie) => {
    const valeursFormatees = serie.valeurs.map((valeur) => formatValeur(valeur));
    const refsFormatees = serie.valeursRef.map((valeur) => formatValeur(valeur));
    return [valeursFormatees, refsFormatees];
  });

  const transcriptionIdentifiants = transcription?.identifiants ?? series.flatMap((serie) => [serie.label, `${legendReferenceLabel} - ${serie.label}`]);

  const chartOptions: ChartOptions<"bar"> = {
    maintainAspectRatio: true,
    animation: false,
    responsive: true,
    interaction: {
      intersect: false,
      mode: "point",
    },
    plugins: {
      htmlLegend: { containerID: legendContainerId },
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
        formatter: (value: number | null, _context: Context): string => {
          const formatted = formatValeur(value);
          return formatted ?? "";
        },
      },
      legend: { display: false },
      tooltip: {
        filter: (tooltipItem) => tooltipItem.raw !== null && tooltipItem.raw !== undefined,
        callbacks: {
          label: function (context: any) {
            const valeur = context.raw as number | null;
            const datasetLabel = context.dataset.label as string;
            const valeurRef = referencesByLabel[datasetLabel]?.[context.dataIndex] ?? null;
            const valeurText = formatValeur(valeur) ?? valeurNonRenseigneeLabel;
            const valeurRefText = formatValeur(valeurRef) ?? valeurNonRenseigneeLabel;

            return [`Valeur: ${valeurText}`, `Valeur de référence: ${valeurRefText}`];
          },
        },
      },
      // @ts-ignore
      rotationRef: { referencesByLabel } as any,
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
        stacked: false,
        ticks: {
          color: "#000",
          font: (context: any) => {
            if (highlightLastLabel && context.index === libelles.length - 1) {
              return { weight: "bold" };
            }
            return {};
          },
        },
        beginAtZero: false,
      },
      y: {
        display: false,
      },
    },
  };

  const Legend = () => (
    <div className={styles.legendContainer}>
      <menu className={"fr-checkbox-group " + styles.legend} id={legendContainerId} />
      <div aria-hidden="true" className={styles.referenceLegend}>
        <span className={styles.referenceLine} style={{ backgroundColor: legendReferenceColor }} />
        <span>{legendReferenceLabel}</span>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <Bar data={chartData} options={chartOptions} plugins={[dynamicScalePlugin, rotationRefPlugin]} />
        <Legend />
      </div>
      {transcription && (
        <Transcription
          entêteLibellé={transcription.enteteLibelle}
          identifiantUnique={transcription.identifiantUnique}
          identifiants={transcriptionIdentifiants}
          libellés={libelles}
          valeurs={valeursTranscription}
        />
      )}
    </>
  );
};

export default HistogrammeComparaisonVerticalAvecRef;

import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

import { couleurDesTraitsRefHistogramme, CouleurHistogramme } from "./couleursGraphique";
import styles from "./HistogrammeComparaisonVerticalAvecRef.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
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
  legendContainerId?: string;
  transcription?: TranscriptionOptions;
  formatValeur?: (valeur: number | null) => string | null;
  highlightLastLabel?: boolean;
  libellesValeursManquantes?: string[];
  libellesValeursRefManquantes?: string[];
}>;

const valeurFormateeParDefaut = (valeur: number | null): string | null => {
  if (typeof valeur !== "number" || Number.isNaN(valeur)) {
    return null;
  }
  return StringFormater.formatInFrench(valeur);
};

const HistogrammeComparaisonVerticalAvecRef = ({
  libelles,
  series,
  legendReferenceLabel,

  legendContainerId = "histogramme-comparaison-vertical-legend",
  transcription,
  formatValeur = valeurFormateeParDefaut,
  libellesValeursManquantes,
  libellesValeursRefManquantes,
}: HistogrammeComparaisonVerticalAvecRefProps) => {
  const { wording } = useDependencies();
  const valeursManquantes = libellesValeursManquantes ?? [];
  const valeursRefManquantes = libellesValeursRefManquantes ?? [];
  const referencesParLibelle: Record<string, (number | null)[]> = {};
  const valeursParLibelle: Record<string, (number | null)[]> = {};
  for (const serie of series) {
    referencesParLibelle[serie.label] = serie.valeursRef;
    valeursParLibelle[serie.label] = serie.valeurs;
  }

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

      const datasets = chart.data.datasets ?? [];
      for (const [datasetIndex, dataset] of datasets.entries()) {
        if (!chart.isDatasetVisible(datasetIndex)) {
          continue;
        }

        const label = dataset.label;
        if (!label) {
          continue;
        }

        const valeursReference = referencesParLibelle[label];
        const valeurs = valeursParLibelle[label];
        if (!valeursReference || !valeurs) {
          continue;
        }

        const yScale = scales["y"];
        if (!yScale) {
          continue;
        }

        const elements = chart.getDatasetMeta(datasetIndex).data ?? [];
        for (const [index, element] of elements.entries()) {
          const valeurRef = valeursReference[index];
          const valeur = valeurs[index];
          if (!Number.isFinite(valeur) || !Number.isFinite(valeurRef)) {
            continue;
          }

          const yPos = yScale.getPixelForValue(valeurRef as number);
          const barElement = element as unknown as { x: number; width: number };
          const xLeft = barElement.x - barElement.width / 2;
          const xRight = barElement.x + barElement.width / 2;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xLeft, yPos);
          ctx.lineTo(xRight, yPos);
          ctx.strokeStyle = couleurDesTraitsRefHistogramme;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }
      }
    },
  };

  const anneeEnCours = String(new Date().getFullYear());

  // @ts-ignore
  const chartOptions: ChartOptions<"bar"> = {
    maintainAspectRatio: true,
    animation: false,
    responsive: true,
    interaction: {
      intersect: false,
      mode: "point",
    },
    plugins: {
      // @ts-ignore
      htmlLegend: { containerID: legendContainerId },
      datalabels: {
        align: "end",
        anchor: (context: any) => {
          const datasetValues = Array.isArray(context.dataset.data) ? context.dataset.data : [];
          const rawValue = datasetValues[context.dataIndex];
          const numericValue = typeof rawValue === "number" ? rawValue : null;
          return numericValue !== null && numericValue > 0 ? "start" : "end";
        },
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
        formatter: (value: number | null, _context: Context): string => {
          const numericValue = typeof value === "number" ? value : null;
          const formatted = formatValeur(numericValue);
          return formatted ?? "";
        },
      },
      legend: { display: false },
      tooltip: {
        filter: (tooltipItem) => tooltipItem.raw !== null && tooltipItem.raw !== undefined,
        callbacks: {
          label(context: any) {
            const rawValue = context.raw;
            const valeur = typeof rawValue === "number" ? rawValue : null;
            const labelValue = typeof context.dataset.label === "string" ? context.dataset.label : "";
            const referenceValues = labelValue ? (referencesParLibelle[labelValue] ?? []) : [];
            const valeurRef = referenceValues[context.dataIndex] ?? null;

            const valeurText = formatValeur(valeur) ?? wording.NON_RENSEIGNÉ;
            const valeurRefText = formatValeur(valeurRef) ?? wording.NON_RENSEIGNÉ;

            return [`Valeur: ${valeurText}`, `Valeur de référence: ${valeurRefText}`];
          },
        },
      },
      // @ts-ignore
      rotationRef: { referencesByLabel: referencesParLibelle } as any,
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
            if (String(libelles[context.index]).includes(anneeEnCours)) {
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

  const valeursTranscription: (string | null)[][] = [];
  for (const serie of series) {
    const valeursFormatees = serie.valeurs.map((valeur) => formatValeur(valeur));
    const refsFormatees = serie.valeursRef.map((valeur) => formatValeur(valeur));
    valeursTranscription.push(valeursFormatees, refsFormatees);
  }

  const transcriptionIdentifiants =
    transcription?.identifiants ??
    (() => {
      const identifiants: string[] = [];
      for (const serie of series) {
        identifiants.push(serie.label, `${legendReferenceLabel} - ${serie.label}`);
      }
      return identifiants;
    })();

  const legend = (
    <div className={styles["legendContainer"]}>
      <menu className={`fr-checkbox-group ${styles["legend"]}`} id={legendContainerId} />
      <div aria-hidden="true" className={styles["referenceLegend"]}>
        <span className={styles["referenceLine"]} style={{ backgroundColor: couleurDesTraitsRefHistogramme }} />
        <span>{legendReferenceLabel}</span>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <Bar data={chartData} options={chartOptions} plugins={[rotationRefPlugin]} />
        {legend}
      </div>
      {valeursManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNEE_RENSEIGNEE_GENERIQUE} ${valeursManquantes.join(", ")}`}</MiseEnExergue>}
      {valeursRefManquantes.length > 0 && (
        <MiseEnExergue>{`${wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE} ${valeursRefManquantes.join(", ")}`}</MiseEnExergue>
      )}
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

import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

import { couleurDesTraitsRefHistogramme, CouleurHistogramme } from "./couleursGraphique";
import styles from "./HistogrammeComparaisonVerticalAvecRef.module.css";
import { ColorLabel } from "../ColorLabel/ColorLabel";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";

export type HistogrammeComparaisonVerticalAvecRefSerie = Readonly<{
  label: string;
  valeurs: (number | null)[];
  valeursRef?: (number | null)[];
  couleurHistogramme: CouleurHistogramme;
  datalabelColor?: string;
}>;

type TranscriptionOptions = Readonly<{
  enteteLibelle: string;
  identifiants?: string[];
  identifiantUnique?: string;
}>;

type HistogrammeComparaisonVerticalAvecRefProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  libelles: (number | string)[];
  series: HistogrammeComparaisonVerticalAvecRefSerie[];
  legendReferenceLabel: string;
  legendContainerId?: string;
  transcription?: TranscriptionOptions;
  formatValeur?: (valeur: number | null) => string | null;
  highlightLastLabel?: boolean;
  libellesValeursManquantes?: string[];
  libellesValeursRefManquantes?: string[];
  showRefValues: boolean;
}>;

const valeurFormateeParDefaut = (valeur: number | null): string | null => {
  if (typeof valeur !== "number" || Number.isNaN(valeur)) {
    return null;
  }
  return StringFormater.formatInFrench(valeur);
};

const expressionReguliereTrimestre = /^T(\d)\s+(\d{4})$/;

const HistogrammeComparaisonVerticalAvecRef = ({
  etabFiness,
  etabTitle,
  nomGraph,
  libelles,
  series,
  legendReferenceLabel,
  legendContainerId = "histogramme-comparaison-vertical-legend",
  transcription,
  formatValeur = valeurFormateeParDefaut,
  highlightLastLabel = false,
  libellesValeursManquantes,
  libellesValeursRefManquantes,
  showRefValues
}: HistogrammeComparaisonVerticalAvecRefProps) => {
  const { wording } = useDependencies();
  const valeursManquantes = libellesValeursManquantes ?? [];
  const valeursRefManquantes = libellesValeursRefManquantes ?? [];
  const referencesParLibelle: Record<string, (number | null)[]> = {};
  const valeursParLibelle: Record<string, (number | null)[]> = {};

  const decomposerLibelle = (label: number | string): { principal: string; secondaire: string } => {
    if (typeof label === "number") {
      const libelleTexte = String(label);
      return { principal: libelleTexte, secondaire: "" };
    }

    const libelleNettoye = label.trim();
    const correspondanceTrimestre = expressionReguliereTrimestre.exec(libelleNettoye);
    if (correspondanceTrimestre) {
      return { principal: `T${correspondanceTrimestre[1]}`, secondaire: correspondanceTrimestre[2] };
    }

    const segments = libelleNettoye.split(/\s+/);
    if (segments.length > 1) {
      return { principal: segments.slice(0, -1).join(" "), secondaire: segments.at(-1) ?? "" };
    }

    return { principal: libelleNettoye, secondaire: "" };
  };

  for (const serie of series) {
    referencesParLibelle[serie.label] = serie.valeursRef ?? [];
    valeursParLibelle[serie.label] = serie.valeurs;
  }

  const libellesDecomposes = libelles.map(decomposerLibelle);
  const libellesPrincipaux = libellesDecomposes.map(({ principal }) => principal);
  const libellesSecondaires = libellesDecomposes.map(({ secondaire }, index) => {
    if (!secondaire) {
      return "";
    }
    const libelleSecondairePrecedent = index > 0 ? libellesDecomposes.at(index - 1)?.secondaire ?? "" : "";
    return libelleSecondairePrecedent === secondaire ? "" : secondaire;
  });
  const presenceLibellesSecondaires = libellesSecondaires.some((libelle) => libelle !== "");
  const indiceDernierLibelleSecondaire = libellesSecondaires.reduce((dernierIndice, libelle, index) => (libelle ? index : dernierIndice), -1);

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
        align: (context: any) => {
          const donnees = Array.isArray(context.dataset.data) ? context.dataset.data : [];
          const valeurBrute = donnees[context.dataIndex];
          const valeurNumerique = typeof valeurBrute === "number" ? valeurBrute : null;
          return valeurNumerique !== null && valeurNumerique < 0 ? "end" : "start";
        },
        anchor: (context: any) => {
          const donnees = Array.isArray(context.dataset.data) ? context.dataset.data : [];
          const valeurBrute = donnees[context.dataIndex];
          const valeurNumerique = typeof valeurBrute === "number" ? valeurBrute : null;
          return valeurNumerique !== null && valeurNumerique < 0 ? "start" : "end";
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
            const valeurText = formatValeur(valeur) ?? wording.NON_RENSEIGNÉ;
            if (!showRefValues) {
              return `Valeur: ${valeurText}`;
            }

            const labelValue = typeof context.dataset.label === "string" ? context.dataset.label : "";
            const referenceValues = labelValue ? (referencesParLibelle[labelValue] ?? []) : [];
            const valeurRef = referenceValues[context.dataIndex] ?? null;
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
          callback: (_value, index) => libellesPrincipaux[index] ?? "",
          font: (context: any) => {
            if (highlightLastLabel && context.index === libelles.length - 1 && String(libelles[context.index]).includes(anneeEnCours)) {
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
        display: presenceLibellesSecondaires,
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          color: "#000",
          callback: (_value, index) => libellesSecondaires[index] ?? "",
          font: (context: any) => {
            const tickLabel = typeof context.tick?.label === "string" ? context.tick.label : "";
            if (highlightLastLabel && context.index === indiceDernierLibelleSecondaire && tickLabel === anneeEnCours) {
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

  const valeursTranscription: (string | null)[][] = [];
  for (const serie of series) {
    const valeursFormatees = serie.valeurs.map((valeur) => formatValeur(valeur));
    const refsFormatees = (serie.valeursRef ?? []).map((valeur) => formatValeur(valeur));
    if (!showRefValues) {
      valeursTranscription.push(valeursFormatees)
    } else {
      valeursTranscription.push(valeursFormatees, refsFormatees);

    }
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
    </div>
  );

  return (
    <>
      <div>
        <Bar data={chartData} options={chartOptions} plugins={showRefValues ? [rotationRefPlugin] : []} />
        {legend}
      </div>
      {valeursManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNEE_RENSEIGNEE_GENERIQUE} ${valeursManquantes.join(", ")}`}</MiseEnExergue>}
      {showRefValues && valeursRefManquantes.length > 0 && (
        <MiseEnExergue>{`${wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE} ${valeursRefManquantes.join(", ")}`}</MiseEnExergue>
      )}
      {showRefValues && <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDesTraitsRefHistogramme, label: wording.MOYENNE_REF, circle: false }
        ]}
      />}
      {transcription && (
        <Transcription
          entêteLibellé={transcription.enteteLibelle}
          etabFiness={etabFiness}
          etabTitle={etabTitle}
          identifiantUnique={transcription.identifiantUnique}
          identifiants={transcriptionIdentifiants}
          isVigieRH={true}
          libellés={libelles}
          nomGraph={nomGraph}
          valeurs={valeursTranscription}
        />
      )}
    </>
  );
};

export default HistogrammeComparaisonVerticalAvecRef;

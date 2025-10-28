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
  donnees: (NatureContratsTrimestriel | NatureContratsAnnuel)[];
}>;

const GraphiqueNatureContratsAnnuel = ({ donnees }: GraphiqueNatureContratsAnnuelProps) => {
  return <HistogrammeComparaisonVerticalAvecRef donnees={donnees} type="annuel" />;
};

const GraphiqueNatureContratsTrimestriel = ({ donnees }: GraphiqueNatureContratsTrimestrielProps) => {
  return <HistogrammeComparaisonVerticalAvecRef donnees={donnees} type="trimestriel" />;
};

type HistogrammeComparaisonVerticalAvecRefProps =
  | Readonly<{
      donnees: NatureContratsAnnuel[];
      type: "annuel";
    }>
  | Readonly<{
      donnees: (NatureContratsTrimestriel | NatureContratsAnnuel)[];
      type: "trimestriel";
    }>;

const couleursParNature = (natureLibelle: string, index: number) => {
  const normalized = natureLibelle.toLowerCase();
  if (normalized.includes("cdi")) {
    return { arrierePlan: "rgba(234,170,6,0.6)", texte: "#000" };
  }
  if (normalized.includes("cdd")) {
    return { arrierePlan: "rgba(241,94,47,0.6)", texte: "#000" };
  }

  const palette = [
    "rgba(62,132,206,0.6)",
    "rgba(130,69,173,0.6)",
    "rgba(0,155,119,0.6)",
    "rgba(0,99,164,0.6)",
  ];

  return {
    arrierePlan: palette[index % palette.length],
    texte: "#000",
  };
};

const estTrimestriel = (
  valeur: NatureContratsAnnuel | NatureContratsTrimestriel,
): valeur is NatureContratsTrimestriel => {
  return "trimestre" in valeur && valeur.trimestre !== undefined;
};

const HistogrammeComparaisonVerticalAvecRef = ({ donnees, type }: HistogrammeComparaisonVerticalAvecRefProps) => {
  const isTrimestriel = type === "trimestriel";

  const categorieKey = (valeur: NatureContratsAnnuel | NatureContratsTrimestriel) =>
    isTrimestriel && estTrimestriel(valeur) ? `${valeur.annee}-T${valeur.trimestre}` : valeur.annee.toString();

  const categorieLabel = (valeur: NatureContratsAnnuel | NatureContratsTrimestriel) =>
    isTrimestriel && estTrimestriel(valeur) ? `T${valeur.trimestre} ${valeur.annee}` : valeur.annee.toString();

  const sortedDonnees = [...donnees].sort((a, b) => {
    if (isTrimestriel && estTrimestriel(a) && estTrimestriel(b)) {
      const aKey = a.annee * 10 + a.trimestre;
      const bKey = b.annee * 10 + b.trimestre;
      return aKey - bKey;
    }
    return a.annee - b.annee;
  });

  const categories = sortedDonnees.reduce<{ key: string; label: string }[]>((acc, valeur) => {
    const key = categorieKey(valeur);
    if (!acc.find((categorie) => categorie.key === key)) {
      acc.push({ key, label: categorieLabel(valeur) });
    }
    return acc;
  }, []);

  const natures = sortedDonnees.reduce<string[]>((acc, valeur) => {
    if (acc.includes(valeur.natureLibelle)) {
      return acc;
    }
    acc.push(valeur.natureLibelle);
    return acc;
  }, []);

  const groupedByCategorie = sortedDonnees.reduce<Record<string, Record<string, NatureContratsAnnuel | NatureContratsTrimestriel>>>((acc, valeur) => {
    const key = categorieKey(valeur);
    if (!acc[key]) {
      acc[key] = {};
    }
    acc[key][valeur.natureLibelle] = valeur;
    return acc;
  }, {});

  const referencesByLabel: Record<string, (number | null)[]> = {};
  let valeurMax = 0;

  const datasets = natures.map((natureLibelle, natureIndex) => {
    const couleurs = couleursParNature(natureLibelle, natureIndex);
    const data = categories.map(({ key }) => {
      const valeur = groupedByCategorie[key]?.[natureLibelle];
      const effectif = valeur?.effectif ?? null;
      if (effectif !== null) {
        valeurMax = Math.max(valeurMax, effectif);
      }
      return effectif;
    });

    referencesByLabel[natureLibelle] = categories.map(({ key }) => {
      const valeur = groupedByCategorie[key]?.[natureLibelle];
      const effectifRef = valeur?.effectifRef ?? null;
      if (effectifRef !== null) {
        valeurMax = Math.max(valeurMax, effectifRef);
      }
      return effectifRef;
    });

    return {
      label: natureLibelle,
      data,
      datalabels: { color: couleurs.texte },
      backgroundColor: couleurs.arrierePlan,
      maxBarThickness: 60,
      type: "bar" as const,
    };
  });

  const labels = categories.map(({ label }) => label);

  const chartData: ChartData<"bar"> = {
    labels,
    datasets,
  };

  const rotationRefPlugin = {
    id: "rotationRef",
    afterDraw(chart: ChartJS) {
      const { ctx, scales } = chart;
      const pluginOptions = chart.config.options?.plugins?.rotationRef as { referencesByLabel?: Record<string, (number | null)[]> } | undefined;
      const refs = pluginOptions?.referencesByLabel ?? {};

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
          ctx.strokeStyle = couleurDesTraitsRefHistogramme;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        });
      });
    },
  };




  const chatConfig: ChartOptions<"bar"> = {
    maintainAspectRatio: true,
    animation: false,
    responsive: true,
    interaction: {
      intersect: false,
      mode: "point",
    },
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
        filter: (tooltipItem) => tooltipItem.raw !== null && tooltipItem.raw !== undefined,
        callbacks: {
          label: function (context: any) {
            const valeur = context.raw;
            const datasetLabel = context.dataset.label as string;
            const valeurRef = referencesByLabel[datasetLabel]?.[context.dataIndex];
            const valeurText = Number.isFinite(valeur as number) ? Math.abs(valeur as number).toLocaleString("fr") : "non renseigné";
            const valeurRefText = Number.isFinite(valeurRef as number) ? Math.abs(valeurRef as number).toLocaleString("fr") : "non renseigné";

            return [`Valeur: ${valeurText}`, `Valeur de référence: ${valeurRefText}`];
          },
        },
      }, // @ts-ignore
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
          font: function (context: any) {
            if (context.index === labels.length - 1) {
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
            const label = context.tick.label as string;
            if (typeof label === "string" && label.includes(new Date().getFullYear().toString())) {
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
        suggestedMax: valeurMax > 0 ? valeurMax : undefined,
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

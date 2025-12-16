import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, ChartData } from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

import { ColorLabel } from "../../../commun/ColorLabel/ColorLabel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { couleurDesTraitsRefHistogramme } from "../../../commun/Graphique/couleursGraphique";
import { MiseEnExergue } from "../../../commun/MiseEnExergue/MiseEnExergue";
import { Transcription } from "../../../commun/Transcription/Transcription";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);


type PyramidChartProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  labels: string[];
  effectifHomme: number[];
  effectifHommeRef: number[];
  effectifFemme: number[];
  effectifFemmeRef: number[];
}>;

const PyramidChart = ({ etabFiness, etabTitle, labels, effectifFemme, effectifFemmeRef, effectifHomme, effectifHommeRef }: PyramidChartProps) => {
  const refColor = "#929292";

  const { wording } = useDependencies();

  const {
    hommesExtension,
    femmesExtension,
    libellesValeursManquantes,
    libellesValeursReferenceManquantes,
  } = useMemo(() => {
    const valeursEffectifHomme = effectifHomme.map((valeur) => {
      if (Number.isFinite(valeur)) {
        return valeur;
      }
      return null;
    });

    const valeursEffectifHommeRef = effectifHommeRef.map((valeur) => {
      if (Number.isFinite(valeur)) {
        return valeur;
      }
      return null;
    });

    const valeursEffectifFemme = effectifFemme.map((valeur) => {
      if (Number.isFinite(valeur)) {
        return valeur;
      }
      return null;
    });

    const valeursEffectifFemmeRef = effectifFemmeRef.map((valeur) => {
      if (Number.isFinite(valeur)) {
        return valeur;
      }
      return null;
    });

    const libellesValeursManquantes: string[] = [];
    const libellesValeursReferenceManquantes: string[] = [];

    const ajouterLibellesManquants = (
      valeurs: (number | null)[],
      construireLibelle: (index: number) => string,
      accumulateur: string[]
    ) => {
      for (const [index, valeur] of valeurs.entries()) {
        if (!Number.isFinite(valeur)) {
          const libelle = construireLibelle(index);
          if (!accumulateur.includes(libelle)) {
            accumulateur.push(libelle);
          }
        }
      }
    };

    ajouterLibellesManquants(
      valeursEffectifHomme,
      (index) => `${wording.EFFECTIF_HOMMES}-${labels[index]}`,
      libellesValeursManquantes
    );
    ajouterLibellesManquants(
      valeursEffectifFemme,
      (index) => `${wording.EFFECTIF_FEMMES}-${labels[index]}`,
      libellesValeursManquantes
    );
    ajouterLibellesManquants(
      valeursEffectifHommeRef,
      (index) => `${wording.EFFECTIF_HOMMES}-${labels[index]}`,
      libellesValeursReferenceManquantes
    );
    ajouterLibellesManquants(
      valeursEffectifFemmeRef,
      (index) => `${wording.EFFECTIF_FEMMES}-${labels[index]}`,
      libellesValeursReferenceManquantes
    );

    const menExtension = valeursEffectifHommeRef.map((valeurRef, index) => {
      const valeur = valeursEffectifHomme[index];
      if (Number.isFinite(valeur) && Number.isFinite(valeurRef)) {
        return Math.max(0, (valeurRef as number) - (valeur as number));
      }
      return 0;
    });

    const womenExtension = valeursEffectifFemmeRef.map((valeurRef, index) => {
      const valeur = valeursEffectifFemme[index];
      if (Number.isFinite(valeur) && Number.isFinite(valeurRef)) {
        return Math.max(0, (valeurRef as number) - (valeur as number));
      }
      return 0;
    });

    return {
      valeursEffectifHomme,
      valeursEffectifHommeRef,
      valeursEffectifFemme,
      valeursEffectifFemmeRef,
      hommesExtension: menExtension,
      femmesExtension: womenExtension,
      libellesValeursManquantes,
      libellesValeursReferenceManquantes,
    };
  }, [effectifFemme, effectifFemmeRef, effectifHomme, effectifHommeRef, labels, wording.EFFECTIF_FEMMES, wording.EFFECTIF_HOMMES]);

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
        data: hommesExtension,
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
        data: femmesExtension,
        backgroundColor: "rgba(255,249,235,255)",
        yAxisID: "y"
      },
    ],
  };

  // Custom Plugin for Vertical Lines
  const verticalLinePlugin = {
    id: "verticalLines",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      const isMenChart = chart.data.datasets[0].label === "Men";
      const { effectifHommeRef, effectifFemmeRef } = options;

      const values = isMenChart ? effectifHommeRef : effectifFemmeRef;
      const datasetMeta = chart.getDatasetMeta(0).data as unknown as (BarElement & { height: number })[]
      for (const [index, bar] of datasetMeta.entries()) {
        const value = values[index];
        if (value === undefined) return;

        // Get x-position based on reference value
        const xScale = scales['x'];
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
      }
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    indexAxis: "y" as const,
    scales: {
      x: {
        border: {
          display: false
        },
        ticks: {
          display: false,
        },
        position: "top",
        grid: { drawOnChartArea: false, drawTicks: false },
        barPercentage: 1,
        stacked: true,
      },
      y: {
        border: {
          display: false
        },
        ticks: {
          color: '#000',
          autoSkip: false
        },
        grid: { drawOnChartArea: false, drawTicks: false },
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
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
      },
      legend: { display: false },
      verticalLines: { effectifHommeRef, effectifFemmeRef },
    },
  };

  const labelPlugin = {
    id: "labelPlugin",
    afterDraw: (chart: ChartJS) => {
      const { ctx, chartArea: { width, left } } = chart;
      const datasetMeta = chart.getDatasetMeta(0);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "12px Marianne";
      ctx.fillStyle = "#000";

      datasetMeta.data.forEach((bar: any, index: number) => {
        const label = labels[index];
        ctx.fillText(label, left + width / 2, bar.y);
      });
      ctx.restore();
    }
  };

  const middleData = {
    labels,
    datasets: [
      {
        data: new Array(labels.length).fill(0),
        backgroundColor: "transparent",
        borderWidth: 0,
      },
    ],
  };

  return (
    <>
      <div className="fr-grid-row fr-mb-1w" style={{ alignItems: "center" }}>
        <div className="fr-col-5" style={{ textAlign: "center", fontWeight: "bold" }}>Hommes</div>
        <div className="fr-col-2" style={{ textAlign: "center", fontWeight: "bold" }}></div>
        <div className="fr-col-5" style={{ textAlign: "center", fontWeight: "bold" }}>Femmes</div>
      </div>
      <div className="fr-grid-row" style={{ height: "300px", alignItems: "stretch" }}>
        <div className="fr-col-5">
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
                  display: false,
                  reverse: true,
                },
                y: { ...options.scales.y, display: false },
              }
            }}
            plugins={[verticalLinePlugin]}
          />
        </div>
        <div className="fr-col-2">
          <Bar
            data={middleData}
            options={{
              ...options,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                datalabels: { display: false },
              },
              scales: {
                x: { display: false },
                y: {
                  ...options.scales.y,
                  display: false,
                },
              },
              events: [],
            }}
            plugins={[labelPlugin]}
          />
        </div>
        <div className="fr-col-5">
          <Bar
            data={womenData}
            options={{
              ...options,
              scales: {
                ...options.scales,
                // @ts-ignore
                x: {
                  ...options.scales.x,
                  display: false,
                },
                y: { ...options.scales.y, display: false },
              },
            }}
            plugins={[verticalLinePlugin]}
          />
        </div>
      </div>
      <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDesTraitsRefHistogramme, label: wording.MOYENNE_REF, circle: false }

        ]}
      />
      {libellesValeursManquantes.length > 0 && (
        <MiseEnExergue>
          {`${wording.AUCUNE_DONNEE_RENSEIGNEE_GENERIQUE} ${libellesValeursManquantes.join(", ")}`}
        </MiseEnExergue>
      )}
      {libellesValeursReferenceManquantes.length > 0 && (
        <MiseEnExergue>
          {`${wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE} ${libellesValeursReferenceManquantes.join(", ")}`}
        </MiseEnExergue>
      )}
      <Transcription
        disabled={false}
        entêteLibellé={wording.TRANCHE_AGE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiants={[wording.EFFECTIF_HOMMES, wording.EFFECTIF_HOMMES_REF, wording.EFFECTIF_FEMMES, wording.EFFECTIF_FEMMES_REF]}
        libellés={labels}
        nomGraph={wording.PYRAMIDE_DES_AGES}
        valeurs={[effectifHomme, effectifHommeRef, effectifFemme, effectifFemmeRef]}
      />
    </>
  );
};

export default PyramidChart;

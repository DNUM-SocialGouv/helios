import { BarElement, Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import { couleurDesTraitsRefHistogramme, CouleurHistogramme, couleurIdentifiant } from "./couleursGraphique";
import styles from "./HistogrammeHorizontaux.module.css";
import { ColorLabel } from "../ColorLabel/ColorLabel";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { Transcription } from "../Transcription/Transcription";


type HistogrammeHorizontalAvecRefProps = {
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  enteteLibelle: string;
  couleursDeLHistogramme: CouleurHistogramme[]
  valeursDesHistogrammes: number[];
  valeursDesHistogrammesRef: number[];
  libelles: string[];
  identifiants: string[];
  refsManquantsTitre?: string;
  refsManquants: string[];
  epaisseur?: "FIN" | "EPAIS";
  showRefValues: boolean;
  valeursAdditionnelles?: (string | number)[];
};
const HistogrammeHorizontalAvecRef = ({
  etabFiness,
  etabTitle,
  nomGraph,
  couleursDeLHistogramme,
  epaisseur,
  enteteLibelle,
  valeursDesHistogrammes,
  valeursDesHistogrammesRef,
  libelles,
  refsManquantsTitre,
  refsManquants,
  identifiants,
  showRefValues,
  valeursAdditionnelles
}: HistogrammeHorizontalAvecRefProps) => {
  const { wording } = useDependencies();

  const ASPECT_RATIO = epaisseur === "EPAIS" ? 11 : 15;
  const aspectRatio = ASPECT_RATIO / valeursDesHistogrammes.length;

  const data: ChartData = {
    datasets: [
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
        data: valeursDesHistogrammes,
        datalabels: { labels: { title: { color: valeursDesHistogrammes.map(() => "#000") } } },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.secondPlan),
        data: showRefValues ? valeursDesHistogrammesRef : [],
        datalabels: { display: false },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
    ],
    labels: libelles,
  };

  const optionsHistogramme: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    indexAxis: "y",
    scales: {
      x: {
        display: false
      },
      y: {
        stacked: true,
        border: {
          display: false
        },
        ticks: { color: couleurIdentifiant },
        grid: { drawOnChartArea: false, drawTicks: false },
      },
    },
    // intersect : false  avec mode : "index" => au survol du segment, on affiche la même tooltip.
    // on affiche la tooltip qui correspond à la valeur , donc index 0 . Et on ignore la tooltip de la barre Référence (pour cela on ajout 'filter' dans tooltip)
    interaction: {
      intersect: true,
      mode: "index",
    },
    layout: {
      padding: {
        right: valeursAdditionnelles ? 40 : 0,
      },
    },
    plugins: {
      datalabels: {
        color: "#000",
        anchor: "end",
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
        labels: {
          title: {
            align: "start",
            formatter: (value: number) => value,
          },
          pourcentage: {
            align: "end",
            display: (context: any) => {
              return !!(valeursAdditionnelles && valeursAdditionnelles[context.dataIndex]);
            },
            formatter: (_value: number, context: any) => {
              return valeursAdditionnelles ? valeursAdditionnelles[context.dataIndex] : "";
            },
          },
        },
      },
      legend: { display: false },
      tooltip: {
        filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const value = valeursDesHistogrammes[index];
            const label = nomGraph === wording.DUREE_CDD ? "CDD" : `Nombre`;
            if (!showRefValues) {
              return `${label}: ${value}`;
            }

            const refValue = valeursDesHistogrammesRef[index];
            const refValueText = refValue ? `${refValue} ` : 'Non renseignée'

            return [`${label}: ${value}`,
            `Valeur de référence: ${refValueText} `];
          },
        },
      },
      // @ts-ignore
      valeursDeReference: { valeursDesHistogrammesRef } as any,
    },
  };

  const valeursRefPlugin = {
    id: "valeursDeReference",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      const { valeursDesHistogrammesRef } = options;
      const values = valeursDesHistogrammesRef;
      const datasetMeta = chart.getDatasetMeta(0).data as unknown as (BarElement & { height: number })[];
      for (const [index, bar] of datasetMeta.entries()) {
        const value = values[index];
        if (value === undefined) return;

        const xScale = scales['x'];
        const xPos = xScale.getPixelForValue(value);

        const yLeft = bar.y - bar.height / 2;
        const yRight = bar.y + bar.height / 2;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xPos, yLeft);
        ctx.lineTo(xPos, yRight);
        ctx.strokeStyle = couleurDesTraitsRefHistogramme;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    },
  }

  const valeursTranscriptions = showRefValues ? [valeursDesHistogrammes, valeursDesHistogrammesRef] :
    valeursAdditionnelles ? [valeursDesHistogrammes, valeursAdditionnelles] : [valeursDesHistogrammes];

  return (
    <>
      <div className={styles["flexContainer"]}>
        {/* @ts-ignore */}
        <Bar data={data} options={{ ...optionsHistogramme, aspectRatio }} plugins={showRefValues ? [valeursRefPlugin] : []}
        />
      </div>
      {showRefValues && <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDesTraitsRefHistogramme, label: wording.MOYENNE_REF, circle: false }
        ]}
      />}
      {showRefValues && refsManquants.length > 0 && <MiseEnExergue>{`${refsManquantsTitre} ${refsManquants.join(", ")}`}</MiseEnExergue>}
      <Transcription
        entêteLibellé={enteteLibelle}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiants={identifiants}
        libellés={libelles}
        nomGraph={nomGraph}
        valeurs={valeursTranscriptions}
      />
    </>
  );
};

export default HistogrammeHorizontalAvecRef;

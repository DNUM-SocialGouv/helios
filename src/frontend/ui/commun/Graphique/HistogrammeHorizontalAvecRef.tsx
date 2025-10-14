import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import { couleurDesTraitsRefHistogramme, CouleurHistogramme } from "./couleursGraphique";
import styles from "./HistogrammeHorizontaux.module.css";
import { ColorLabel } from "../ColorLabel/ColorLabel";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { Transcription } from "../Transcription/Transcription";


type HistogrammeHorizontalAvecRefProps = {
  enteteLibelle: string;
  couleursDeLHistogramme: CouleurHistogramme[]
  valeursDesHistogrammes: number[];
  valeursDesHistogrammesRef: number[];
  libelles: string[];
  identifiants: string[];
  refsManquantsTitre?: string;
  refsManquants: string[];
  epaisseur?: "FIN" | "EPAIS";
};
const HistogrammeHorizontalAvecRef = (
  { couleursDeLHistogramme,
    epaisseur,
    enteteLibelle,
    valeursDesHistogrammes,
    valeursDesHistogrammesRef,
    libelles,
    refsManquantsTitre,
    refsManquants,
    identifiants
  }: HistogrammeHorizontalAvecRefProps) => {
  const { wording } = useDependencies();

  const ASPECT_RATIO = epaisseur === "EPAIS" ? 5 : 7;
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
        data: valeursDesHistogrammesRef,
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
    maintainAspectRatio: false,
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
        grid: { drawOnChartArea: false, drawTicks: false },
      },
    },
    plugins: {
      datalabels: {
        align: "start",
        color: "#000",
        anchor: () => {
          return "end";
        },
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const value = valeursDesHistogrammes[index];
            const refValue = valeursDesHistogrammesRef[index];
            const refValueText = refValue ? `${refValue} ` : 'Non renseignée'

            return [`Valeur: ${value}`,
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
      chart.getDatasetMeta(0).data.forEach((bar: any, index: number) => {
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
      });
    },
  }

  return (
    <>
      <div className={styles["flexContainer"]}>
        {/* @ts-ignore */}
        <Bar data={data} options={{ ...optionsHistogramme, aspectRatio }} plugins={[valeursRefPlugin]}
        />
      </div>
      <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDesTraitsRefHistogramme, label: wording.MOYENNE_REF, circle: false }
        ]}
      />
      {refsManquants.length > 0 && <MiseEnExergue>{`${refsManquantsTitre} ${refsManquants.join(", ")}`}</MiseEnExergue>}
      <Transcription
        entêteLibellé={enteteLibelle}
        identifiants={identifiants}
        libellés={libelles}
        valeurs={[valeursDesHistogrammes, valeursDesHistogrammesRef]}
      />
    </>
  );
};

export default HistogrammeHorizontalAvecRef;

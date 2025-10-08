import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

import { CouleurHistogramme, couleurDesTraitsRefHistogramme } from "./couleursGraphique";
import { ColorLabel } from "../ColorLabel/ColorLabel";
import { useDependencies } from "../contexts/useDependencies";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";

type HistogrammeVerticalAvecRefProps = Readonly<{
  valeurs: number[];
  valeursRef: number[];
  couleursDeLHistogramme: CouleurHistogramme[];
  libelles: (number | string)[];
  type: string;
  tickFormatter: (type: string, index: number) => string;
  tickX2Formatter: (type: string, index: number) => string;
  identifiants: string[];
}>;

const HistogrammeVerticalAvecRef = ({ valeurs, valeursRef, couleursDeLHistogramme, libelles, type, tickFormatter, tickX2Formatter,identifiants }: HistogrammeVerticalAvecRefProps) => {
  const { wording } = useDependencies();

  const data: ChartData = {
    datasets: [
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
        data: valeurs,
        datalabels: { labels: { title: { color: valeurs.map(() => "#000") } } },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.secondPlan),
        data: valeursRef,
        datalabels: { display: false },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
    ],
    labels: libelles,
  };

  const optionsHistogrammeVertical: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    // intersect : false  avec mode : "index" => au survol du segment, on affiche la même tooltip.
    // on affiche la tooltip qui correspond à la valeur , donc index 0 . Et on ignore la tooltip de la barre Référence (pour cela on ajout 'filter' dans tooltip)
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
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
        formatter: (value: number, _context: Context): string => value.toLocaleString("fr") + " %",
      },
      legend: { display: false },
      tooltip: {
        filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const value = valeurs[index];
            const refValue = valeursRef[index];

            return [`Valeur: ${Math.abs(value)}`,
            `Valeur de référence: ${Math.abs(refValue)}`];
          },
        },
      },      // @ts-ignore
      rotationRef: { valeursRef } as any,
    },
    scales: {
      x: {
        border: {
          display: false
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        stacked: true,
        ticks: {
          color: '#000',
          callback: (_tickValue, index) => tickFormatter(type, index),
          font: function (context: any) {
            if (context.index === libelles.length - 1) {
              return { weight: 'bold' };
            }
            return {};
          },
        }
      },
      xAxis2: {
        type: 'category',
        position: 'bottom',
        border: {
          display: false
        },
        grid: { drawOnChartArea: false, drawTicks: false },
        ticks: {
          color: '#000',
          callback: (_tickValue, index) => tickX2Formatter(type, index),
          font: function (context: any) {
            if (context.tick.label === new Date().getFullYear().toString()) {
              return { weight: 'bold' };
            }
            return {};
          },
          maxRotation: 0,
          autoSkip: false
        }
      },
      y: {
        display: false,
      },
    }
  }

  const rotationRefPlugin = {
    id: "rotationRef",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
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

  return (
    <>
      <Bar
        // @ts-ignore
        data={data}
        options={optionsHistogrammeVertical}
        plugins={[rotationRefPlugin]}
      />
      <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDesTraitsRefHistogramme, label: wording.MOYENNE_REF, circle: false }

        ]}
      />
      <Transcription
        entêteLibellé={wording.ANNÉE}
        //TODO: L'identifiant n'est pas bon. 
        identifiants={identifiants}
        libellés={libelles}
        valeurs={[StringFormater.addPercentToValues(valeurs), StringFormater.addPercentToValues(valeursRef)]}
      />
    </>
  );
}

export default HistogrammeVerticalAvecRef;

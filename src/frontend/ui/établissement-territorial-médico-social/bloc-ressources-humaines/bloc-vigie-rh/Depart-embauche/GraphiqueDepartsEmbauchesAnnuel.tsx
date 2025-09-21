import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";


import { DepartEmbauche } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { ColorLabel } from "../../../../commun/ColorLabel/ColorLabel";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import {
  couleurDuFondHistogrammeOrangeClair,
  couleurDuFondHistogrammeJaune,
  couleurDesTraitsRefHistogramme,
  couleurExtensionHistogrammeJaune,
  couleurExtensionHistogrammeOrangeClair
} from "../../../../commun/Graphique/couleursGraphique";
import { Transcription } from "../../../../commun/Transcription/Transcription";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type GraphiqueDepartEmbauchesAnnuelProps = Readonly<{
  donneesDepartsEmbauches: DepartEmbauche[]
}>;

const GraphiqueDepartEmbauchesAnnuel = ({ donneesDepartsEmbauches }: GraphiqueDepartEmbauchesAnnuelProps) => {

  const { wording } = useDependencies();

  const libelles = donneesDepartsEmbauches.map((donnee) => donnee.annee);
  const donneesDeparts = donneesDepartsEmbauches.map((donnee) => -Math.abs(donnee.depart));
  const donneesEmbauches = donneesDepartsEmbauches.map((donnee) => donnee.embauche);
  const donneesDepartsRef = donneesDepartsEmbauches.map((donnee) => -Math.abs(donnee.departRef));
  const donneesEmbauchesRef = donneesDepartsEmbauches.map((donnee) => donnee.embaucheRef);

  const donneesDepartsExtension = donneesDepartsRef.map((val, idx) => - Math.max(0, donneesDeparts[idx] - val));
  const donneesEmbauchesExtension = donneesEmbauchesRef.map((val, idx) => Math.max(0, val - donneesEmbauches[idx]));

  const valeursNegativesRefPlugin = {
    id: "valeursNegativesRef",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      const { donneesDepartsRef } = options;
      const values = donneesDepartsRef;
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
  };

  const valeursPositivesRefPlugin = {
    id: "valeursPositivesRef",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      const { donneesEmbauchesRef } = options;
      const values = donneesEmbauchesRef;
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
  };

  const dataSet = {
    labels: libelles,
    datasets: [
      {
        label: wording.EMBAUCHES,
        data: donneesEmbauches,
        backgroundColor: couleurDuFondHistogrammeJaune,
        stack: "combined",
      },
      {
        label: wording.DEPARTS,
        data: donneesDeparts,
        backgroundColor: couleurDuFondHistogrammeOrangeClair,
        stack: "combined",
      },
      {
        label: "embauches-extension",
        data: donneesEmbauchesExtension,
        backgroundColor: couleurExtensionHistogrammeJaune,
        stack: "combined",
      },
      {
        label: "depart-extension",
        data: donneesDepartsExtension,
        backgroundColor: couleurExtensionHistogrammeOrangeClair,
        stack: "combined",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        color: "#000",
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
        display: (context: any) => {
          // Afficher les labels uniquement pour les datasets principaux
          return context.dataset.label === wording.DEPARTS || context.dataset.label === wording.EMBAUCHES;
        },
        formatter: (value: number) => {
          return Math.abs(value)
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const datasetLabel = context.dataset.label;
            const embaucheChart = datasetLabel.toLowerCase().includes("embauches");

            const value = embaucheChart ? donneesEmbauches[index] : donneesDeparts[index];
            const refValue = embaucheChart ? donneesEmbauchesRef[index] : donneesDepartsRef[index];

            return [`Valeur: ${Math.abs(value)}`,
            `Valeur de référence: ${Math.abs(refValue)}`];
          },
        },
      },
      legend: { display: false },
      valeursPositivesRef: { donneesEmbauchesRef },
      valeursNegativesRef: { donneesDepartsRef },
    },
    scales: {
      x: {
        stacked: true,
        grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
        ticks: {
          color: '#000',
          font: function (context: any) {
            if (context.tick.label === new Date().getFullYear()) {
              return { weight: 'bold' };
            }
            return {};
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          drawTicks: false,
          color: (context: any) =>
            context.tick.value === 0 ? "black" : "transparent",
          lineWidth: (context: any) =>
            context.tick.value === 0 ? 2 : 0,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-2xl shadow">
      <Bar data={dataSet} options={options} plugins={[valeursNegativesRefPlugin, valeursPositivesRefPlugin]} />
      <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDuFondHistogrammeJaune, label: wording.EMBAUCHES, circle: true },
          { color: couleurDuFondHistogrammeOrangeClair, label: wording.DEPARTS, circle: true },
          { color: couleurDesTraitsRefHistogramme, label: wording.MOYENNE_REF, circle: false }

        ]}
      />
      <Transcription
        disabled={false}
        entêteLibellé={wording.ANNÉE}
        identifiants={[wording.DEPARTS, wording.DEPARTS_REF, wording.EMBAUCHES, wording.EMBAUCHES_REF]}
        libellés={libelles}
        valeurs={[donneesDeparts.map(Math.abs), donneesDepartsRef.map(Math.abs), donneesEmbauches, donneesEmbauchesRef]}
      />
    </div>
  );
};

export default GraphiqueDepartEmbauchesAnnuel;

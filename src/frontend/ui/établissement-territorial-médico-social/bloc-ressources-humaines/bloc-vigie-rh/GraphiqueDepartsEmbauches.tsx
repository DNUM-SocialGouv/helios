import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";


import { DepartEmbauche } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { ColorLabel } from "../../../commun/ColorLabel/ColorLabel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import {
  couleurDuFondHistogrammeOrangeClair,
  couleurDuFondHistogrammeJaune
} from "../../../commun/Graphique/couleursGraphique";
import { Transcription } from "../../../commun/Transcription/Transcription";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type GraphiqueDepartEmbauchesProps = Readonly<{
  donneesDepartsEmbauches: DepartEmbauche[]
}>;

const GraphiqueDepartEmbauches = ({ donneesDepartsEmbauches }: GraphiqueDepartEmbauchesProps) => {

  const { wording } = useDependencies();

  const libelles = donneesDepartsEmbauches.map((donnee) => donnee.annee);
  const donneesDeparts = donneesDepartsEmbauches.map((donnee) => -Math.abs(donnee.depart));
  const donneesEmbauches = donneesDepartsEmbauches.map((donnee) => donnee.embauche);

  const dataTest = {
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
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        color: "#000",
        formatter: (value: number) => {
          return Math.abs(value)
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return context.dataset.label + ": " + Math.abs(value);
          },
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        stacked: true,
        grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-2xl shadow">
      <Bar data={dataTest} options={options} />
      <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDuFondHistogrammeJaune, label: wording.EMBAUCHES },
          { color: couleurDuFondHistogrammeOrangeClair, label: wording.DEPARTS }
        ]}
      />
      <Transcription
        disabled={false}
        entêteLibellé={wording.ANNÉE}
        identifiants={[wording.DEPARTS, wording.EMBAUCHES]}
        libellés={libelles}
        valeurs={[donneesDeparts, donneesEmbauches]}
      />
    </div>
  );
};

export default GraphiqueDepartEmbauches;

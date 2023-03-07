import { Chart as ChartJS, ChartData } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";

export type HistogrammeLine = {
  labels: string[];
  stacks: { label?: string; data: number[]; backgroundColor: string[] }[];
  totals: number[];
};

type HistogrammeHorizontalNewProps = {
  nom: string;
  valeursDeGauche: HistogrammeLine;
  valeursDeDroite: HistogrammeLine;
  entêteDroite: string;
  entêteGauche: string;
  annéesManquantes: number[] | string[];
  nombreDAnnéeTotale: number;
  légendes?: string[];
};

function buildChartData(valeurs: HistogrammeLine, couleurIdentifiant = ["#000"]): ChartData {
  return {
    labels: valeurs.labels,
    datasets: valeurs.stacks.map((stack) => {
      return {
        ...stack,
        data: stack.data.map(Math.abs),
        barThickness: 25,
        datalabels: {
          font: { weight: "bold" },
          labels: { title: { color: couleurIdentifiant } },
        },
      };
    }),
  };
}

export const DeuxHistogrammesHorizontauxNew = ({
  nom,
  valeursDeGauche,
  valeursDeDroite,
  entêteGauche,
  entêteDroite,
  annéesManquantes,
  nombreDAnnéeTotale = 5,
  légendes,
}: HistogrammeHorizontalNewProps): ReactElement => {
  // TODO : gérer le total quand on a plusieurs stacks
  const { wording } = useDependencies();

  const dataGauche: ChartData = buildChartData(valeursDeGauche);
  const dataDroite: ChartData = buildChartData(valeursDeDroite);
  const optionsGauche = getOptionsHistogramme(entêteGauche, valeursDeGauche.totals);
  const optionsDroite = getOptionsHistogramme(entêteDroite, valeursDeDroite.totals);

  function getTranscriptionTitles(): string[] {
    return [valeursDeGauche.stacks.map((stack) => stack.label), valeursDeDroite.stacks.map((stack) => stack.label)].flat() as string[];
  }

  function getTranscriptionValeurs() {
    return [
      valeursDeGauche.stacks.flatMap((stack) => stack.data.map(StringFormater.formateLeMontantEnEuros)),
      valeursDeDroite.stacks.flatMap((stack) => stack.data.map(StringFormater.formateLeMontantEnEuros)),
    ];
  }

  return (
    <>
      {annéesManquantes.length < nombreDAnnéeTotale && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 50%)",
          }}
        >
          <div>
            {/*
           // @ts-ignore */}
            <Bar data={dataGauche} options={optionsGauche} />
          </div>
          <div>
            {/*
          // @ts-ignore */}
            <Bar data={dataDroite} options={optionsDroite} />
          </div>
        </div>
      )}
      {annéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(", ")}`}</MiseEnExergue>}
      {légendes && <LegendeDeuxHistogrammes color={valeursDeGauche.stacks.map((stack) => stack.backgroundColor[0])} legends={légendes} />}
      <Transcription
        disabled={annéesManquantes.length === nombreDAnnéeTotale}
        entêteLibellé={nom}
        identifiantUnique={nom}
        identifiants={getTranscriptionTitles()}
        libellés={valeursDeDroite.labels}
        valeurs={getTranscriptionValeurs()}
      />
    </>
  );
};

function LegendeDeuxHistogrammes({ legends, color }: { legends: string[]; color: string[] }) {
  return (
    <ul
      aria-hidden="true"
      className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]}
      style={{ justifyContent: "center", gridAutoFlow: "column" }}
    >
      {legends.map((légende, index) => (
        <li key={légende}>
          <span style={{ background: color[index] }}>&nbsp;</span>
          {légende}
        </li>
      ))}
    </ul>
  );
}

function getOptionsHistogramme(entête: string, totals: number[], stacked = true, aspectRatio = 2) {
  const couleurIdentifiant = "#000";
  const couleurDelAbscisse = "#161616";
  const valeurMax = Math.max(...totals.map(Math.abs));

  return {
    animation: false,
    aspectRatio,
    indexAxis: "y",
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        max: 1.45 * (valeurMax > 0 ? valeurMax : 1),
        stacked,
        min: 0,
        position: "top",
        ticks: { display: false },
        title: {
          align: "start",
          color: couleurIdentifiant,
          display: entête !== "",
          font: { weight: "bold" },
          text: entête,
        },
      },
      y: {
        stacked,
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          color: couleurDelAbscisse,
          font: { weight: ["400"] },
          padding: 8,
        },
      },
    },
    plugins: {
      htmlLegend: { containerID: "test" }, // A variabiliser
      datalabels: {
        align: "end",
        anchor: "end",
        font: {
          family: "Marianne",
          size: 14,
        },
        formatter: (_: string, _context: Context): string => {
          // A voir si on variabilise ou si on adapte le format des données qui permettrai d'afficher de la même manière
          const sum = totals[_context.dataIndex];
          return _context.datasetIndex === _context.chart.data.datasets.length - 1 ? StringFormater.formateLeMontantEnEuros(sum) : "";
        },
      },
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
}

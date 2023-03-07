import { Chart as ChartJS, ChartData } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";
import { optionsHistogrammeHorizontal } from "./HistogrammeHorizontal";

type HistogrammeHorizontalProps = {
  valeursDeGauche: number[];
  valeursDeDroite: number[];
  libellés: string[];
  ratioLargeurSurHauteur: number;
  entêtePremièreColonne: string;
  entêtesDesAutresColonnes: string[];
  annéesManquantes: number[] | string[];
  nombreDAnnéeTotale: number;
};

export const DeuxHistogrammeHorizontaux = ({
  valeursDeGauche,
  valeursDeDroite,
  libellés,
  ratioLargeurSurHauteur,
  entêtePremièreColonne,
  entêtesDesAutresColonnes,
  annéesManquantes,
  nombreDAnnéeTotale = 3,
}: HistogrammeHorizontalProps): ReactElement => {
  const { wording } = useDependencies();

  const couleurDuFondHistogrammeDeDépassement = "#C9191E";
  const couleurDeLaValeur = "#3A3A3A";
  const couleurDuFondHistogrammePrimaire = "#000091";
  const couleurDuFondHistogrammeSecondaire = "#4E68BB";

  const chartColors = [
    couleurDuFondHistogrammePrimaire,
    couleurDuFondHistogrammeSecondaire,
    couleurDuFondHistogrammeSecondaire,
    couleurDuFondHistogrammeSecondaire,
    couleurDuFondHistogrammeSecondaire,
  ];

  ChartJS.unregister();
  const chartColorsGauche = valeursDeGauche.map((valeurDeGauche, index) => {
    return valeurDeGauche <= 0 ? chartColors[index] : couleurDuFondHistogrammeDeDépassement;
  });
  const chartColorsDroite = valeursDeDroite.map((valeurDeDroite, index) => {
    return valeurDeDroite >= 0 ? chartColors[index] : couleurDuFondHistogrammeDeDépassement;
  });
  const datalabelsColorsGauche = valeursDeGauche.map((valeurDeGauche) => {
    return valeurDeGauche <= 0 ? couleurDeLaValeur : couleurDuFondHistogrammeDeDépassement;
  });
  const datalabelsColorsDroite = valeursDeDroite.map((valeurDeDroite) => {
    return valeurDeDroite >= 0 ? couleurDeLaValeur : couleurDuFondHistogrammeDeDépassement;
  });
  const dataGauche: ChartData = {
    datasets: [
      {
        backgroundColor: chartColorsGauche,
        data: valeursDeGauche.map((valeurDeGauche) => Math.abs(valeurDeGauche)),
        datalabels: {
          font: { weight: "bold" },
          formatter: (valeurDeGauche) => {
            const valeurDeGaucheSignée = valeursDeGauche.includes(valeurDeGauche) ? valeurDeGauche : valeurDeGauche * -1;
            return StringFormater.formateLeMontantEnEuros(valeurDeGaucheSignée);
          },
          labels: { title: { color: datalabelsColorsGauche } },
        },
        maxBarThickness: 60,
        type: "bar",
        yAxisID: "y",
      },
    ],
    labels: libellés,
  };
  const dataDroite: ChartData = {
    datasets: [
      {
        backgroundColor: chartColorsDroite,
        data: valeursDeDroite,
        datalabels: {
          font: { weight: "bold" },
          formatter: (valeurDeDroite) => StringFormater.formateLeMontantEnEuros(valeurDeDroite),
          labels: { title: { color: datalabelsColorsDroite } },
        },
        maxBarThickness: 60,
        type: "bar",
        yAxisID: "y",
      },
    ],
    labels: libellés,
  };
  const valeursTableau = [valeursDeGauche.map(StringFormater.formateLeMontantEnEuros), valeursDeDroite.map(StringFormater.formateLeMontantEnEuros)];

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
            <Bar
              // @ts-ignore
              data={dataGauche}
              options={optionsHistogrammeHorizontal(
                ratioLargeurSurHauteur,
                Math.max(...valeursDeGauche.map(Number), ...valeursDeDroite.map(Number)) * 1.1,
                ["400"],
                entêtesDesAutresColonnes[0]
              )}
              redraw={true}
            />
          </div>
          <div>
            <Bar
              // @ts-ignore
              data={dataDroite}
              options={optionsHistogrammeHorizontal(
                ratioLargeurSurHauteur,
                Math.max(...valeursDeGauche.map(Number), ...valeursDeDroite.map(Number)),
                ["400"],
                entêtesDesAutresColonnes[1]
              )}
              redraw={true}
            />
          </div>
        </div>
      )}
      {annéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(", ")}`}</MiseEnExergue>}
      <Transcription
        disabled={annéesManquantes.length === nombreDAnnéeTotale}
        entêteLibellé={entêtePremièreColonne}
        identifiantUnique="compte-de-resultat"
        identifiants={entêtesDesAutresColonnes}
        libellés={libellés}
        valeurs={valeursTableau}
      />
    </>
  );
};

export type HistogrammeLine = {
  labels: string[];
  stacks: { label: string; data: number[]; backgroundColor: string[] }[];
  totals: number[];
};

type HistogrammeHorizontalNewProps = {
  valeursDeGauche: HistogrammeLine;
  valeursDeDroite: HistogrammeLine;
  entêteDroite: string;
  entêteGauche: string;
  annéesManquantes: number[] | string[];
  nombreDAnnéeTotale: number;
  légendes: string[];
};

function buildChartData(valeurs: HistogrammeLine): ChartData {
  const couleurIdentifiant = "#000";
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
  valeursDeGauche,
  valeursDeDroite,
  entêteGauche,
  entêteDroite,
  annéesManquantes,
  nombreDAnnéeTotale = 5,
  légendes,
}: HistogrammeHorizontalNewProps): ReactElement => {
  const { wording } = useDependencies();

  const dataGauche: ChartData = buildChartData(valeursDeGauche);
  const dataDroite: ChartData = buildChartData(valeursDeDroite);
  const optionsGauche = getOptionsHistogramme(entêteGauche, valeursDeGauche.totals);
  const optionsDroite = getOptionsHistogramme(entêteDroite, valeursDeDroite.totals);

  function getTranscriptionTitles() {
    return [
      valeursDeGauche.stacks[0].label,
      valeursDeGauche.stacks[1].label,
      wording.CHARGES_TOTALES,
      valeursDeDroite.stacks[0].label,
      valeursDeDroite.stacks[1].label,
      wording.PRODUITS_TOTALES,
    ];
  }

  function getTranscriptionValeurs() {
    return [
      valeursDeGauche.stacks[0].data.map(StringFormater.formateLeMontantEnEuros),
      valeursDeGauche.stacks[1].data.map(StringFormater.formateLeMontantEnEuros),
      valeursDeGauche.totals.map(StringFormater.formateLeMontantEnEuros),
      valeursDeDroite.stacks[0].data.map(StringFormater.formateLeMontantEnEuros),
      valeursDeDroite.stacks[1].data.map(StringFormater.formateLeMontantEnEuros),
      valeursDeDroite.totals.map(StringFormater.formateLeMontantEnEuros),
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
      <LegendeDeuxHistogrammes color={valeursDeGauche.stacks.map((stack) => stack.backgroundColor[0])} legends={légendes} />
      <Transcription
        disabled={annéesManquantes.length === nombreDAnnéeTotale}
        entêteLibellé="Compte de résultat - CF"
        identifiantUnique="compte-de-resultat-cf"
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

function getOptionsHistogramme(entête: string, totals: number[], stacked = true, aspectRatio = 5) {
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

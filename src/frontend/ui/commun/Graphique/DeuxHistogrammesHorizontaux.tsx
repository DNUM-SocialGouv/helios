import { Chart as ChartJS, ChartData } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

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
  stacks: { data: number[]; backgroundColor: string[] }[];
  totals: number[];
};

type HistogrammeHorizontalNewProps = {
  valeursDeGauche: HistogrammeLine;
  valeursDeDroite: HistogrammeLine;
  ratioLargeurSurHauteur: number;
  entêteDroite: string;
  entêteGauche: string;
};

export const DeuxHistogrammeHorizontauxNew = ({
  valeursDeGauche,
  valeursDeDroite,
  entêteGauche,
  entêteDroite,
}: HistogrammeHorizontalNewProps): ReactElement => {
  /*
   * TODO : - Couleur des stack
   *  - ok : Changer le format de la donnée en entrée pour mieux correspondre à chartData
   *  - ok : Faire les deux histogrammes
   *  - Refacto
   *  - ok : Reprendre les options (tailles..)
   *  - Gestion des années
   *  - Transcription
   *  - ok : Gestion de la taille max
   * */
  const couleurIdentifiant = "#000";

  const dataGauche: ChartData = {
    labels: valeursDeGauche.labels,
    datasets: valeursDeGauche.stacks.map((stack) => {
      return {
        ...stack,
        data: stack.data.map(Math.abs),
        maxBarThickness: 60,
        datalabels: { font: { weight: "bold" }, labels: { title: { color: couleurIdentifiant } } },
      };
    }),
  };

  const dataDroite: ChartData = {
    labels: valeursDeDroite.labels,
    datasets: valeursDeDroite.stacks.map((stack) => {
      return {
        ...stack,
        data: stack.data.map(Math.abs),
        maxBarThickness: 60,
        datalabels: { font: { weight: "bold" }, labels: { title: { color: couleurIdentifiant } } },
      };
    }),
  };

  const valeurMaxGauche = Math.max(...valeursDeGauche.totals.map(Math.abs));
  const optionsGauche = getOptionsHistogramme(valeurMaxGauche, entêteGauche, valeursDeGauche.totals);
  const valeurMaxDroite = Math.max(...valeursDeDroite.totals.map(Math.abs));
  const optionsDroite = getOptionsHistogramme(valeurMaxDroite, entêteDroite, valeursDeDroite.totals);
  return (
    <>
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
            // @ts-ignore
            options={optionsGauche}
          />
        </div>
        <div>
          <Bar
            // @ts-ignore
            data={dataDroite}
            // @ts-ignore
            options={optionsDroite}
          />
        </div>
      </div>
    </>
  );
};

function getOptionsHistogramme(valeurMax: number, entête: string, totals: number[]) {
  const couleurIdentifiant = "#000";
  const couleurDelAbscisse = "#161616";

  return {
    animation: false,
    indexAxis: "y",
    scales: {
      x: {
        max: valeurMax * 1.2,
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
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
        stacked: true,
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          color: couleurDelAbscisse,
          // @ts-ignore
          font: { weight: ["400"] },
          padding: 8,
        },
      },
    },
    plugins: {
      datalabels: {
        align: "end",
        anchor: "end",
        font: {
          family: "Marianne",
          size: 14,
        },
        formatter: (_: string, _context: Context): string => {
          const sum = totals[_context.dataIndex];
          return _context.datasetIndex === _context.chart.data.datasets.length - 1 ? StringFormater.formateLeMontantEnEuros(sum) : "";
        },
      },
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
}

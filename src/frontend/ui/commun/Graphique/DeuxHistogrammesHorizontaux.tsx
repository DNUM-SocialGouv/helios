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

/* TODO :
 *   - Completer la popin de détail :https://msociauxfr.sharepoint.com/:x:/r/teams/Helios/_layouts/15/Doc.aspx?sourcedoc=%7B0ECFD419-6C35-4F40-A533-F6F6920A207F%7D&file=HELIOS_FICHES%20INDICATEURS.xlsx&_DSL=1&action=default&mobileredirect=true
 *   - Ajouter la légende
 *   - Ajouter les valeurs Bugdet Annexe et Principale dans la transcription
 *   - Ajout tests
 *
 *   - Fusionner Histogramme et HistogrammeNew
 *   - Refacto gestion de la liste des années
 * */

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
      <menu className={"fr-checkbox-group " + stylesBlocActivité["graphique-sanitaire-légende"]} id="test" />
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

function getOptionsHistogramme(entête: string, totals: number[]) {
  const couleurIdentifiant = "#000";
  const couleurDelAbscisse = "#161616";
  const valeurMax = Math.max(...totals.map(Math.abs));

  return {
    animation: false,
    indexAxis: "y",
    scales: {
      x: {
        max: valeurMax * 1.3,
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
      htmlLegend: { containerID: "test" },
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

import { Chart as ChartJS, ChartData } from "chart.js";
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
  stacks: number[];
  total: number;
  libellé: string;
  stacksColors: string[];
};

type HistogrammeHorizontalNewProps = {
  valeursDeGauche: HistogrammeLine[];
  valeursDeDroite: HistogrammeLine[];
  libellés: string[];
  ratioLargeurSurHauteur: number;
  entêtePremièreColonne: string;
  entêtesDesAutresColonnes: string[];
  annéesManquantes: number[] | string[];
  nombreDAnnéeTotale: number;
};

export const DeuxHistogrammeHorizontauxNew = ({
  valeursDeGauche,
  valeursDeDroite,
  ratioLargeurSurHauteur,
  entêtesDesAutresColonnes,
}: HistogrammeHorizontalNewProps) : ReactElement => {

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
    </>
  );
};

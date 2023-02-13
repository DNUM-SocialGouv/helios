import { ChartData, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { TableIndicateur } from "../TableIndicateur/TableIndicateur";
import { CouleurHistogramme, LibelléDeDonnéeGraphe, LibelléDeTickGraphe } from "./GraphiqueViewModel";

type HistogrammeHorizontalProps = {
  valeurs: number[];
  libellés: (number | string)[];
  couleursDeLHistogramme: CouleurHistogramme[];
  libellésDesValeurs: LibelléDeDonnéeGraphe[];
  libellésDesTicks: LibelléDeTickGraphe[];
  ratioLargeurSurHauteur: number;
  entêteLibellé: string;
  identifiant: string;
  libellésDeValeursManquantes: number[] | string[];
  nombreDeLibelléTotal: number;
};

function optionsHistogrammeHorizontal(
  ratioLargeurSurHauteur: number,
  valeurMaximale: number,
  grosseursDePoliceDesLibellés: string[],
  title: string = ""
): ChartOptions<"bar"> {
  const couleurDelAbscisse = "#161616";
  const couleurIdentifiant = "#000";

  return {
    animation: false,
    aspectRatio: ratioLargeurSurHauteur,
    indexAxis: "y",
    plugins: {
      datalabels: {
        align: "end",
        anchor: "end",
        font: {
          family: "Marianne",
          size: 14,
        },
        formatter: (value: string, _context: Context): string => parseFloat(value).toLocaleString("fr"),
      },
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        max: 1.45 * (valeurMaximale > 0 ? valeurMaximale : 1),
        min: 0,
        position: "top",
        ticks: { display: false },
        title: {
          align: "start",
          color: couleurIdentifiant,
          display: title === "" ? false : true,
          font: { weight: "bold" },
          text: title,
        },
      },
      y: {
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          color: couleurDelAbscisse,
          // @ts-ignore
          font: { weight: grosseursDePoliceDesLibellés },
          padding: 8,
        },
      },
    },
  };
}

export const HistogrammeHorizontal = ({
  valeurs,
  libellés,
  couleursDeLHistogramme,
  libellésDesValeurs,
  libellésDesTicks,
  ratioLargeurSurHauteur,
  entêteLibellé,
  identifiant,
  libellésDeValeursManquantes,
  nombreDeLibelléTotal = 3,
}: HistogrammeHorizontalProps): ReactElement => {
  const { wording } = useDependencies();

  const data: ChartData = {
    datasets: [
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
        data: valeurs,
        datalabels: { labels: { title: { color: libellésDesValeurs.map((libellé) => libellé.couleur) } } },
        maxBarThickness: 60,
        type: "bar",
        yAxisID: "y",
      },
    ],
    labels: libellés,
  };
  const valeursFrançaises = StringFormater.formateEnFrançais(valeurs);

  return (
    <>
      {libellésDeValeursManquantes.length < nombreDeLibelléTotal && (
        <Bar
          // @ts-ignore
          data={data}
          options={optionsHistogrammeHorizontal(
            ratioLargeurSurHauteur,
            Math.max(...valeurs),
            libellésDesTicks.map((libellé) => libellé.tailleDePolice)
          )}
        />
      )}
      {libellésDeValeursManquantes.length > 0 && (
        <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${libellésDeValeursManquantes.join(", ")}`}</MiseEnExergue>
      )}
      <TableIndicateur
        disabled={libellésDeValeursManquantes.length === nombreDeLibelléTotal}
        entêteLibellé={entêteLibellé}
        identifiants={[identifiant]}
        libellés={libellés}
        valeurs={[valeursFrançaises]}
      />
    </>
  );
};

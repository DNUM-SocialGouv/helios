import { ChartData } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";

import stylesBlocActivité from "../../établissement-territorial-sanitaire/bloc-activité/BlocActivitéSanitaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";

export class HistogrammeLine {
  couleurIdentifiant = ["#000"];
  constructor(
    public labels: string[],
    public totals: number[],
    public stacks: { label?: string; data: number[]; backgroundColor: string[] }[],
    public nom: string
  ) {}

  public chartData(): ChartData {
    return {
      labels: this.labels,
      datasets: this.stacks.map((stack) => {
        return {
          ...stack,
          data: stack.data.map(Math.abs),
          barThickness: 25,
          datalabels: {
            font: { weight: "bold" },
            labels: { title: { color: this.couleurIdentifiant } },
          },
        };
      }),
    };
  }

  public getTranscriptionTitles(): string[] {
    return this.stacks.map((stack) => stack.label) as string[];
  }

  public getTranscriptionValeurs(): string[] {
    return this.stacks.flatMap((stack) => stack.data.map(StringFormater.formateLeMontantEnEuros));
  }

  public legendColors(): string[] {
    return this.stacks.map((stack) => stack.backgroundColor[0]);
  }

  public getOptionsHistogramme(aspectRatio = 2) {
    const couleurIdentifiant = "#000";
    const couleurDelAbscisse = "#161616";
    const valeurMax = Math.max(...this.totals.map(Math.abs));

    return {
      animation: false,
      aspectRatio,
      indexAxis: "y",
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          max: 1.45 * (valeurMax > 0 ? valeurMax : 1),
          stacked: true,
          min: 0,
          position: "top",
          ticks: { display: false },
          title: { align: "start", color: couleurIdentifiant, display: this.nom !== "", font: { weight: "bold" }, text: this.nom },
        },
        y: {
          stacked: true,
          grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
          ticks: { color: couleurDelAbscisse, font: { weight: ["400"] }, padding: 8 },
        },
      },
      plugins: {
        htmlLegend: { containerID: "test" },
        datalabels: {
          align: "end",
          anchor: "end",
          font: { family: "Marianne", size: 14 },
          formatter: (_: string, _context: Context): string => {
            const sum = this.totals[_context.dataIndex];
            return _context.datasetIndex === _context.chart.data.datasets.length - 1 ? StringFormater.formateLeMontantEnEuros(sum) : "";
          },
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };
  }
}

type HistogrammeHorizontalNewProps = {
  nom: string;
  valeursDeGauche: HistogrammeLine;
  valeursDeDroite: HistogrammeLine;
  annéesManquantes: number[] | string[];
  nombreDAnnéeTotale: number;
  légendes?: string[];
};
export const DeuxHistogrammesHorizontaux = ({
  nom,
  valeursDeGauche,
  valeursDeDroite,
  annéesManquantes,
  nombreDAnnéeTotale = 5,
  légendes,
}: HistogrammeHorizontalNewProps): ReactElement => {
  // TODO : gérer le total quand on a plusieurs stacks
  const { wording } = useDependencies();

  function getTranscriptionTitles(): string[] {
    return [valeursDeGauche.getTranscriptionTitles(), valeursDeDroite.getTranscriptionTitles()].flat() as string[];
  }

  function getTranscriptionValeurs() {
    return [valeursDeGauche.getTranscriptionValeurs(), valeursDeDroite.getTranscriptionValeurs()];
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
            <Bar data={valeursDeGauche.chartData()} options={valeursDeGauche.getOptionsHistogramme()} />
          </div>
          <div>
            {/*
          // @ts-ignore */}
            <Bar data={valeursDeDroite.chartData()} options={valeursDeDroite.getOptionsHistogramme()} />
          </div>
        </div>
      )}
      {annéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(", ")}`}</MiseEnExergue>}
      {légendes && <LegendeDeuxHistogrammes color={valeursDeGauche.legendColors()} legends={légendes} />}
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

import { ChartData, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

import { TauxRotationTrimestriel } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { couleurDuFondHistogrammeJaune, couleurExtensionHistogrammeJaune } from "../../../../commun/Graphique/couleursGraphique";
import { StringFormater } from "../../../../commun/StringFormater";
import { Transcription } from "../../../../commun/Transcription/Transcription";

type GraphiqueTauxRotationAnnuelProps = Readonly<{
  donneesTauxRotationTrimestriels: TauxRotationTrimestriel[],
}>;

const GraphiqueTauxRotationTrimestriel = ({ donneesTauxRotationTrimestriels }: GraphiqueTauxRotationAnnuelProps) => {
  const { wording } = useDependencies();
  const {
    libelles, valeurs, couleursDeLHistogramme
  } = useMemo(() => {
    const libelles = donneesTauxRotationTrimestriels.map(d => `${d.annee}-T${d.trimestre}`);
    const valeurs = donneesTauxRotationTrimestriels.map((donnee) => StringFormater.transformInRoundedRate(donnee.rotation))
    const couleursDeLHistogramme = donneesTauxRotationTrimestriels.map(() => {
      return {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      }
    })
    return { libelles, valeurs, couleursDeLHistogramme };
  }, [donneesTauxRotationTrimestriels]);

  const borneMaximale = 105;
  const borneMinimale = -1;

  const data: ChartData = {
    datasets: [
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
        data: valeurs,
        datalabels: { labels: { title: { color: donneesTauxRotationTrimestriels.map(() => "#000") } } },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.secondPlan),
        data: Array(valeurs.length).fill(100),
        datalabels: { display: false },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
    ],
    labels: donneesTauxRotationTrimestriels.map((donnee) => donnee.trimestre),
  };

  const optionsHistogrammeVertical: ChartOptions<"bar"> = {
    animation: false,
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
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        stacked: true,
        grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
        type: 'category',
        position: 'bottom',
        ticks: {
          color: '#000',
          callback: function (_value, index: number) {
            return libelles[index].split('-')[1];
          },
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
        grid: { drawBorder: false, drawOnChartArea: false, drawTicks: false },
        ticks: {
          color: '#000',
          callback: function (_value, index: number) {
            const [annee, trimestre] = libelles[index].split('-');
            if (trimestre === 'T1') {
              return annee;
            }
            return '';
          },
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
      xLine: {
        display: false,
        max: 1,
        min: 0,
        type: "linear",
      },
      y: {
        display: false,
        max: borneMaximale,
        min: borneMinimale,
      },
    }
  }

  return (
    <>
      <Bar
        // @ts-ignore
        data={data}
        options={optionsHistogrammeVertical}
      />
      <Transcription
        entêteLibellé={wording.ANNÉE}
        identifiants={[wording.TAUX_ROTATION]}
        libellés={libelles}
        valeurs={[StringFormater.addPercentToValues(valeurs)]}
      />
    </>
  );
}


export default GraphiqueTauxRotationTrimestriel;

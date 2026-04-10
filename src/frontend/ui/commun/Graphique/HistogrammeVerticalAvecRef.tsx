import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

import { CouleurHistogramme, couleurDesTraitsRefHistogramme } from "./couleursGraphique";
import { ColorLabel } from "../ColorLabel/ColorLabel";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { Transcription } from "../Transcription/Transcription";

type HistogrammeVerticalAvecRefProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  valeurs: (number | null)[];
  valeursRef: (number | null)[];
  couleursDeLHistogramme: CouleurHistogramme[];
  libelles: (number | string)[];
  identifiants: string[];
  libellesDeValeursManquantes?: (number | string)[];
  libellesDeValeursManquantesTitre?: string;
  libellesDeValeursDeReferenceManquantes?: (number | string)[];
  libellesDeValeursDeReferenceManquantesTitre?: string;
  showRefValues: boolean;
}>;

const HistogrammeVerticalAvecRef = ({
  etabFiness,
  etabTitle,
  nomGraph,
  valeurs,
  valeursRef,
  couleursDeLHistogramme,
  libelles,
  identifiants,
  libellesDeValeursManquantes = [],
  libellesDeValeursDeReferenceManquantes = [],
  showRefValues,
}: HistogrammeVerticalAvecRefProps) => {
  const { wording } = useDependencies();

  const transcriptionValeurs = valeurs.map((value) => (Number.isFinite(value as number) ? `${(value as number).toLocaleString("fr")} %` : null));
  const transcriptionValeursRef = valeursRef.map((value) => (Number.isFinite(value as number) ? `${(value as number).toLocaleString("fr")} %` : null));


  const anneeEnCours = String(new Date().getFullYear());

  // Découpage des labels en principal/secondaire (similaire à HistogrammeComparaisonVerticalAvecRef)
  const expressionReguliereTrimestre = /^([0-9]{4})-T([1-4])$/;
  const decomposerLibelle = (label: number | string): { principal: string; secondaire: string } => {
    if (typeof label === "number") {
      const libelleTexte = String(label);
      return { principal: libelleTexte, secondaire: "" };
    }
    const libelleNettoye = label.trim();
    const correspondanceTrimestre = expressionReguliereTrimestre.exec(libelleNettoye);
    if (correspondanceTrimestre) {
      return { principal: `T${correspondanceTrimestre[2]}`, secondaire: correspondanceTrimestre[1] };
    }
    const segments = libelleNettoye.split(/\s+/);
    if (segments.length > 1) {
      return { principal: segments.slice(0, -1).join(" "), secondaire: segments.at(-1) ?? "" };
    }
    return { principal: libelleNettoye, secondaire: "" };
  };

  const libellesDecomposes = libelles.map(decomposerLibelle);
  const libellesPrincipaux = libellesDecomposes.map(({ principal }) => principal);
  const libellesSecondaires = libellesDecomposes.map(({ secondaire }, index) => {
    if (!secondaire) {
      return "";
    }
    const libelleSecondairePrecedent = index > 0 ? libellesDecomposes.at(index - 1)?.secondaire ?? "" : "";
    return libelleSecondairePrecedent === secondaire ? "" : secondaire;
  });
  const presenceLibellesSecondaires = libellesSecondaires.some((libelle) => libelle !== "");
  const indiceDernierLibelleSecondaire = libellesSecondaires.reduce((dernierIndice, libelle, index) => (libelle ? index : dernierIndice), -1);

  const data: ChartData = {
    datasets: [
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
        data: valeurs,
        datalabels: { labels: { title: { color: valeurs.map(() => "#000") } } },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
      {
        backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.secondPlan),
        data: showRefValues ? valeursRef : [],
        datalabels: { display: false },
        maxBarThickness: 60,
        type: "bar",
        xAxisID: "x",
      },
    ],
    labels: libelles,
  };

  const optionsHistogrammeVertical: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    layout: {
      padding: {
        top: 20,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      datalabels: {
        align: "end",
        anchor: "end",
        clip: false,
        offset: -4,
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
        formatter: (value: number, _context: Context): string => value ? value.toLocaleString("fr") + " %" : "",
      },
      legend: { display: false },
      tooltip: {
        filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
        callbacks: {
          title: function (context: any) {
            // Utilise le label principal et secondaire pour la tooltip
            const index = context[0]?.dataIndex ?? 0;
            const principal = libellesPrincipaux[index] ?? "";
            const secondaire = libellesSecondaires[index] ?? "";
            return secondaire ? `${principal} ${secondaire}` : principal;
          },
          label: function (context: any) {
            const index = context.dataIndex;
            const value = valeurs[index];
            const valeurText = Number.isFinite(value as number) ? Math.abs(value as number).toLocaleString("fr") : wording.NON_RENSEIGNÉ;
            if (!showRefValues) {
              return `Taux: ${valeurText}`;
            }
            const refValue = valeursRef[index];
            const valeurRefText = Number.isFinite(refValue as number) ? Math.abs(refValue as number).toLocaleString("fr") : wording.NON_RENSEIGNÉ;
            return [`Taux: ${valeurText}`, `Valeur de référence: ${valeurRefText}`];
          },
        },
      },
      // @ts-expect-error Param non standard utilisé
      rotationRef: { valeursRef } as any,
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        stacked: true,
        ticks: {
          color: "#000",
          callback: (_tickValue: any, index: number) => libellesPrincipaux[index] ?? "",
          font: (context: any) => {
            if (context.index === libelles.length - 1 && String(libelles[context.index]).includes(anneeEnCours)) {
              return { weight: "bold" };
            }
            return {};
          },
        },
      },
      xAxis2: {
        type: "category",
        position: "bottom",
        border: {
          display: false,
        },
        display: presenceLibellesSecondaires,
        grid: { drawOnChartArea: false, drawTicks: false },
        ticks: {
          color: "#000",
          callback: (_tickValue: any, index: number) => libellesSecondaires[index] ?? "",
          font: (context: any) => {
            const tickLabel = typeof context.tick?.label === "string" ? context.tick.label : "";
            if (context.index === indiceDernierLibelleSecondaire && tickLabel === anneeEnCours) {
              return { weight: "bold" };
            }
            return {};
          },
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        display: false,
        min: 0,
        suggestedMax: Math.max(50, ...valeurs.filter((v) => v !== null).filter((v) => Number.isFinite(v))),
      },
    },
  };

  const rotationRefPlugin = {
    id: "rotationRef",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      const { valeursRef } = options;
      const values = valeursRef;
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
  }

  return (
    <>
      <Bar
        data={data as ChartData<"bar">}
        options={optionsHistogrammeVertical}
        plugins={showRefValues ? [rotationRefPlugin] : []}
      />
      {showRefValues && <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDesTraitsRefHistogramme, label: wording.MOYENNE_REF, circle: false }

        ]}
      />}
      {libellesDeValeursManquantes.length > 0 && (
        <MiseEnExergue>
          {`${wording.AUCUNE_DONNEE_RENSEIGNEE_GENERIQUE} ${libellesDeValeursManquantes.join(", ")}`}
        </MiseEnExergue>
      )}
      {showRefValues && libellesDeValeursDeReferenceManquantes.length > 0 && (
        <MiseEnExergue>
          {`${wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE} ${libellesDeValeursDeReferenceManquantes.join(", ")}`}
        </MiseEnExergue>
      )}
      <Transcription
        entêteLibellé={wording.PERIODE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiants={identifiants}
        libellés={libelles}
        nomGraph={nomGraph}
        valeurs={showRefValues ? [transcriptionValeurs, transcriptionValeursRef] : [transcriptionValeurs]}
      />
    </>
  );
}

export default HistogrammeVerticalAvecRef;

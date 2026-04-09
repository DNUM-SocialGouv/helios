import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import { trimestresManquantsVigieRh } from "../../../../../utils/dateUtils";
import { ColorLabel } from "../../../../commun/ColorLabel/ColorLabel";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import {
  couleurDuFondHistogrammeOrangeClair,
  couleurDuFondHistogrammeJaune,
  couleurDesTraitsRefHistogramme,
  couleurExtensionHistogrammeJaune,
  couleurExtensionHistogrammeOrangeClair
} from "../../../../commun/Graphique/couleursGraphique";
import { MiseEnExergue } from "../../../../commun/MiseEnExergue/MiseEnExergue";
import { Transcription } from "../../../../commun/Transcription/Transcription";
import { DepartEmbaucheTrimestrielViewModel } from "../BlocVigieRHViewModel";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type GraphiqueDepartEmbauchesAnnuelProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  donneesDepartsEmbauches: DepartEmbaucheTrimestrielViewModel[];
  showRefValues: boolean;
}>;

const GraphiqueDepartEmbauchesTrimestriel = ({ etabFiness, etabTitle, donneesDepartsEmbauches, showRefValues }: GraphiqueDepartEmbauchesAnnuelProps) => {

  const { wording } = useDependencies();

  const libelles = donneesDepartsEmbauches.map((d) => d.trimestre);
  const donneesDeparts = donneesDepartsEmbauches.map((donnee) => {
    const valeur = donnee.depart;
    if (Number.isFinite(valeur)) {
      if (valeur === 0) return -0.000001;
      return -Math.abs(valeur);
    }
    return null;
  });
  const donneesEmbauches = donneesDepartsEmbauches.map((donnee) => {
    const valeur = donnee.embauche;
    if (Number.isFinite(valeur)) {
      return valeur;
    }
    return null;
  });
  const donneesDepartsRef = donneesDepartsEmbauches.map((donnee) => {
    const valeur = donnee.departRef;
    if (Number.isFinite(valeur)) {
      return -Math.abs(valeur);
    }
    return null;
  });
  const donneesEmbauchesRef = donneesDepartsEmbauches.map((donnee) => {
    const valeur = donnee.embaucheRef;
    if (Number.isFinite(valeur)) {
      return valeur;
    }
    return null;
  });

  const expressionReguliereTrimestre = /^(\d{4})-T([1-4])$/;

  const libellesValeursManquantes = trimestresManquantsVigieRh(libelles, 3)

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
  const anneeEnCours = String(new Date().getFullYear());
  const highlightLastLabel = libelles.length > 0 && String(libelles[libelles.length - 1]).includes(anneeEnCours);

  const donneesDepartsExtension = donneesDepartsRef.map((valeurRef, idx) => {
    const valeur = donneesDeparts[idx];
    if (Number.isFinite(valeur) && Number.isFinite(valeurRef)) {
      return -Math.max(0, (valeur as number) - (valeurRef as number));
    }
    return 0;
  });
  const donneesEmbauchesExtension = donneesEmbauchesRef.map((valeurRef, idx) => {
    const valeur = donneesEmbauches[idx];
    if (Number.isFinite(valeur) && Number.isFinite(valeurRef)) {
      return Math.max(0, (valeurRef as number) - (valeur as number));
    }
    return 0;
  });

  const valeursNegativesRefPlugin = {
    id: "valeursNegativesRef",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      const { donneesDepartsRef } = options;
      const values = donneesDepartsRef;
      const datasetMeta = chart.getDatasetMeta(0).data as unknown as (BarElement & { width: number })[];
      for (const [index, bar] of datasetMeta.entries()) {
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
      }
    },
  };

  const valeursPositivesRefPlugin = {
    id: "valeursPositivesRef",
    afterDraw(chart: ChartJS, _args: any, options: any) {
      const { ctx, scales } = chart;
      const { donneesEmbauchesRef } = options;
      const values = donneesEmbauchesRef;
      const datasetMeta = chart.getDatasetMeta(0).data as unknown as (BarElement & { width: number })[];
      for (const [index, bar] of datasetMeta.entries()) {
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
      }
    },
  };

  const dataSet = {
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
      {
        label: "embauches-extension",
        data: showRefValues ? donneesEmbauchesExtension : [],
        backgroundColor: couleurExtensionHistogrammeJaune,
        stack: "combined",
      },
      {
        label: "depart-extension",
        data: showRefValues ? donneesDepartsExtension : [],
        backgroundColor: couleurExtensionHistogrammeOrangeClair,
        stack: "combined",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    layout: {
      padding: {
      top: 20,
        },
    },
    plugins: {
      datalabels: {
        align: (context: any) => {
          return context.dataset.label === wording.DEPARTS ? "start" : "end";
        },
        anchor: (context: any) => {
          return context.dataset.label === wording.DEPARTS ? "start" : "end";
        },
        clip: false,
        clamp: true,
        offset: (context: any) => {
          return context.dataset.label === wording.DEPARTS ? -1 : -4;
        },
        color: "#000",
        font: {
          family: "Marianne",
          size: 12,
          weight: 700,
        },
        display: (context: any) => {
          // Afficher les labels uniquement pour les datasets principaux
          return context.dataset.label === wording.DEPARTS || context.dataset.label === wording.EMBAUCHES;
        },
        formatter: (value: number) => {
          return Math.round(Math.abs(value))
        },
      },
      tooltip: {
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
            const datasetLabel = context.dataset.label;
            const embaucheChart = datasetLabel.toLowerCase() === wording.EMBAUCHES.toLowerCase();

            const value = embaucheChart ? donneesEmbauches[index] : donneesDeparts[index];
            const valeurText = Number.isFinite(value) ? Math.round(Math.abs(value as number)).toString() : wording.NON_RENSEIGNÉ;
            const label = embaucheChart ? wording.EMBAUCHES : wording.DEPARTS;

            if (!showRefValues) {
              return `${label}: ${valeurText}`;
            }
            const refValue = embaucheChart ? donneesEmbauchesRef[index] : donneesDepartsRef[index];
            const valeurRefText = Number.isFinite(refValue) ? Math.round(Math.abs(refValue as number)).toString() : wording.NON_RENSEIGNÉ;

            return [`${label}: ${valeurText}`,
            `Valeur de référence: ${valeurRefText}`];
          },
        },
      },
      legend: { display: false },
      valeursPositivesRef: { donneesEmbauchesRef },
      valeursNegativesRef: { donneesDepartsRef },
    },
    scales: {
      x: {
        border: {
          display: false
        },
        stacked: true,
        grid: { drawOnChartArea: false, drawTicks: false },
        type: 'category',
        position: 'bottom',
        ticks: {
          color: "#000",
          callback: (_value: any, index: number) => libellesPrincipaux[index] ?? "",
          font: (context: any) => {
            if (highlightLastLabel && context.index === libelles.length - 1 && String(libelles[context.index]).includes(anneeEnCours)) {
              return { weight: "bold" };
            }
            return {};
          }, 
        },
      },
      xAxis2: {
        display: presenceLibellesSecondaires,
        border: {
          display: false
        },
        type: 'category',
        position: 'bottom',
        grid: { drawOnChartArea: false, drawTicks: false },
        ticks: {
          color: "#000",
          callback: (_tickValue: any, index: number) => libellesSecondaires[index] ?? "",
          font: (context: any) => {
            const tickLabel = typeof context.tick?.label === "string" ? context.tick.label : "";
            if (context.index === indiceDernierLibelleSecondaire && tickLabel === anneeEnCours) {
              return { weight: "bold" };
            }
            return {};},
          maxRotation: 0,
          autoSkip: false
        }
      },
      y: {
        grace: '10%',
        stacked: true,
        beginAtZero: true,
        grid: {
          drawTicks: false,
          color: (context: any) =>
            context.tick.value === 0 ? "black" : "transparent",
          lineWidth: (context: any) =>
            context.tick.value === 0 ? 2 : 0,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const transcriptionIdentifiants = showRefValues
    ? [wording.DEPARTS, wording.DEPARTS_REF, wording.EMBAUCHES, wording.EMBAUCHES_REF]
    : [wording.DEPARTS, wording.EMBAUCHES];

  const transcriptionValeurs = showRefValues
    ? [donneesDeparts.map(v => Math.abs(v as number)), donneesDepartsRef.map(v => Math.abs(v as number)), donneesEmbauches, donneesEmbauchesRef]
    : [donneesDeparts.map(v => Math.abs(v as number)), donneesEmbauches];

  return (
    <div>
      <Bar data={dataSet} options={options as ChartOptions<"bar">} plugins={showRefValues ? [valeursNegativesRefPlugin, valeursPositivesRefPlugin] : []} />
      {libellesValeursManquantes.length > 0 && (
        <MiseEnExergue>
          {`${wording.AUCUNE_DONNEE_RENSEIGNEE_GENERIQUE} ${libellesValeursManquantes.join(", ")}`}
        </MiseEnExergue>
      )}
      <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDuFondHistogrammeJaune, label: wording.EMBAUCHES, circle: true },
          { color: couleurDuFondHistogrammeOrangeClair, label: wording.DEPARTS, circle: true },
        ]}
      />
      {showRefValues && <ColorLabel
        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
        items={[
          { color: couleurDesTraitsRefHistogramme, label: wording.MOYENNE_REF, circle: false }
        ]}
      />}
      <Transcription
        disabled={false}
        entêteLibellé={wording.PERIODE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiants={transcriptionIdentifiants}
        libellés={libelles}
        nomGraph={wording.DEPARTS_EMBAUCHES}
        valeurs={transcriptionValeurs}
      />
    </div>
  );
};

export default GraphiqueDepartEmbauchesTrimestriel;

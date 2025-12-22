import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend } from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";


import { DepartEmbauche } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type GraphiqueDepartEmbauchesAnnuelProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  donneesDepartsEmbauches: DepartEmbauche[];
  showRefValues: boolean;
}>;

const GraphiqueDepartEmbauchesAnnuel = ({ etabFiness, etabTitle, donneesDepartsEmbauches, showRefValues }: GraphiqueDepartEmbauchesAnnuelProps) => {

  const { wording } = useDependencies();

  const {
    libelles,
    donneesDeparts,
    donneesEmbauches,
    donneesDepartsRef,
    donneesEmbauchesRef,
    donneesDepartsExtension,
    donneesEmbauchesExtension,
    libellesValeursManquantes,
    libellesValeursReferenceManquantes
  } = useMemo(() => {
    const libelles = donneesDepartsEmbauches.map((donnee) => donnee.annee.toString());

    const donneesDeparts = donneesDepartsEmbauches.map((donnee) => {
      const valeur = donnee.depart;
      if (Number.isFinite(valeur)) {
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

    const libellesValeursManquantes: string[] = [];
    const libellesValeursReferenceManquantes: string[] = [];

    const ajouterLibellesManquants = (
      valeurs: (number | null)[],
      construireLibelle: (index: number) => string,
      accumulateur: string[]
    ) => {
      for (const [index, valeur] of valeurs.entries()) {
        if (!Number.isFinite(valeur)) {
          const libelle = construireLibelle(index);
          if (!accumulateur.includes(libelle)) {
            accumulateur.push(libelle);
          }
        }
      }
    };

    ajouterLibellesManquants(
      donneesDeparts,
      (index) => `${wording.DEPARTS}-${libelles[index]}`,
      libellesValeursManquantes
    );
    ajouterLibellesManquants(
      donneesEmbauches,
      (index) => `${wording.EMBAUCHES}-${libelles[index]}`,
      libellesValeursManquantes
    );
    ajouterLibellesManquants(
      donneesDepartsRef,
      (index) => `${wording.DEPARTS}-${libelles[index]}`,
      libellesValeursReferenceManquantes
    );
    ajouterLibellesManquants(
      donneesEmbauchesRef,
      (index) => `${wording.EMBAUCHES}-${libelles[index]}`,
      libellesValeursReferenceManquantes
    );

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

    return {
      libelles,
      donneesDeparts,
      donneesEmbauches,
      donneesDepartsRef,
      donneesEmbauchesRef,
      donneesDepartsExtension,
      donneesEmbauchesExtension,
      libellesValeursManquantes,
      libellesValeursReferenceManquantes
    };
  }, [donneesDepartsEmbauches]);

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
        maxBarThickness: 60,
      },
      {
        label: wording.DEPARTS,
        data: donneesDeparts,
        backgroundColor: couleurDuFondHistogrammeOrangeClair,
        stack: "combined",
        maxBarThickness: 60,
      },
      {
        label: "embauches-extension",
        data: showRefValues ? donneesEmbauchesExtension : [],
        backgroundColor: couleurExtensionHistogrammeJaune,
        stack: "combined",
        maxBarThickness: 60,
      },
      {
        label: "depart-extension",
        data: showRefValues ? donneesDepartsExtension : [],
        backgroundColor: couleurExtensionHistogrammeOrangeClair,
        stack: "combined",
        maxBarThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    plugins: {
      datalabels: {
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
          return Math.abs(value)
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const datasetLabel = context.dataset.label;
            const embaucheChart = datasetLabel.toLowerCase().includes("embauches");

            const value = embaucheChart ? donneesEmbauches[index] : donneesDeparts[index];
            const valeurText = Number.isFinite(value) ? Math.abs(value as number).toString() : wording.NON_RENSEIGNÉ;

            if (!showRefValues) {
              return `Valeur: ${valeurText}`;
            }

            const refValue = embaucheChart ? donneesEmbauchesRef[index] : donneesDepartsRef[index];
            const valeurRefText = Number.isFinite(refValue) ? Math.abs(refValue as number).toString() : wording.NON_RENSEIGNÉ;

            return [`Valeur: ${valeurText}`,
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
        ticks: {
          color: '#000',
          font: function (context: any) {
            if (context.tick.label === new Date().getFullYear()) {
              return { weight: 'bold' };
            }
            return {};
          }
        }
      },
      y: {
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
    ? [wording.NOMBRE_SORTIES, wording.DEPARTS_REF, wording.NOMBRE_ENTREES, wording.EMBAUCHES_REF]
    : [wording.NOMBRE_SORTIES, wording.NOMBRE_ENTREES];

  const transcriptionValeurs = showRefValues
    ? [donneesDeparts.map(v => Math.abs(v as number)), donneesDepartsRef.map(v => Math.abs(v as number)), donneesEmbauches, donneesEmbauchesRef]
    : [donneesDeparts.map(v => Math.abs(v as number)), donneesEmbauches];

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-2xl shadow">
      <Bar
        data={dataSet}
        /* @ts-ignore */
        options={options}
        plugins={showRefValues ? [valeursNegativesRefPlugin, valeursPositivesRefPlugin] : []} />
      {libellesValeursManquantes.length > 0 && (
        <MiseEnExergue>
          {`${wording.AUCUNE_DONNEE_RENSEIGNEE_GENERIQUE} ${libellesValeursManquantes.join(", ")}`}
        </MiseEnExergue>
      )}
      {showRefValues && libellesValeursReferenceManquantes.length > 0 && (
        <MiseEnExergue>
          {`${wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE} ${libellesValeursReferenceManquantes.join(", ")}`}
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
        isVigieRH={true}
        libellés={libelles}
        nomGraph={wording.DEPARTS_EMBAUCHES}
        valeurs={transcriptionValeurs}
      />
    </div>
  );
};

export default GraphiqueDepartEmbauchesAnnuel;

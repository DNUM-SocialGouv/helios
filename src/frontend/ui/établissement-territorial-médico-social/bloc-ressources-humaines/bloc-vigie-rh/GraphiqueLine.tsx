import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

import styles from "./GraphiqueLine.module.css";
import { ProfessionFiliereData, ProfessionGroupeData } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { MOIS } from "../../../../utils/constantes";
import { ColorLabel } from "../../../commun/ColorLabel/ColorLabel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { Transcription } from "../../../commun/Transcription/Transcription";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend);

interface MonthYear {
  mois: number;
  annee: number;
}

export interface EffectifsData {
  dataFiliere: number[]; // courbe par filière
  dataEtab: number[]; // courbe “Effectifs totaux”
  dataMoisAnnee: MonthYear[]; // axe X (mois/année)
}

export interface CategorieData {
  categorie: string;
  data: EffectifsData;
}

type MultiCategorie = ProfessionFiliereData | ProfessionGroupeData;

interface LineChartProps {
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  classContainer: string;
  couleurEffectifsTotaux: string;
  dataEffectifs: EffectifsData;
  multiCategories: MultiCategorie[];
  couleursFilieres: string[];
  identifiantLegende: string;
  afficherSerieTotale?: boolean;
  identifiantTranscription?: string;
}

const LineChart = ({
  etabFiness,
  etabTitle,
  classContainer,
  couleurEffectifsTotaux,
  dataEffectifs,
  multiCategories,
  couleursFilieres,
  identifiantLegende,
  afficherSerieTotale = true,
  identifiantTranscription,
  nomGraph,
}: LineChartProps) => {
  const { wording } = useDependencies();

  // Couleurs/grille
  const GRID_COLOR = "#c8c8c880";
  const DEFAULT_PALETTE = ["#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#F59E0B", "#06B6D4"];

  // Axe X : on laisse des labels vides (l’année s’affiche via le callback quand mois === 1)
  const labels = useMemo(() => new Array(dataEffectifs.dataMoisAnnee?.length ?? 0).fill(""), [dataEffectifs.dataMoisAnnee?.length]);

  const labelsTranscription = useMemo(
    () => (dataEffectifs.dataMoisAnnee ?? []).map(({ mois, annee }) => `${MOIS[mois - 1]} ${annee}`),
    [dataEffectifs.dataMoisAnnee],
  );

  // Petite utilité pour l’affichage des libellés des filières
  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  const getSerie = (c: MultiCategorie): number[] => {
    const dc: any = (c as any)?.dataCategorie;
    if (!dc) return [];
    if (Array.isArray(dc)) return dc.map((r: any) => Number(r?.effectifFiliere ?? r?.effectif ?? 0));
    return Array.isArray(dc.dataFiliere) ? dc.dataFiliere : [];
  };

  const transcriptionId = useMemo(() => {
    if (identifiantTranscription && identifiantTranscription.trim().length > 0) return identifiantTranscription;
    return `${identifiantLegende}`.replaceAll(/\s/g, "") + "-transcription";
  }, [identifiantTranscription, identifiantLegende]);

  // Données du graphique : 1 dataset “totaux” + les datasets des filières visibles
  const data = useMemo(() => {
    const datasets: any[] = [];

    const getPointRadius = (context: any) => {
      const index = context.dataIndex;
      const mois = dataEffectifs?.dataMoisAnnee?.[index]?.mois;
      if (mois && [1, 4, 7, 10].includes(mois)) {
        return 4;
      }
      return 1;
    };

    if (afficherSerieTotale) {
      datasets.push({
        label: wording.EFFECTIFS_TOTAUX,
        data: dataEffectifs?.dataEtab ?? [],
        borderColor: couleurEffectifsTotaux,
        backgroundColor: couleurEffectifsTotaux,
        borderWidth: 2,
        fill: false,
        pointRadius: getPointRadius,
      });
    }

    for (const [id, c] of (multiCategories ?? []).entries()) {
      const color = couleursFilieres?.[id] ?? DEFAULT_PALETTE[id % DEFAULT_PALETTE.length];
      datasets.push({
        label: capitalize(c.categorie),
        data: getSerie(c),
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        fill: false,
        pointRadius: getPointRadius,
      });
    }

    return { labels, datasets };
  }, [multiCategories, labels, dataEffectifs, couleurEffectifsTotaux, couleursFilieres, afficherSerieTotale, wording.EFFECTIFS_TOTAUX]);

  // Options du graphique
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Désactive le saut automatique des labels
          maxRotation: 0,  // Empêche l'inclinaison des labels
          minRotation: 0,  // Force l'affichage horizontal des labels
          color: "#000",

          callback: (_value: any, index: number): string | number => {
            const entry = dataEffectifs?.dataMoisAnnee?.[index];
            const mois = entry?.mois ?? null;
            const annee = entry?.annee ?? null;
            return mois === 1 ? annee : "";
          },
        },
        border: {
          display: false
        },
        grid: {
          drawOnChartArea: true,
          drawTicks: true,
          color: (context: any) => (context.tick && context.tick.label !== "" ? GRID_COLOR : "transparent"),
        },
      },
      y: {
        border: {
          display: false
        },
        beginAtZero: false,
        grid: {
          drawOnChartArea: true,
          drawTicks: true,
          color: GRID_COLOR,
        },
      },
    },
    plugins: {
      // @ts-ignore
      htmlLegend: { containerID: identifiantLegende },
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const moisAnnee = dataEffectifs.dataMoisAnnee[index];
            const moisNom = moisAnnee ? MOIS[moisAnnee.mois - 1] : "N/A";
            const xValue = moisAnnee ? `${moisNom} ${moisAnnee.annee}` : "N/A";
            const yValue = tooltipItem.raw;
            return ` ${xValue} : ${yValue}`;
          },
        },
      },
      // Si le plugin datalabels est chargé, on le coupe
      datalabels: { display: false } as any,
    },
  };

  return (
    <div className={classContainer}>
      <div className={styles["chartLineDiv"]}>
        <div className={`${styles["chartLineDiv"]} ${styles["chartLineBody"]}`}>
          {process.env.NODE_ENV !== "test" && <Line data={data} options={options} />}
        </div>
        <ColorLabel
          classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
          items={[
            ...(afficherSerieTotale ? [{ color: couleurEffectifsTotaux, label: wording.EFFECTIF_TOTAL, circle: true }] : []),
            ...(multiCategories ?? []).map((c, index) => ({ color: couleursFilieres[index], label: capitalize(c.categorie), circle: true })),
          ]}
        />
        <Transcription
          disabled={false}
          entêteLibellé={wording.PERIODE}
          etabFiness={etabFiness}
          etabTitle={etabTitle}
          identifiantUnique={transcriptionId}
          identifiants={[
            ...(afficherSerieTotale ? [wording.EFFECTIFS_TOTAUX] : []),
            ...(multiCategories ?? []).map((c) => (nomGraph === wording.EFFECTIFS ? 'Effectif de la filière ' : 'Effectif de la catégorie ') + capitalize(c.categorie)),
          ]}
          isVigieRH={true}
          libellés={labelsTranscription}
          nomGraph={nomGraph}
          valeurs={[
            ...(afficherSerieTotale ? [dataEffectifs.dataEtab] : []),
            ...(multiCategories ?? []).map(getSerie),
          ]}
        />
      </div>
    </div>
  );
};

export default LineChart;

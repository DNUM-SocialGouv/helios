import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

import styles from "./GraphiqueLine.module.css";
import { ProfessionFiliereData } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { MOIS } from "../../../../utils/constantes";
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

interface LineChartProps {
  classContainer: string;
  couleurEffectifsTotaux: string;
  dataEffectifs: EffectifsData;
  multiCategories: ProfessionFiliereData[];
  couleursFilieres?: string[];
}

const LineChart = ({ classContainer, couleurEffectifsTotaux, dataEffectifs, multiCategories, couleursFilieres }: LineChartProps) => {
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

  const getSerie = (c: ProfessionFiliereData): number[] => {
    const dc: any = (c as any)?.dataCategorie;
    if (!dc) return [];
    if (Array.isArray(dc)) return dc.map((r: any) => Number(r?.effectifFiliere ?? r?.effectif ?? 0));
    return Array.isArray(dc.dataFiliere) ? dc.dataFiliere : [];
  };

  // Données du graphique : 1 dataset “totaux” + les datasets des filières visibles
  const data = useMemo(() => {
    const datasets: any[] = [
      {
        label: wording.EFFECTIFS_TOTAUX,
        data: dataEffectifs.dataEtab,
        borderColor: couleurEffectifsTotaux,
        backgroundColor: couleurEffectifsTotaux,
        borderWidth: 2,
        fill: false,
        pointRadius: 1,
      },
    ];

    (multiCategories ?? []).forEach((c, id) => {
      const color = couleursFilieres?.[id] ?? DEFAULT_PALETTE[id % DEFAULT_PALETTE.length];
      datasets.push({
        label: capitalize(c.categorie),
        data: getSerie(c),
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        fill: false,
        pointRadius: 1,
      });
    });

    return { labels, datasets };
  }, [multiCategories, labels, dataEffectifs, couleurEffectifsTotaux, couleursFilieres, wording.EFFECTIFS_TOTAUX]);

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
        beginAtZero: true,
        grid: {
          drawOnChartArea: true,
          drawTicks: true,
          color: GRID_COLOR,
        },
      },
    },
    plugins: {
      // @ts-ignore
      htmlLegend: { containerID: 'légende-graphique-effectifs' },
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
        <menu className={"fr-checkbox-group " + styles['graphique-effectif-legende']} id='légende-graphique-effectifs' />

        <Transcription
          disabled={false}
          entêteLibellé={wording.MOIS_ANNEES}
          identifiants={[wording.EFFECTIFS_TOTAUX, ...(multiCategories ?? []).map((c) => capitalize(c.categorie))]}
          libellés={labelsTranscription}
          valeurs={[dataEffectifs.dataEtab, ...(multiCategories ?? []).map(getSerie)]}
        />
      </div>
    </div>
  );
};

export default LineChart;

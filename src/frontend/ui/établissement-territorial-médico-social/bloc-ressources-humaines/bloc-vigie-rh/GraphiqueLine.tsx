import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend, ChartOptions } from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import styles from "./GraphiqueLine.module.css";
import { ProfessionFiliereData } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
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

  // Visibilité par filière (toutes visibles au chargement)
  const [visibleCats, setVisibleCats] = useState<Record<string, boolean>>(() => Object.fromEntries((multiCategories ?? []).map((c) => [c.categorie, true])));

  // Libellés mois (pour tooltip + transcription)
  const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  // Axe X : on laisse des labels vides (l’année s’affiche via le callback quand mois === 1)
  const labels = useMemo(() => new Array(dataEffectifs.dataMoisAnnee?.length ?? 0).fill(""), [dataEffectifs.dataMoisAnnee?.length]);

  const labelsTranscription = useMemo(
    () => (dataEffectifs.dataMoisAnnee ?? []).map(({ mois, annee }) => `${MOIS[mois - 1]} ${annee}`),
    [dataEffectifs.dataMoisAnnee],
  );

  // Petite utilité pour l’affichage des libellés des filières
  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

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
      if (!visibleCats[c.categorie]) return;
      const color = couleursFilieres?.[id] ?? DEFAULT_PALETTE[id % DEFAULT_PALETTE.length];
      datasets.push({
        label: capitalize(c.categorie),
        data: c.dataCategorie.dataFiliere,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        fill: false,
        pointRadius: 1,
      });
    });

    return { labels, datasets };
  }, [multiCategories, visibleCats, labels, dataEffectifs, couleurEffectifsTotaux, couleursFilieres, wording.EFFECTIFS_TOTAUX]);

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
        grid: {
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: (context: any) => (context.tick && context.tick.label !== "" ? GRID_COLOR : "transparent"),
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: GRID_COLOR,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // on conserve les checkboxes "custom"
        onClick: (_e, item, legend) => {
          const label = item.text;
          if (label === wording.EFFECTIFS_TOTAUX) return; // ne jamais masquer le total
          const key = (multiCategories ?? []).find((c) => capitalize(c.categorie) === label)?.categorie;
          if (!key) return;
          setVisibleCats((prev) => ({ ...prev, [key]: !prev[key] }));
          legend.chart.update();
        },
      },
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

        {/* Pastille “totaux” + cases à cocher filières */}
        <div className="fr-ml-3w" style={{ display: "flex", flexWrap: "wrap" }}>
          <ColorLabel classContainer="fr-mb-1w fr-mt-2w fr-ml-1w" items={[{ color: couleurEffectifsTotaux, label: wording.EFFECTIFS_TOTAUX }]} />
          <div className="fr-mt-2w fr-ml-1w fr-mb-1w" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {(multiCategories ?? []).map((c, id) => {
              const pretty = capitalize(c.categorie);
              const color = couleursFilieres?.[id] ?? DEFAULT_PALETTE[id % DEFAULT_PALETTE.length];
              return (
                <div className="fr-checkbox-group" key={c.categorie} style={{ display: "flex", alignItems: "center" }}>
                  <input
                    id={id as unknown as string}
                    type="checkbox"
                    checked={!!visibleCats[c.categorie]}
                    onChange={() => setVisibleCats((prev) => ({ ...prev, [c.categorie]: !prev[c.categorie] }))}
                    style={{ marginRight: 6 }}
                  />
                  <label
                    className={styles["filieres_effectifs"]}
                    htmlFor={id as unknown as string}
                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        marginRight: 6,
                        borderRadius: 2,
                        backgroundColor: color,
                      }}
                    />
                    {pretty}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <Transcription
          disabled={false}
          entêteLibellé={wording.MOIS_ANNEES}
          identifiants={[wording.EFFECTIFS_TOTAUX, ...(multiCategories ?? []).map((c) => capitalize(c.categorie))]}
          libellés={labelsTranscription}
          valeurs={[dataEffectifs.dataEtab, ...(multiCategories ?? []).map((c) => c.dataCategorie.dataFiliere)]}
        />
      </div>
    </div>
  );
};

export default LineChart;

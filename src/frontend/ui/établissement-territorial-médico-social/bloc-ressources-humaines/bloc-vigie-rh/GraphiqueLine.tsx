import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend, ChartOptions } from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import styles from "./GraphiqueLine.module.css";
import { ColorLabel } from "../../../commun/ColorLabel/ColorLabel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { Transcription } from "../../../commun/Transcription/Transcription";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend);

interface MonthYear {
    mois: number;
    annee: number;
}

export interface EffectifsData {
        dataFiliere: number[];
        dataEtab: number[];
        dataMoisAnnee: MonthYear[];
}
export interface CategorieData {
    categorie: string;
    data: EffectifsData;
}

interface LineChartProps {
  classContainer: string;
  couleurEffectifsTottaux: string;
  dataEffectifs: EffectifsData;
  multiCategories: Array<{ categorie: string; dataCategorie: EffectifsData }>;
  couleursFilieres?: string[];
}

    const LineChart = ({ classContainer, couleurEffectifsTottaux, dataEffectifs, multiCategories, couleursFilieres }: LineChartProps) => {

    const { wording } = useDependencies();

    const gtidColor = "#c8c8c880" // gris

    const DEFAULT_PALETTE = ["#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#F59E0B", "#06B6D4"];
    const [visibleCats, setVisibleCats] = useState<Record<string, boolean>>(
        () => Object.fromEntries((multiCategories ?? []).map(c => [c.categorie, true]))
    );

    const moisNoms = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const labels = useMemo(
        () => new Array(dataEffectifs.dataMoisAnnee?.length ?? 0).fill(""),
        [dataEffectifs.dataMoisAnnee?.length]
    );


    const labelsTranscription = dataEffectifs.dataMoisAnnee?.map((monthYear) => {
        const mois = moisNoms[monthYear.mois - 1];
        const annee = monthYear.annee;
        return `${mois} ${annee}`;
    });

    const data = useMemo(() => {
        const datasets: any[] = [
            {
            label: wording.EFFECTIFS_TOTAUX,
            data: dataEffectifs.dataEtab,
            borderColor: couleurEffectifsTottaux,
            backgroundColor: couleurEffectifsTottaux,
            borderWidth: 3,
            fill: false,
            pointRadius: 0,
            },
        ];
        (multiCategories ?? []).forEach((c, id) => {
            if (!visibleCats[c.categorie]) return;
            const color = couleursFilieres?.[id] ?? DEFAULT_PALETTE[id % DEFAULT_PALETTE.length];
            datasets.push({
            label: c.categorie.charAt(0).toUpperCase() + c.categorie.slice(1),
            data: c.dataCategorie.dataFiliere,
            borderColor: color,
            backgroundColor: color,
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            });
        });
        return { labels, datasets };
    }, [
        multiCategories, visibleCats, labels,
        dataEffectifs, couleurEffectifsTottaux, couleursFilieres, wording.EFFECTIFS_TOTAUX
    ]);

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: {
                ticks: {
                    autoSkip: false,  // Désactive le saut automatique des labels
                    maxRotation: 0,   // Empêche l'inclinaison des labels
                    minRotation: 0,   // Force l'affichage horizontal des labels
                    color: "#000",
                    callback: function (_value: any, index: number): string | number {
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
                    color: function (context: any) {
                        // Afficher la ligne verticale uniquement pour janvier
                        return context.tick && context.tick.label !== "" ? gtidColor : "transparent";
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: gtidColor,
                },
            },
        },
        plugins: {
        legend: {
            display: false,
            onClick: (_e, item, legend) => {
                const label = item.text;
                if (label === wording.EFFECTIFS_TOTAUX) return; // on ne masque jamais le total
                const key = (multiCategories ?? []).find(
                c => c.categorie.charAt(0).toUpperCase() + c.categorie.slice(1) === label
                )?.categorie;
                if (!key) return;
                setVisibleCats(prev => ({ ...prev, [key]: !prev[key] }));
                legend.chart.update();
            }
        },
        tooltip: { 
            enabled: true,
            callbacks: {
            label: function (tooltipItem) {
                const index = tooltipItem.dataIndex; 
                const moisAnnee = dataEffectifs.dataMoisAnnee[index];                        
                const moisNom = moisAnnee ? moisNoms[moisAnnee.mois - 1] : "N/A";
                const xValue = moisAnnee ? `${moisNom} ${moisAnnee.annee}` : "N/A";
                const yValue = tooltipItem.raw;
                return ` ${xValue} : ${yValue}`;
            }
            }
        },
        datalabels: { display: false },
        },
    };
    return (
        <div className={`${classContainer} `}  >
            <div className={`${styles["chartLineDiv"]}`}  style={{  }} >
                <div className={`${styles["chartLineDiv"]} ${styles["chartLineBody"]}`} >
                    {process.env.NODE_ENV !== 'test' && <Line data={data} options={options}/> }
                </div>
                <div className="fr-ml-3w" style={{ display: "flex", flexWrap: "wrap"}}>
                    <ColorLabel
                        classContainer="fr-mb-1w fr-mt-2w fr-ml-1w"
                        items={[
                            { color: couleurEffectifsTottaux, label: wording.EFFECTIFS_TOTAUX }
                        ]}
                    />
                    <div className="fr-mt-2w fr-ml-1w fr-mb-1w" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {(multiCategories ?? []).map((c, id) => ({c, id})).reverse().map(({c, id}) => {
                            const pretty = c.categorie.charAt(0).toUpperCase() + c.categorie.slice(1);
                            const color = couleursFilieres?.[id] ?? DEFAULT_PALETTE[id % DEFAULT_PALETTE.length];
                            return (
                                <div className="fr-checkbox-group" key={c.categorie} style={{ display: "flex", alignItems: "center" }}>
                                <input
                                    id={id}
                                    type="checkbox"
                                    checked={!!visibleCats[c.categorie]}
                                    onChange={() =>
                                        setVisibleCats((prev) => ({ ...prev, [c.categorie]: !prev[c.categorie] }))
                                    }
                                    style={{ marginRight: 6 }}
                                />
                                <label className={`${styles["filieres_effectifs"]}`} htmlFor={id} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
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
                    identifiants={[
                        wording.EFFECTIFS_TOTAUX,
                        ...(multiCategories ?? []).map(c => c.categorie.charAt(0).toUpperCase() + c.categorie.slice(1))
                    ]}
                    libellés={labelsTranscription}
                    valeurs={[
                        dataEffectifs.dataEtab,
                        ...(multiCategories ?? []).map(c => c.dataCategorie.dataFiliere)
                    ]}
                />
            </div>
        </div>
    );
};

export default LineChart;

import { ActiveElement, ArcElement, Chart as ChartJS, ChartData, ChartEvent, ChartOptions, DoughnutController, Legend, Tooltip } from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

import { couleurDeFondDuBloc, couleurDelAbscisse, couleurErreur } from "./couleursGraphique";
import styles from "./Donut.module.css";
import { CouleurHistogramme, LibelléDeDonnéeGraphe } from "./GraphiqueViewModel";
import { construisLePluginDeLaLegende } from "./LegendPlugin";

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend, construisLePluginDeTexteAuCentreDuDonut(), construisLePluginDeLaLegende(), ChartDataLabels);

export function Donut(props: {
  valeurs: number[];
  libellés: string[];
  couleursDuDoughnut: CouleurHistogramme[];
  libellésDesValeurs: LibelléDeDonnéeGraphe[];
  texteCentral: string;
  total: number;
  idDeLaLégende: string;
}): JSX.Element {
  const data: ChartData<"doughnut", number[], string> = {
    datasets: [
      {
        backgroundColor: props.couleursDuDoughnut.map((couleur) => couleur.premierPlan),
        borderColor: couleurDeFondDuBloc,
        borderWidth: 1,
        data: props.valeurs,
        datalabels: { labels: { title: { color: props.libellésDesValeurs.map((libellé) => libellé.couleur) } } },
        hoverBackgroundColor: props.couleursDuDoughnut.map((couleur) => couleur.premierPlan),
        type: "doughnut",
      },
    ],
    labels: props.libellés,
  };

  return (
    <div className={styles["donut-wrapper"]}>
      <div>
        <Doughnut data={data} options={optionsDiagrammeDoughnut(props.texteCentral, props.total, props.idDeLaLégende)} />
      </div>
      <menu className={styles["légende-donut"]} id={props.idDeLaLégende} />
    </div>
  );
}

function optionsDiagrammeDoughnut(texteCentral: string, totalDesValeurs: number, idDeLaLégende: string): ChartOptions<"doughnut"> {
  const AUCUN_ARC_SURVOLÉ = -1;
  let indexDeLArcSurvolé = AUCUN_ARC_SURVOLÉ;

  const unArcEstSurvolé = (élémentsActifs: ActiveElement[]) => élémentsActifs.length && élémentsActifs[0].element instanceof ArcElement;
  const metsEnGrasLaPoliceDuLibelléDeLégende = (élément: Element) => {
    élément.classList.add("fr-text--bold");
  };
  const enlèveLaPoliceGrasseDuLibelléDeLégende = (élément: Element) => {
    élément.classList.remove("fr-text--bold");
  };
  const unAutreArcÉtaitSurvolé = (indexDeLArcSurvolé: number) => indexDeLArcSurvolé !== AUCUN_ARC_SURVOLÉ && indexDeLArcSurvolé !== indexDeLArcSurvolé;
  const plusAucunArcNestSurvolé = (élémentsActifs: ActiveElement[]) => élémentsActifs.length === 0 && indexDeLArcSurvolé !== AUCUN_ARC_SURVOLÉ;

  return {
    animation: false,
    aspectRatio: 1,
    cutout: "40%",
    elements: {
      // @ts-ignore
      center: {
        color: couleurDelAbscisse,
        fontStyle: "Marianne",
        text: texteCentral,
      },
    },
    onHover: (_event: ChartEvent, elements: ActiveElement[], chart: ChartJS) => {
      if (unArcEstSurvolé(elements)) {
        const indexDeLArcSurvoléCourant = elements[0].index;

        const légende = document.getElementById(idDeLaLégende);
        if (!légende) return;

        const couleurs = chart.data.datasets[0].backgroundColor as string[];
        const nouvellesCouleursDesArcs = couleurs.map((couleur, index) =>
          index !== indexDeLArcSurvoléCourant && associeLaCouleurTransparente[couleur] ? associeLaCouleurTransparente[couleur] : couleur
        );

        if (unAutreArcÉtaitSurvolé(indexDeLArcSurvoléCourant)) {
          enlèveLaPoliceGrasseDuLibelléDeLégende(légende.children[indexDeLArcSurvolé]);
        }
        chart.data.datasets[0].backgroundColor = nouvellesCouleursDesArcs;
        chart.update();
        metsEnGrasLaPoliceDuLibelléDeLégende(légende.children[indexDeLArcSurvoléCourant]);

        indexDeLArcSurvolé = indexDeLArcSurvoléCourant;
      }

      if (plusAucunArcNestSurvolé(elements)) {
        const légende = document.getElementById(idDeLaLégende);
        if (!légende) return;

        const couleurs = chart.data.datasets[0].backgroundColor as string[];
        const nouvellesCouleursDesArcs = couleurs.map((couleur) => (associeLaCouleurOpaque[couleur] ? associeLaCouleurOpaque[couleur] : couleur));
        chart.data.datasets[0].backgroundColor = nouvellesCouleursDesArcs;
        chart.update();

        enlèveLaPoliceGrasseDuLibelléDeLégende(légende.children[indexDeLArcSurvolé]);

        indexDeLArcSurvolé = AUCUN_ARC_SURVOLÉ;
      }
    },
    plugins: {
      datalabels: {
        align: "center",
        anchor: "center",
        display: (context: Context) => {
          const dataset = context.dataset;
          const value = dataset.data[context.dataIndex];
          // @ts-ignore
          return value > 0.1 * totalDesValeurs;
        },
        font: {
          family: "Marianne",
          size: 16,
          weight: 700,
        },
        formatter: (value: number): string => value.toLocaleString("fr") + " %",
      },
      // @ts-ignore
      htmlLegend: { containerID: idDeLaLégende },
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
  };
}

export const couleurDesArcsDuDonut = {
  opaque: ["#99B3F9", "#667DCF", "#465F9D", "#2F4077", "#273563", "#161D37"],
  transparent: [
    "rgba(153, 179, 249, 0.5)",
    "rgba(102, 125, 207, 0.5)",
    "rgba(70, 95, 157, 0.5)",
    "rgba(47, 64, 119, 0.5)",
    "rgba(39, 53, 99, 0.5)",
    "rgba(22, 29, 55, 0.5)",
  ],
};

const couleurDuFondHistogrammeDeDépassementTransparent = "rgba(201, 25, 30, 0.5)";

const associeLaCouleurTransparente: Record<string, string> = {
  [couleurDesArcsDuDonut.opaque[0]]: couleurDesArcsDuDonut.transparent[0],
  [couleurDesArcsDuDonut.opaque[1]]: couleurDesArcsDuDonut.transparent[1],
  [couleurDesArcsDuDonut.opaque[2]]: couleurDesArcsDuDonut.transparent[2],
  [couleurDesArcsDuDonut.opaque[3]]: couleurDesArcsDuDonut.transparent[3],
  [couleurDesArcsDuDonut.opaque[4]]: couleurDesArcsDuDonut.transparent[4],
  [couleurDesArcsDuDonut.opaque[5]]: couleurDesArcsDuDonut.transparent[5],
  [couleurErreur]: couleurDuFondHistogrammeDeDépassementTransparent,
};

const associeLaCouleurOpaque: Record<string, string> = {
  [couleurDesArcsDuDonut.transparent[0]]: couleurDesArcsDuDonut.opaque[0],
  [couleurDesArcsDuDonut.transparent[1]]: couleurDesArcsDuDonut.opaque[1],
  [couleurDesArcsDuDonut.transparent[2]]: couleurDesArcsDuDonut.opaque[2],
  [couleurDesArcsDuDonut.transparent[3]]: couleurDesArcsDuDonut.opaque[3],
  [couleurDesArcsDuDonut.transparent[4]]: couleurDesArcsDuDonut.opaque[4],
  [couleurDesArcsDuDonut.transparent[5]]: couleurDesArcsDuDonut.opaque[5],
  [couleurDuFondHistogrammeDeDépassementTransparent]: couleurErreur,
};

function construisLePluginDeTexteAuCentreDuDonut() {
  return {
    beforeDraw: function (chart: ChartJS) {
      // @ts-ignore
      const centerConfig = chart?.config?.options?.elements?.center;
      if (centerConfig) {
        const ctx = chart.ctx;
        const fontStyle = centerConfig.fontStyle;
        const txt = centerConfig.text;
        const color = centerConfig.color;

        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 20px " + fontStyle;
        ctx.fillStyle = color;

        ctx.fillText(txt, centerX, centerY);
      }
    },
    id: "texteAuCentreDuDonut",
  };
}

import {
  ActiveElement,
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartEvent,
  ChartOptions,
  Legend,
  LegendItem,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { ReactElement } from "react";
import { Bar, Doughnut } from "react-chartjs-2";

import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

import { Wording } from "../../../configuration/wording/Wording";
import { annéesManquantes } from "../../../utils/dateUtils";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";
import { StringFormater } from "../StringFormater";
import { Transcription } from "../Transcription/Transcription";
import styles from "./GraphiqueViewModel.module.css";
import { HistogrammeHorizontal } from "./HistogrammeHorizontal";

export type LibelléDeDonnéeGraphe = Readonly<{
  couleur: string;
}>;

export type LibelléDeTickGraphe = Readonly<{
  tailleDePolice: string;
}>;

export type CouleurHistogramme = Readonly<{
  premierPlan: string;
  secondPlan: string;
}>;

export class GraphiqueViewModel {
  protected readonly SEUIL_DE_CONTRASTE_DES_LIBELLÉS_DES_TAUX = 20;
  readonly couleurDuFond = "#E8EDFF";
  readonly couleurDeFondDuBloc = "#F6F6F6";
  readonly couleurDuFondHistogrammePrimaire = "#000091";
  readonly couleurDuFondHistogrammeSecondaire = "#4E68BB";
  readonly couleurDuFondDeLaLigne = "#929292";
  readonly couleurDuFondHistogrammeDeDépassement = "#C9191E";
  readonly couleurDuFondHistogrammeDeDépassementTransparent = "rgba(201, 25, 30, 0.5)";
  readonly couleurSecondPlanHistogrammeDeDépassement = "#FFE9E9";
  readonly couleurDelAbscisse = "#161616";
  readonly couleurIdentifiant = "#000";
  readonly policeGrasse = "bold";
  readonly policeNormale = "normal";
  readonly borneMaximaleDeLHistogrammeVertical = 105;
  private readonly AUCUN_ARC_SURVOLÉ = -1;
  private indexDeLArcSurvolé = this.AUCUN_ARC_SURVOLÉ;
  protected readonly couleurDesArcsDuDonut = {
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
  private readonly associeLaCouleurTransparente: Record<string, string> = {
    [this.couleurDesArcsDuDonut.opaque[0]]: this.couleurDesArcsDuDonut.transparent[0],
    [this.couleurDesArcsDuDonut.opaque[1]]: this.couleurDesArcsDuDonut.transparent[1],
    [this.couleurDesArcsDuDonut.opaque[2]]: this.couleurDesArcsDuDonut.transparent[2],
    [this.couleurDesArcsDuDonut.opaque[3]]: this.couleurDesArcsDuDonut.transparent[3],
    [this.couleurDesArcsDuDonut.opaque[4]]: this.couleurDesArcsDuDonut.transparent[4],
    [this.couleurDesArcsDuDonut.opaque[5]]: this.couleurDesArcsDuDonut.transparent[5],
    [this.couleurDuFondHistogrammeDeDépassement]: this.couleurDuFondHistogrammeDeDépassementTransparent,
  };
  private readonly associeLaCouleurOpaque: Record<string, string> = {
    [this.couleurDesArcsDuDonut.transparent[0]]: this.couleurDesArcsDuDonut.opaque[0],
    [this.couleurDesArcsDuDonut.transparent[1]]: this.couleurDesArcsDuDonut.opaque[1],
    [this.couleurDesArcsDuDonut.transparent[2]]: this.couleurDesArcsDuDonut.opaque[2],
    [this.couleurDesArcsDuDonut.transparent[3]]: this.couleurDesArcsDuDonut.opaque[3],
    [this.couleurDesArcsDuDonut.transparent[4]]: this.couleurDesArcsDuDonut.opaque[4],
    [this.couleurDesArcsDuDonut.transparent[5]]: this.couleurDesArcsDuDonut.opaque[5],
    [this.couleurDuFondHistogrammeDeDépassementTransparent]: this.couleurDuFondHistogrammeDeDépassement,
  };

  constructor(protected readonly wording: Wording) {
    ChartJS.register(
      ArcElement,
      BarElement,
      CategoryScale,
      ChartDataLabels,
      Legend,
      LinearScale,
      LineController,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      this.construisLePluginDeLégende(),
      this.construisLePluginDeTexteAuCentreDuDonut()
    );
  }

  protected afficheUnHistogrammeVertical(
    valeurs: number[],
    libellés: (number | string)[],
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesValeurs: LibelléDeDonnéeGraphe[],
    libellésDesTicks: LibelléDeTickGraphe[],
    entêteLibellé: string,
    identifiant: string,
    annéesTotales: number = 3
  ): ReactElement {
    const data: ChartData = {
      datasets: [
        {
          borderColor: this.couleurDuFondDeLaLigne,
          borderDash: [3, 3],
          borderWidth: 2,
          data: [
            {
              x: -1,
              y: 100,
            },
            {
              x: 2,
              y: 100,
            },
          ],
          datalabels: { display: false },
          type: "line",
          xAxisID: "xLine",
        },
        {
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          data: valeurs,
          datalabels: { labels: { title: { color: libellésDesValeurs.map((libellé) => libellé.couleur) } } },
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
      labels: libellés,
    };
    const listeAnnéesManquantes = annéesManquantes(libellés, annéesTotales);

    return (
      <>
        {listeAnnéesManquantes.length < annéesTotales && (
          <Bar
            // @ts-ignore
            data={data}
            options={this.optionsHistogrammeVertical(libellésDesTicks.map((libelléDuTick) => libelléDuTick.tailleDePolice))}
          />
        )}
        {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${this.wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
        <Transcription
          disabled={listeAnnéesManquantes.length === annéesTotales}
          entêteLibellé={entêteLibellé}
          identifiants={[identifiant]}
          libellés={libellés}
          valeurs={[StringFormater.ajouteLePourcentage(valeurs)]}
        />
      </>
    );
  }

  protected construisLesCouleursDeLHistogramme(
    valeurs: number[],
    libellés: (number | string)[],
    calculeLaCouleurDesBarresDeLHistogramme: (valeur: number, libellés: number | string) => CouleurHistogramme
  ): CouleurHistogramme[] {
    return valeurs.map((valeur: number, index: number) => {
      return calculeLaCouleurDesBarresDeLHistogramme(valeur, libellés[index]);
    });
  }

  protected afficheUnHistogrammeHorizontal(
    valeurs: number[],
    libellés: string[],
    couleursDeLHistogramme: CouleurHistogramme[],
    libellésDesTicks: LibelléDeTickGraphe[],
    entêteLibellé: string,
    identifiant: string,
    libellésDeValeursManquantes: number[],
    nombreDeLibelléTotal: number = 3
  ): React.ReactElement {
    return (
      <HistogrammeHorizontal
        couleursDeLHistogramme={couleursDeLHistogramme}
        entêteLibellé={entêteLibellé}
        identifiant={identifiant}
        libellés={libellés}
        libellésDeValeursManquantes={libellésDeValeursManquantes}
        libellésDesTicks={libellésDesTicks}
        nombreDeLibelléTotal={nombreDeLibelléTotal}
        valeurs={valeurs}
      />
    );
  }

  protected afficheUnDiagrammeEnDonut(
    valeurs: number[],
    libellés: string[],
    couleursDuDoughnut: CouleurHistogramme[],
    libellésDesValeurs: LibelléDeDonnéeGraphe[],
    texteCentral: string,
    total: number,
    idDeLaLégende: string
  ): JSX.Element {
    const data: ChartData<"doughnut", number[], string> = {
      datasets: [
        {
          backgroundColor: couleursDuDoughnut.map((couleur) => couleur.premierPlan),
          borderColor: this.couleurDeFondDuBloc,
          borderWidth: 1,
          data: valeurs,
          datalabels: { labels: { title: { color: libellésDesValeurs.map((libellé) => libellé.couleur) } } },
          hoverBackgroundColor: couleursDuDoughnut.map((couleur) => couleur.premierPlan),
          type: "doughnut",
        },
      ],
      labels: libellés,
    };

    return (
      <div className={styles["donut-wrapper"]}>
        <div>
          <Doughnut data={data} options={this.optionsDiagrammeDoughnut(texteCentral, total, idDeLaLégende)} />
        </div>
        <menu className={styles["légende-donut"]} id={idDeLaLégende} />
      </div>
    );
  }

  private construisLePluginDeLégende() {
    function créeLeLibelléPourLaLégende(chart: ChartJS, libellé: LegendItem): HTMLLIElement {
      const conteneur = document.createElement("li");

      const caseÀCocher = document.createElement("input");
      caseÀCocher.type = "checkbox";
      caseÀCocher.id = libellé.text;
      caseÀCocher.name = libellé.text;
      caseÀCocher.checked = chart.isDatasetVisible(libellé.datasetIndex);

      const libelléCaseÀCocher = document.createElement("label");
      libelléCaseÀCocher.classList.add("fr-label");
      libelléCaseÀCocher.htmlFor = libellé.text;

      libelléCaseÀCocher.onclick = () => {
        chart.setDatasetVisibility(libellé.datasetIndex, !chart.isDatasetVisible(libellé.datasetIndex));
        chart.update();
      };

      caseÀCocher.onkeydown = (event) => {
        if (event.code === "Space") {
          event.preventDefault();
          chart.setDatasetVisibility(libellé.datasetIndex, !chart.isDatasetVisible(libellé.datasetIndex));
          chart.update();
          // @ts-ignore
          document.getElementById(event.target.id).focus();
        }
      };

      const cercleDeCouleur = document.createElement("span");
      cercleDeCouleur.style.background = libellé.fillStyle as string;
      cercleDeCouleur.style.border = `solid ${libellé.strokeStyle} 1px`;
      cercleDeCouleur.innerHTML = "&nbsp;";
      libelléCaseÀCocher.appendChild(cercleDeCouleur);

      const texteDuLibellé = document.createTextNode(libellé.text);
      libelléCaseÀCocher.appendChild(texteDuLibellé);

      conteneur.appendChild(caseÀCocher);
      conteneur.appendChild(libelléCaseÀCocher);
      return conteneur;
    }

    return {
      afterUpdate(chart: ChartJS, _args: Object, options: any) {
        const légende = document.getElementById(options.containerID);

        if (!légende) return;

        while (légende.firstChild) {
          légende.firstChild.remove();
        }

        // @ts-ignore
        const libellésDeLaLégende = chart.options.plugins?.legend?.labels.generateLabels(chart) || [];

        libellésDeLaLégende.forEach((libellé) => {
          const libelléDeLégende = créeLeLibelléPourLaLégende(chart, libellé);
          légende.appendChild(libelléDeLégende);
        });
      },
      id: "htmlLegend",
    };
  }

  private optionsHistogrammeVertical(grosseursDePoliceDesLibellés: string[]): ChartOptions<"bar"> {
    return {
      animation: false,
      plugins: {
        datalabels: {
          align: "end",
          anchor: "start",
          font: {
            family: "Marianne",
            size: 16,
            weight: 700,
          },
          formatter: (value: number, _context: Context): string => value.toLocaleString("fr") + " %",
        },
        legend: { display: false },
        tooltip: { enabled: false },
      },
      radius: false,
      scales: {
        x: {
          grid: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          stacked: true,
          ticks: {
            color: this.couleurDelAbscisse,
            // @ts-ignore
            font: { weight: grosseursDePoliceDesLibellés },
            padding: 10,
          },
        },
        xLine: {
          display: false,
          max: 1,
          min: 0,
          type: "linear",
        },
        y: {
          display: false,
          max: this.borneMaximaleDeLHistogrammeVertical,
        },
      },
    };
  }

  protected optionsHistogrammeÀBandes(idDeLaLégende: string, créeLeLibelléDuTooltip: Function): ChartOptions<"bar"> {
    return {
      animation: false,
      elements: { bar: { borderWidth: 2 } },
      plugins: {
        datalabels: { display: false },
        // @ts-ignore
        htmlLegend: { containerID: idDeLaLégende },
        legend: { display: false },
        tooltip: { callbacks: { label: créeLeLibelléDuTooltip(this.wording) } },
      },
      responsive: true,
      scales: {
        x: {
          grid: { drawOnChartArea: false },
          ticks: { color: "var(--text-default-grey)" },
        },
        y: {
          grid: {
            color: this.couleurDelAbscisse,
            drawBorder: false,
          },
          stacked: true,
          ticks: { color: "var(--text-default-grey)" },
        },
      },
    };
  }

  private optionsDiagrammeDoughnut(texteCentral: string, totalDesValeurs: number, idDeLaLégende: string): ChartOptions<"doughnut"> {
    const unArcEstSurvolé = (élémentsActifs: ActiveElement[]) => élémentsActifs.length && élémentsActifs[0].element instanceof ArcElement;
    const metsEnGrasLaPoliceDuLibelléDeLégende = (élément: Element) => {
      élément.classList.add("fr-text--bold");
    };
    const enlèveLaPoliceGrasseDuLibelléDeLégende = (élément: Element) => {
      élément.classList.remove("fr-text--bold");
    };
    const unAutreArcÉtaitSurvolé = (indexDeLArcSurvolé: number) =>
      this.indexDeLArcSurvolé !== this.AUCUN_ARC_SURVOLÉ && indexDeLArcSurvolé !== this.indexDeLArcSurvolé;
    const plusAucunArcNestSurvolé = (élémentsActifs: ActiveElement[]) => élémentsActifs.length === 0 && this.indexDeLArcSurvolé !== this.AUCUN_ARC_SURVOLÉ;

    return {
      animation: false,
      aspectRatio: 1,
      cutout: "40%",
      elements: {
        // @ts-ignore
        center: {
          color: this.couleurDelAbscisse,
          fontStyle: "Marianne",
          text: texteCentral,
        },
      },
      onHover: (_event: ChartEvent, elements: ActiveElement[], chart: ChartJS) => {
        if (unArcEstSurvolé(elements)) {
          const indexDeLArcSurvolé = elements[0].index;

          const légende = document.getElementById(idDeLaLégende);
          if (!légende) return;

          const couleurs = chart.data.datasets[0].backgroundColor as string[];
          const nouvellesCouleursDesArcs = couleurs.map((couleur, index) =>
            index !== indexDeLArcSurvolé && this.associeLaCouleurTransparente[couleur] ? this.associeLaCouleurTransparente[couleur] : couleur
          );

          if (unAutreArcÉtaitSurvolé(indexDeLArcSurvolé)) {
            enlèveLaPoliceGrasseDuLibelléDeLégende(légende.children[this.indexDeLArcSurvolé]);
          }
          chart.data.datasets[0].backgroundColor = nouvellesCouleursDesArcs;
          chart.update();
          metsEnGrasLaPoliceDuLibelléDeLégende(légende.children[indexDeLArcSurvolé]);

          this.indexDeLArcSurvolé = indexDeLArcSurvolé;
        }

        if (plusAucunArcNestSurvolé(elements)) {
          const légende = document.getElementById(idDeLaLégende);
          if (!légende) return;

          const couleurs = chart.data.datasets[0].backgroundColor as string[];
          const nouvellesCouleursDesArcs = couleurs.map((couleur) => (this.associeLaCouleurOpaque[couleur] ? this.associeLaCouleurOpaque[couleur] : couleur));
          chart.data.datasets[0].backgroundColor = nouvellesCouleursDesArcs;
          chart.update();

          enlèveLaPoliceGrasseDuLibelléDeLégende(légende.children[this.indexDeLArcSurvolé]);

          this.indexDeLArcSurvolé = this.AUCUN_ARC_SURVOLÉ;
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

  private construisLePluginDeTexteAuCentreDuDonut() {
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
}

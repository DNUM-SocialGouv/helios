import { Chart as ChartJS, LegendItem } from "chart.js";

export function construisLePluginDeLaLegende() {
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
      const libellésDeLaLégende = chart.options.plugins?.legend?.labels.generateLabels(chart);

      libellésDeLaLégende?.forEach((libellé) => {
        const libelléDeLégende = créeLeLibelléPourLaLégende(chart, libellé);
        légende.appendChild(libelléDeLégende);
      });
    },
    id: "htmlLegend",
  };
}

import { Chart as ChartJS } from "chart.js";

import { StringFormater } from "../StringFormater";


export function construisLePluginDeLaLegendeDonut() {
  function créeLeLibelléPourLaLégende(deselectedMap: Map<string, boolean>, chart: ChartJS, libellé: any): HTMLLIElement {

    const conteneur = document.createElement("li");

    const caseÀCocher = document.createElement("input");
    caseÀCocher.type = "checkbox";
    caseÀCocher.id = libellé.text;
    caseÀCocher.name = libellé.text;
    caseÀCocher.checked = !libellé.hidden;

    const libelléCaseÀCocher = document.createElement("label");
    libelléCaseÀCocher.classList.add("fr-label");
    libelléCaseÀCocher.htmlFor = libellé.text;

    const handleCheckboxChange = () => {
      if (chart.getDataVisibility(libellé.index)) {
        deselectedMap.set(libellé.text, true);
      } else {
        deselectedMap.set(libellé.text, false);
      }
      chart.update();
    }

    caseÀCocher.addEventListener('change', handleCheckboxChange);

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

  function handleSelection(deselectedMap: Map<string, boolean>, chart: ChartJS, label: string, index: number) {
    const deselected = deselectedMap.get(label);
    const visible = chart.getDataVisibility(index);
    //Si la ligne est déselectionnée et que la valeur est visible, on la rend invisible
    //Si la ligne est sélectionnée et que la valeur est invisible, on la rend visible
    if ((deselected && visible) || (!deselected && !visible)) {
      chart.toggleDataVisibility(index);
    }
  }

  return {
    deselectedMap: new Map<string, boolean>(),
    beforeUpdate(chart: ChartJS) {
      // On gère les items non selectionnes
      chart.data.labels?.forEach((label, index) => {
        handleSelection(this.deselectedMap, chart, label as string, index);
      });

      // Calcul du total des absence selectionnees
      let sum = 0;
      chart.data.datasets[0].data.forEach((element: any, index: number) => {
        if (chart.getDataVisibility(index)) {
          sum += element;
        }
      })
      // @ts-ignore
      chart.config.options.elements.center.text = StringFormater.formatCenterText(StringFormater.transformInRate(sum));

      // @ts-ignore - On stock le nouveau total non formatte pour usage dans les calculs
      chart.config.options.valuesTotal = sum;
    },
    afterUpdate(chart: ChartJS, _args: Object, options: any) {
      const légende = document.getElementById(options.containerID);

      if (!légende) return;
      légende.innerHTML = "";

      // @ts-ignore
      const libellésDeLaLégende = chart.options.plugins?.legend?.labels.generateLabels(chart);

      libellésDeLaLégende?.forEach((libelle) => {
        const libelléDeLégende = créeLeLibelléPourLaLégende(this.deselectedMap, chart, libelle);
        légende.appendChild(libelléDeLégende);
      });
    },
    id: "htmlLegend",
  };
}

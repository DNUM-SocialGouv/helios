import { Chart as ChartJS } from "chart.js";

//import { StringFormater } from "../../commun/StringFormater";


export function construisLePluginDeLaLegendeDonut() {
  function créeLeLibelléPourLaLégende(chart: ChartJS, libellé: any): HTMLLIElement {

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
      /*
      chart.toggleDataVisibility(libellé.index);
      // @ts-ignore
      const currentSum = StringFormater.removePercent(chart.config.options.elements.center.text);
      let sum;
      if (chart.getDataVisibility(libellé.index)) {
        // @ts-ignore
        sum = currentSum + chart.data.datasets[0].data[libellé.index]
      } else {
        // @ts-ignore
        sum = currentSum - chart.data.datasets[0].data[libellé.index]
      }
      // @ts-ignore
      chart.config.options.elements.center.text = StringFormater.formatCenterText(sum.toFixed(1));
      chart.update();*/
    }

    caseÀCocher.addEventListener('change', handleCheckboxChange);

    const cercleDeCouleur = document.createElement("span");
    cercleDeCouleur.style.background = libellé.fillStyle as string;
    cercleDeCouleur.style.border = `solid ${libellé.strokeStyle} 1px`;
    cercleDeCouleur.innerHTML = "&nbsp;";
    libelléCaseÀCocher.appendChild(cercleDeCouleur);

    const texteDuLibellé = document.createTextNode(libellé.text);
    libelléCaseÀCocher.appendChild(texteDuLibellé);

   // conteneur.appendChild(caseÀCocher);
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

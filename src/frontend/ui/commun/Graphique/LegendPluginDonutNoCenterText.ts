import { Chart as ChartJS } from "chart.js";


export function construisLePluginDeLaLegendeDonut() {
  function créeLeLibelléPourLaLégende(libellé: any): HTMLLIElement {

    const conteneur = document.createElement("li");

    const caseÀCocher = document.createElement("input");
    caseÀCocher.type = "checkbox";
    caseÀCocher.id = libellé.text;
    caseÀCocher.name = libellé.text;
    caseÀCocher.checked = !libellé.hidden;

    const libelléCaseÀCocher = document.createElement("label");
    libelléCaseÀCocher.classList.add("fr-label");
    libelléCaseÀCocher.htmlFor = libellé.text;


    const cercleDeCouleur = document.createElement("span");
    cercleDeCouleur.style.background = libellé.fillStyle as string;
    cercleDeCouleur.style.border = `solid ${libellé.strokeStyle} 1px`;
    cercleDeCouleur.innerHTML = "&nbsp;";
    libelléCaseÀCocher.appendChild(cercleDeCouleur);

    const texteDuLibellé = document.createTextNode(libellé.text);
    libelléCaseÀCocher.appendChild(texteDuLibellé);

    conteneur.appendChild(libelléCaseÀCocher);
    return conteneur;
  }

  return {
    afterUpdate(chart: ChartJS, _args: object, options: any) {
      const légende = document.getElementById(options.containerID);

      if (!légende) return;

      while (légende.firstChild) {
        légende.firstChild.remove();
      }

      if (chart.options.plugins?.legend?.labels?.generateLabels) {
        const libellésDeLaLégende = chart.options.plugins?.legend?.labels.generateLabels(chart);

        libellésDeLaLégende?.forEach((libellé) => {
          const libelléDeLégende = créeLeLibelléPourLaLégende(libellé);
          légende.appendChild(libelléDeLégende);
        });
      }
    },
    id: "htmlLegend",
  };
}

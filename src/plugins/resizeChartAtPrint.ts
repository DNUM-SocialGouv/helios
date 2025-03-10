import { Chart } from "chart.js";

function resizeChartAtPrint() {
  for (const id in Chart.instances) {
    Chart.instances[id].resize();
  }
}

export function resizeChartOnPrint() {
  // La fonction doit toujours être présente donc le « in » ne fonctionne pas
  if (window.matchMedia) {
    window.matchMedia("print").addEventListener("change", function () {
      resizeChartAtPrint();
    });
  } else {
    window.onbeforeprint = resizeChartAtPrint;
  }
}

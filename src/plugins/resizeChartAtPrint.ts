import { Chart } from "chart.js";

function resizeChartAtPrint() {
  for (const id in Chart.instances) {
    Chart.instances[id].resize();
  }
}

export function resizeChartOnPrint() {
  if ("matchMedia" in window) {
    window.matchMedia("print").addEventListener("change", function () {
      resizeChartAtPrint();
    });
  } else {
    window.onbeforeprint = resizeChartAtPrint;
  }
}

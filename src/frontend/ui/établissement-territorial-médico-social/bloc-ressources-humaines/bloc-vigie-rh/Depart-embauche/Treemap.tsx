"use client";

import { Chart as ChartJS } from "chart.js";
import { color } from "chart.js/helpers/helpers";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";
import { Chart } from "react-chartjs-2";

ChartJS.register(TreemapController, TreemapElement);

export default function TreemapChart() {

  function colorFromRaw(ctx: any) {
    if (ctx.type !== 'data') {
      return 'transparent';
    }
    const value = ctx.raw.v;
    const alpha = (1 + Math.log(value)) / 5;
    const baseColor = "green";
    return color(baseColor).alpha(alpha).rgbString();
  }

  const valeurs = [
    { category: 'main', value: 1 },
    { category: 'main', value: 2 },
    { category: 'cat', value: 3 },
    { category: 'other', value: 4 },
    { category: 'other', value: 5 },
  ];

  const data = {
    datasets: [{
      tree: valeurs,
      key: 'value',
      groups: ['category'],
      backgroundColor: (ctx: any) => colorFromRaw(ctx),
    }]
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.raw.label}: ${ctx.raw.value}`,
        },
      },
    },
  };

  return <Chart data={data} options={options} type="treemap" />;
}

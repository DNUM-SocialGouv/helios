// Permet de résoudre l'erreur typescript 7016 si le paquet "@type/nom_du_module" n'existe pas.
declare module "minify-stream";

declare module "@gouvfr/dsfr-chart";
declare module "@gouvfr/dsfr-chart/css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

declare namespace JSX {
  interface IntrinsicElements {
    "line-chart": Any;
    "bar-chart": Any;
    "bar-line-chart": Any;
    "pie-chart": Any;
    "map-chart": Any;
    "map-chart-reg": Any;
    "scatter-chart": Any;
    "radar-chart": Any;
    "gauge-chart": Any;
    "data-box": Any;
    "table-chart": Any;
  }
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "line-chart": Any;
      "bar-chart": Any;
      "bar-line-chart": Any;
      "pie-chart": Any;
      "map-chart": Any;
      "map-chart-reg": Any;
      "scatter-chart": Any;
      "radar-chart": Any;
      "gauge-chart": Any;
      "data-box": Any;
      "table-chart": Any;
    }
  }
}

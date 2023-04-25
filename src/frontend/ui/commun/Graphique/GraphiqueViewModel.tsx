import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

export type TaillePoliceTick = "normal" | "bold";

export type CouleurHistogramme = Readonly<{
  premierPlan: string;
  secondPlan?: string;
}>;

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { construisLePluginDeLaLegende } from "./LegendPlugin";

export const couleurDuFond = "#E8EDFF";
export const couleurDuFondHistogrammePrimaire = "#000091";
export const couleurDuFondHistogrammeSecondaire = "#4E68BB";
export const couleurDuFondDeLaLigne = "#929292";
export const couleurSecondPlanHistogrammeDeDépassement = "#FFE9E9";
export const couleurDelAbscisse = "#161616";
export const couleurIdentifiant = "#000";
export const noir = "#FFF";
export const couleurDeFondDuBloc = "#F6F6F6";
export const couleurErreur = "#C9191E";
export const couleurDuFondHistogrammeBleuFoncé = "#2F4077";
export const couleurDuFondHistogrammeBleuClair = "#DEE5FD";
export const couleurDuFondHistogrammeRougeClair = "#FEE9E6";
export const couleurDuFondHistogrammeRougeFoncé = "#A94645";
export const couleurDuFondHistogrammeVertClair = "#DFFDF7";
export const couleurDuFondHistogrammeVertFoncé = "#006A6F";
export const couleurDuFondHistogrammeOrange = "#FA794A";
export const couleurDuSeuil = "#18753C";
// Les Graphiques Vigie RH
export const couleurDuFondHistogrammeOrangeClair = "#FB926B";
export const couleurDuFondHistogrammeJaune = "#E2CF58";
export const couleurDesTraitsRefHistogramme = "#929292";

export type TaillePoliceTick = "bold" | "normal";
export type CouleurHistogramme = Readonly<{
  premierPlan: string;
  secondPlan?: string;
}>;

ChartJS.register(
  Title,
  LineController,
  Legend,
  BarElement,
  BarController,
  LinearScale,
  CategoryScale,
  ChartDataLabels,
  PointElement,
  LineElement,
  Tooltip,
  construisLePluginDeLaLegende()
);

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

import { Wording } from "../../../configuration/wording/Wording";
import {
  couleurDelAbscisse,
  couleurDuFond,
  couleurDuFondDeLaLigne,
  couleurDuFondHistogrammeDeDépassement,
  couleurDuFondHistogrammePrimaire,
  couleurDuFondHistogrammeSecondaire,
  couleurIdentifiant,
  couleurSecondPlanHistogrammeDeDépassement,
} from "./couleursGraphique";
import { construisLePluginDeLaLegende } from "./LegendPlugin";

export type LibelléDeDonnéeGraphe = Readonly<{
  couleur: string;
}>;

export type LibelléDeTickGraphe = Readonly<{
  tailleDePolice: string;
}>;

export type CouleurHistogramme = Readonly<{
  premierPlan: string;
  secondPlan?: string;
}>;

export class GraphiqueViewModel {
  protected readonly SEUIL_DE_CONTRASTE_DES_LIBELLÉS_DES_TAUX = 20;
  readonly couleurDuFond = couleurDuFond;
  readonly couleurDuFondHistogrammePrimaire = couleurDuFondHistogrammePrimaire;
  readonly couleurDuFondHistogrammeSecondaire = couleurDuFondHistogrammeSecondaire;
  readonly couleurDuFondDeLaLigne = couleurDuFondDeLaLigne;
  readonly couleurDuFondHistogrammeDeDépassement = couleurDuFondHistogrammeDeDépassement;
  readonly couleurSecondPlanHistogrammeDeDépassement = couleurSecondPlanHistogrammeDeDépassement;
  readonly couleurDelAbscisse = couleurDelAbscisse;
  readonly couleurIdentifiant = couleurIdentifiant;
  readonly policeGrasse = "bold";
  readonly policeNormale = "normal";

  constructor(protected readonly wording: Wording) {
    ChartJS.register(
      BarElement,
      CategoryScale,
      ChartDataLabels,
      Legend,
      LinearScale,
      LineController,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      construisLePluginDeLaLegende()
    );
  }
  protected construisLesCouleursDeLHistogramme(
    valeurs: number[],
    libellés: (number | string)[],
    calculeLaCouleurDesBarresDeLHistogramme: (valeur: number, libellés: number | string) => CouleurHistogramme
  ): CouleurHistogramme[] {
    return valeurs.map((valeur: number, index: number) => {
      return calculeLaCouleurDesBarresDeLHistogramme(valeur, libellés[index]);
    });
  }
}

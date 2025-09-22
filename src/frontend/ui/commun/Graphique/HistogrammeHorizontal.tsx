import { ReactElement } from "react";

import { StringFormater } from "../StringFormater";
import { CouleurHistogramme } from "./couleursGraphique";
import { HistogrammeData, HistogrammesHorizontaux } from "./HistogrammesHorizontaux";

type HistogrammeHorizontalProps = {
  valeurs: number[];
  libellés: string[];
  couleursDeLHistogramme: CouleurHistogramme[];
  entêteLibellé: string;
  identifiant: string;
  libellésDeValeursManquantes: number[];
  nombreDeLibelléTotal: number;
  cacheLesValeursBasse?: boolean;
  formateur?: (value: any) => string;
};

export const HistogrammeHorizontal = ({
  valeurs,
  libellés,
  couleursDeLHistogramme,
  entêteLibellé,
  identifiant,
  libellésDeValeursManquantes,
  nombreDeLibelléTotal = 3,
  cacheLesValeursBasse,
  formateur = (valeur) => StringFormater.formatInFrench(valeur)
}: HistogrammeHorizontalProps): ReactElement => {
  const valeursDesHistogrammes: HistogrammeData[] = [
    new HistogrammeData(
      "",
      libellés,
      valeurs,
      [
        {
          data: valeurs,
          backgroundColor: couleursDeLHistogramme.map((couleur) => couleur.premierPlan),
          label: identifiant,
        },
      ],
      formateur
    ),
  ];

  return (
    <HistogrammesHorizontaux
      annéesManquantes={libellésDeValeursManquantes}
      cacheLesValeursBasse={cacheLesValeursBasse}
      epaisseur="FIN"
      identifiant={identifiant}
      nom={entêteLibellé}
      nombreDAnnéeTotale={nombreDeLibelléTotal}
      valeursDesHistogrammes={valeursDesHistogrammes}
    />
  );
};

"use client";

import { useEffect } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { CouleurHistogramme } from "../Graphique/couleursGraphique";
import { HistogrammeHorizontal } from "../Graphique/HistogrammeHorizontal";

type IndicateurGraphiqueChartDsfrProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  valeurs: number[];
  libellés: string[];
  couleursDeLHistogramme: CouleurHistogramme[];
  libellésDeValeursManquantes: number[];
  nombreDeLibelléTotal: number;
  dateDeMiseAJour: string;
  identifiant: string;
  source: string;
}>;

export const IndicateurGraphiqueChartDsfr = ({
  etabTitle,
  etabFiness,
  valeurs,
  libellés,
  couleursDeLHistogramme,
  libellésDeValeursManquantes,
  nombreDeLibelléTotal,
  dateDeMiseAJour,
  identifiant,
  source
}: IndicateurGraphiqueChartDsfrProps) => {
  const { wording } = useDependencies();


  useEffect(() => {
    // @ts-ignore
    import("@gouvfr/dsfr-chart");
    import("@gouvfr/dsfr-chart/css");
  }, []);

  return (
    <div>
      <data-box
        date={dateDeMiseAJour}
        id={identifiant}
        modal-content="Contenu de la modale"
        modal-title="Titre de la modale"
        source={source}
        title="Emplois en France"
        tooltip-content="Pour l’année 2018. France hors Mayotte, population des ménages, personnes en emploi."
        tooltip-title="Statut des emplois en France"
        trend='-15%'
      >
      </data-box>

      <HistogrammeHorizontal
        cacheLesValeursBasse={true}
        couleursDeLHistogramme={couleursDeLHistogramme}
        databoxId={identifiant}
        entêteLibellé={wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
        libellés={libellés}
        libellésDeValeursManquantes={libellésDeValeursManquantes}
        nomGraph={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
        nombreDeLibelléTotal={nombreDeLibelléTotal}
        valeurs={valeurs}
      />

      <table-chart
        databox-id={identifiant}
        databox-type='table'
        name='["Pourcentage"]'
        table-name='Catégories'
        x='["Emplois à durée indéterminée","Non-salariés","Contrats à durée déterminée","Apprentis","Intérimaires"]'
        y='[[74.8, 11.7, 9.3, 1.6, 2.6]]'
      >
      </table-chart>
    </div>
  );
};

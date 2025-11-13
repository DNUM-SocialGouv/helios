import { ContenuNombreHAD } from "./ContenuNombreHAD";
import { GraphiqueNombreHADViewModel } from "./GraphiqueNombreHADViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";

type GraphiqueNombreHADProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  nombreHADViewModel: GraphiqueNombreHADViewModel;
}>;
export const GraphiqueNombreHAD = ({ etabTitle, etabFiness, nombreHADViewModel }: GraphiqueNombreHADProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={<ContenuNombreHAD dateDeMiseÀJour={nombreHADViewModel.dateMiseAJour} source={wording.PMSI} />}
      dateDeMiseÀJour={nombreHADViewModel.dateMiseAJour}
      identifiant="activite-6"
      nomDeLIndicateur={wording.NOMBRE_DE_HAD}
      source={wording.PMSI}
    >
      <HistogrammeHorizontal
        couleursDeLHistogramme={nombreHADViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.NOMBRE_DE_HAD}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={wording.NOMBRE_DE_HAD}
        libellés={nombreHADViewModel.libellés}
        libellésDeValeursManquantes={nombreHADViewModel.annéesManquantes()}
        nomGraph={wording.NOMBRE_DE_HAD}
        nombreDeLibelléTotal={nombreHADViewModel.NOMBRE_ANNEES}
        valeurs={nombreHADViewModel.valeurs}
      />
    </IndicateurGraphique>
  );
};

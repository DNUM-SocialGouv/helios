import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuNombreHAD } from "./ContenuNombreHAD";
import { GraphiqueNombreHADViewModel } from "./GraphiqueNombreHADViewModel";

type GraphiqueNombreHADProps = Readonly<{
  nombreHADViewModel: GraphiqueNombreHADViewModel;
}>;
export const GraphiqueNombreHAD = ({ nombreHADViewModel }: GraphiqueNombreHADProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      authorized
      contenuInfoBulle={<ContenuNombreHAD dateDeMiseÀJour={nombreHADViewModel.dateMiseAJour} source={wording.PMSI} />}
      dateDeMiseÀJour={nombreHADViewModel.dateMiseAJour}
      identifiant="activite-6"
      nomDeLIndicateur={wording.NOMBRE_DE_HAD}
      source={wording.PMSI}
    >
      <HistogrammeHorizontal
        couleursDeLHistogramme={nombreHADViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.NOMBRE_DE_HAD}
        identifiant={wording.NOMBRE_DE_HAD}
        libellés={nombreHADViewModel.libellés}
        libellésDeValeursManquantes={nombreHADViewModel.annéesManquantes()}
        nombreDeLibelléTotal={nombreHADViewModel.NOMBRE_ANNEES}
        valeurs={nombreHADViewModel.valeurs}
      />
    </IndicateurGraphique>
  );
};

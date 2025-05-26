import { ContenuNombreDePassagesAuxUrgences } from "./ContenuNombreDePassagesAuxUrgences";
import { NombrePassageAuxUrgencesViewModel } from "./NombrePassageAuxUrgencesViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";

type GraphiqueNombrePassageUrgenceProps = Readonly<{
  nombrePassageAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  estEntitéJuridique?: boolean;
}>;
export const GraphiqueNombrePassageUrgence = ({ nombrePassageAuxUrgencesViewModel, estEntitéJuridique = false }: GraphiqueNombrePassageUrgenceProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuNombreDePassagesAuxUrgences
          dateDeMiseÀJour={nombrePassageAuxUrgencesViewModel.dateMiseAJour}
          estEntitéJuridique={estEntitéJuridique}
          source={wording.RPU}
        />
      }
      dateDeMiseÀJour={nombrePassageAuxUrgencesViewModel.dateMiseAJour}
      identifiant="activite-3"
      nomDeLIndicateur={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
      source={wording.RPU}
    >
      <HistogrammeHorizontal
        couleursDeLHistogramme={nombrePassageAuxUrgencesViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.ANNÉE}
        identifiant={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
        libellés={nombrePassageAuxUrgencesViewModel.libellés}
        libellésDeValeursManquantes={nombrePassageAuxUrgencesViewModel.libellésDeValeursManquantes}
        nombreDeLibelléTotal={nombrePassageAuxUrgencesViewModel.nombreDeLibelléTotal}
        valeurs={nombrePassageAuxUrgencesViewModel.valeurs}
      />
    </IndicateurGraphique>
  );
};

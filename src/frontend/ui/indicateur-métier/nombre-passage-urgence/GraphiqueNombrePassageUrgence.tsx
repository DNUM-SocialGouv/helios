import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuNombreDePassagesAuxUrgences } from "./ContenuNombreDePassagesAuxUrgences";
import { NombrePassageAuxUrgencesViewModel } from "./NombrePassageAuxUrgencesViewModel";

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
      identifiant="activite-2"
      nomDeLIndicateur={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
      source={wording.RPU}
    >
      <HistogrammeHorizontal
        couleursDeLHistogramme={nombrePassageAuxUrgencesViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.ANNÉE}
        identifiant={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
        libellés={nombrePassageAuxUrgencesViewModel.libellés}
        libellésDeValeursManquantes={nombrePassageAuxUrgencesViewModel.libellésDeValeursManquantes}
        libellésDesTicks={nombrePassageAuxUrgencesViewModel.libellésDesTicks}
        libellésDesValeurs={nombrePassageAuxUrgencesViewModel.libellésDesValeurs}
        nombreDeLibelléTotal={nombrePassageAuxUrgencesViewModel.nombreDeLibelléTotal}
        ratioLargeurSurHauteur={nombrePassageAuxUrgencesViewModel.ratioLargeurSurHauteur}
        valeurs={nombrePassageAuxUrgencesViewModel.valeurs}
      />
    </IndicateurGraphique>
  );
};

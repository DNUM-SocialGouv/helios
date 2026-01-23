import { NombrePassageAuxUrgencesViewModel } from "./NombrePassageAuxUrgencesViewModel";
import { IndicateurGraphiqueChartDsfr } from "../../commun/IndicateurGraphique/IndicateuGraphiqueChartDSFR";

type GraphiqueNombrePassageUrgenceProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  nombrePassageAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  estEntitéJuridique?: boolean;
}>;
export const GraphiqueNombrePassageUrgence = ({ etabTitle, etabFiness, nombrePassageAuxUrgencesViewModel, estEntitéJuridique = false }: GraphiqueNombrePassageUrgenceProps) => {

  return (
    <IndicateurGraphiqueChartDsfr

      couleursDeLHistogramme={nombrePassageAuxUrgencesViewModel.couleursDeLHistogramme}
      dateDeMiseAJour={nombrePassageAuxUrgencesViewModel.dateMiseAJour}
      etabFiness={etabFiness}
      etabTitle={etabTitle}
      identifiant="activite-4"
      libellés={nombrePassageAuxUrgencesViewModel.libellés}
      libellésDeValeursManquantes={nombrePassageAuxUrgencesViewModel.libellésDeValeursManquantes}
      nombreDeLibelléTotal={nombrePassageAuxUrgencesViewModel.nombreDeLibelléTotal}
      source="RPU"
      valeurs={nombrePassageAuxUrgencesViewModel.valeurs}

    />
  );
};

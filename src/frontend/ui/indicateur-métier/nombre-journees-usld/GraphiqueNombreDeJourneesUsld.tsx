import { ContenuNombreDeJourneesUsld } from "./ContenuNombreDeJourneesUsld";
import { NombreDeJourneesUsldViewModel } from "./NombreDeJourneesUsldViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeHorizontal } from "../../commun/Graphique/HistogrammeHorizontal";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";

type GraphiqueNombreDeJourneesUsldProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  nombreDeJourneesUsldViewModel: NombreDeJourneesUsldViewModel;
  estEntitéJuridique?: boolean;
}>;
export const GraphiqueNombreDeJourneesUsld = ({ etabTitle, etabFiness, nombreDeJourneesUsldViewModel, estEntitéJuridique = false }: GraphiqueNombreDeJourneesUsldProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuNombreDeJourneesUsld
          dateDeMiseÀJour={nombreDeJourneesUsldViewModel.dateMiseAJour}
          estEntitéJuridique={estEntitéJuridique}
          source={wording.SAE}
        />
      }
      dateDeMiseÀJour={nombreDeJourneesUsldViewModel.dateMiseAJour}
      identifiant="activite-3"
      nomDeLIndicateur={wording.NOMBRE_DE_JOURNEES_USLD}
      source={wording.SAE}
    >
      <HistogrammeHorizontal
        cacheLesValeursBasse={true}
        couleursDeLHistogramme={nombreDeJourneesUsldViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.ANNÉE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiant={wording.NOMBRE_DE_JOURNEES_USLD}
        libellés={nombreDeJourneesUsldViewModel.libellés}
        libellésDeValeursManquantes={nombreDeJourneesUsldViewModel.libellesDeValeursManquantes}
        nomGraph={wording.NOMBRE_DE_JOURNEES_USLD}
        nombreDeLibelléTotal={nombreDeJourneesUsldViewModel.nombreDeLibelléTotal}
        valeurs={nombreDeJourneesUsldViewModel.valeurs}
      />
    </IndicateurGraphique>
  );
};

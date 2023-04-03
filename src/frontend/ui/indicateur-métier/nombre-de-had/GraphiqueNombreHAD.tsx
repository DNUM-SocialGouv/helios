import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammesHorizontaux } from "../../commun/Graphique/HistogrammesHorizontaux";
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
      contenuInfoBulle={<ContenuNombreHAD dateDeMiseÀJour={nombreHADViewModel.dateMiseAJour} source={wording.RPU} />}
      dateDeMiseÀJour={nombreHADViewModel.dateMiseAJour}
      identifiant="activite-2"
      nomDeLIndicateur={wording.NOMBRE_DE_HAD}
      source={wording.RPU}
    >
      <HistogrammesHorizontaux
        annéesManquantes={nombreHADViewModel.annéesManquantes()}
        nom={wording.NOMBRE_DE_HAD}
        nombreDAnnéeTotale={nombreHADViewModel.NOMBRE_ANNEES}
        valeursDesHistogrammes={[nombreHADViewModel.valeursHAD()]}
      />
    </IndicateurGraphique>
  );
};

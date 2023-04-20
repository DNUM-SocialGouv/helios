import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuTauxDeCaf } from "../../établissement-territorial-médico-social/InfoBulle/ContenuTauxDeCaf";
import { TauxDeCafViewModel } from "./TauxDeCafViewModel";

export const TauxDeCaf = ({ tauxDeCafViewModel }: { tauxDeCafViewModel: TauxDeCafViewModel }) => {
  const { wording } = useDependencies();
  return (
    <IndicateurGraphique
      contenuInfoBulle={<ContenuTauxDeCaf dateDeMiseÀJour={tauxDeCafViewModel.dateMiseÀJourTauxDeCaf} source={wording.CNSA} />}
      dateDeMiseÀJour={tauxDeCafViewModel.dateMiseÀJourTauxDeCaf}
      identifiant="budget-et-finances-taux-de-caf"
      nomDeLIndicateur={wording.TAUX_DE_CAF}
      source={wording.CNSA}
    >
      {tauxDeCafViewModel.tauxDeCaf}
    </IndicateurGraphique>
  );
};

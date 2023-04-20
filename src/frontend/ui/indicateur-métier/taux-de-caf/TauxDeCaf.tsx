import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuTauxDeCaf } from "./ContenuTauxDeCaf";
import { ContenuTauxDeCafEJ } from "./ContenuTauxDeCafEJ";
import { TauxDeCafViewModel } from "./TauxDeCafViewModel";

export const TauxDeCaf = ({ tauxDeCafViewModel, isEntiteJuridique = false }: { tauxDeCafViewModel: TauxDeCafViewModel; isEntiteJuridique?: boolean }) => {
  const { wording } = useDependencies();
  const source = isEntiteJuridique ? wording.ANCRE : wording.CNSA;
  const Contenu = isEntiteJuridique ? ContenuTauxDeCafEJ : ContenuTauxDeCaf;
  return (
    <IndicateurGraphique
      contenuInfoBulle={<Contenu dateDeMiseÀJour={tauxDeCafViewModel.dateMiseÀJourTauxDeCaf} source={source} />}
      dateDeMiseÀJour={tauxDeCafViewModel.dateMiseÀJourTauxDeCaf}
      identifiant="budget-et-finances-taux-de-caf"
      nomDeLIndicateur={wording.TAUX_DE_CAF}
      source={source}
    >
      {tauxDeCafViewModel.tauxDeCaf}
    </IndicateurGraphique>
  );
};

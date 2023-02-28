import { useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { CompteDeResultatViewModel } from "../../établissement-territorial-médico-social/bloc-budget-et-finances/ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel";
import { ContenuCompteDeRésultat } from "../../établissement-territorial-médico-social/InfoBulle/ContenuCompteDeRésultat";

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  compteDeRésultatViewModel: CompteDeResultatViewModel;
}>;

export const GraphiqueCompteDeResultat = ({ compteDeRésultatViewModel }: BlocBudgetEtFinancesMédicoSocialProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(compteDeRésultatViewModel.annéeInitiale);

  return (
    <IndicateurGraphique
      années={compteDeRésultatViewModel.listeDéroulanteDesAnnéesDuCompteDeRésultat(setAnnéeEnCours)}
      contenuInfoBulle={<ContenuCompteDeRésultat dateDeMiseÀJour={compteDeRésultatViewModel.dateMiseÀJour} source={wording.CNSA} />}
      dateDeMiseÀJour={compteDeRésultatViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-compte-de-résultat"
      nomDeLIndicateur={<>{compteDeRésultatViewModel.intituléDuCompteDeRésultat(annéeEnCours)}</>}
      source={wording.CNSA}
    >
      {compteDeRésultatViewModel.compteDeRésultat(annéeEnCours)}
    </IndicateurGraphique>
  );
};

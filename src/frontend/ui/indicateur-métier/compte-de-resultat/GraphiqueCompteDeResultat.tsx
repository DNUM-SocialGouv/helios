import { useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from "../../établissement-territorial-médico-social/bloc-budget-et-finances/ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel";
import { ContenuCompteDeRésultat } from "../../établissement-territorial-médico-social/InfoBulle/ContenuCompteDeRésultat";

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialBudgetEtFinancesViewModel: ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel;
}>;

export const GraphiqueCompteDeResultat = ({ établissementTerritorialMédicoSocialBudgetEtFinancesViewModel }: BlocBudgetEtFinancesMédicoSocialProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.annéeInitiale);

  return (
    <IndicateurGraphique
      années={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.listeDéroulanteDesAnnéesDuCompteDeRésultat(setAnnéeEnCours)}
      contenuInfoBulle={
        <ContenuCompteDeRésultat
          dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
          source={wording.CNSA}
        />
      }
      dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
      identifiant="budget-et-finances-compte-de-résultat"
      nomDeLIndicateur={<>{établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.intituléDuCompteDeRésultat(annéeEnCours)}</>}
      source={wording.CNSA}
    >
      {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.compteDeRésultat(annéeEnCours)}
    </IndicateurGraphique>
  );
};

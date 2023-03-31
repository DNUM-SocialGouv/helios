import { useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { DeuxHistogrammesHorizontaux } from "../../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCompteDeRésultat } from "../../InfoBulle/ContenuCompteDeRésultat";
import { CompteDeResultatViewModel } from "./CompteDeResultatViewModel";

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  compteDeRésultatViewModel: CompteDeResultatViewModel;
}>;

export const GraphiqueCompteDeResultat = ({ compteDeRésultatViewModel }: BlocBudgetEtFinancesMédicoSocialProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(compteDeRésultatViewModel.annéeInitiale);
  const budgetEtFinance = compteDeRésultatViewModel.budgetEtFinanceEnCours(annéeEnCours);
  const annees = compteDeRésultatViewModel.anneesAvecCompteDeResultat();

  return (
    <IndicateurGraphique
      années={{ liste: annees, setAnnéeEnCours }}
      contenuInfoBulle={<ContenuCompteDeRésultat dateDeMiseÀJour={compteDeRésultatViewModel.dateMiseÀJour} source={wording.CNSA} />}
      dateDeMiseÀJour={compteDeRésultatViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-compte-de-résultat"
      nomDeLIndicateur={<>{compteDeRésultatViewModel.intituléDuCompteDeRésultat(annéeEnCours)}</>}
      source={wording.CNSA}
    >
      <DeuxHistogrammesHorizontaux
        annéesManquantes={compteDeRésultatViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
        nom={compteDeRésultatViewModel.intituléDuCompteDeRésultat(annéeEnCours)}
        nombreDAnnéeTotale={3}
        valeursDeDroite={compteDeRésultatViewModel.recettesOuProduits(budgetEtFinance)}
        valeursDeGauche={compteDeRésultatViewModel.dépensesOuCharges(budgetEtFinance)}
      />
    </IndicateurGraphique>
  );
};

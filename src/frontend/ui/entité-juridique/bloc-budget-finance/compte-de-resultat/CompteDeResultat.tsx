import { useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { DeuxHistogrammesHorizontaux } from "../../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { SelectionAnnee } from "../../../commun/Graphique/SelectionAnnee";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCompteDeRésultatEJ } from "../../info-bulle/ContenuCompteDeRésultatEJ";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../EntitéJuridiqueBudgetFinanceViewModel";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
}>;

export function CompteDeResultat({ entitéJuridiqueBudgetFinanceViewModel }: BlocBudgetFinanceProps) {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(entitéJuridiqueBudgetFinanceViewModel.annéeInitiale);
  const budgetEtFinance = entitéJuridiqueBudgetFinanceViewModel.budgetEtFinanceEnCours(annéeEnCours);

  return (
    <IndicateurGraphique
      années={<SelectionAnnee annees={entitéJuridiqueBudgetFinanceViewModel.lesAnnéesEffectivesDuCompteDeRésultat()} setAnnéeEnCours={setAnnéeEnCours} />}
      contenuInfoBulle={<ContenuCompteDeRésultatEJ dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour} source={wording.ANCRE} />}
      dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-compte-de-résultat"
      nomDeLIndicateur={<>{wording.COMPTE_DE_RÉSULTAT}</>}
      source={wording.ANCRE}
    >
      <DeuxHistogrammesHorizontaux
        annéesManquantes={entitéJuridiqueBudgetFinanceViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
        légendes={entitéJuridiqueBudgetFinanceViewModel.légendeChart}
        nom={wording.COMPTE_DE_RÉSULTAT}
        nombreDAnnéeTotale={entitéJuridiqueBudgetFinanceViewModel.NOMBRE_ANNEES}
        valeursDeDroite={entitéJuridiqueBudgetFinanceViewModel.dataGraphiqueProduits(budgetEtFinance)}
        valeursDeGauche={entitéJuridiqueBudgetFinanceViewModel.dataGraphiqueCharges(budgetEtFinance)}
      />
    </IndicateurGraphique>
  );
}

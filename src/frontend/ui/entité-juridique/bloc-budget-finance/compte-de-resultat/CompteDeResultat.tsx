import { useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammesHorizontaux } from "../../../commun/Graphique/HistogrammesHorizontaux";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../EntitéJuridiqueBudgetFinanceViewModel";
import { ContenuCompteDeRésultatEJ } from "./ContenuCompteDeRésultatEJ";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
}>;

export function CompteDeResultat({ entitéJuridiqueBudgetFinanceViewModel }: BlocBudgetFinanceProps) {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(entitéJuridiqueBudgetFinanceViewModel.annéeInitiale);
  const budgetEtFinance = entitéJuridiqueBudgetFinanceViewModel.budgetEtFinanceEnCours(annéeEnCours);

  return (
    <IndicateurGraphique
      années={{ liste: entitéJuridiqueBudgetFinanceViewModel.lesAnnéesEffectivesDuCompteDeRésultat(), setAnnéeEnCours }}
      contenuInfoBulle={<ContenuCompteDeRésultatEJ dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour} source={wording.ANCRE} />}
      dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-compte-de-résultat"
      nomDeLIndicateur={<>{wording.COMPTE_DE_RÉSULTAT_CF}</>}
      source={wording.ANCRE}
    >
      <HistogrammesHorizontaux
        annéesManquantes={entitéJuridiqueBudgetFinanceViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
        légende={entitéJuridiqueBudgetFinanceViewModel.légendeChart}
        nom={wording.COMPTE_DE_RÉSULTAT_CF}
        nombreDAnnéeTotale={entitéJuridiqueBudgetFinanceViewModel.NOMBRE_ANNEES}
        valeursDesHistogrammes={[
          entitéJuridiqueBudgetFinanceViewModel.dataGraphiqueCharges(budgetEtFinance),
          entitéJuridiqueBudgetFinanceViewModel.dataGraphiqueProduits(budgetEtFinance),
        ]}
      />
    </IndicateurGraphique>
  );
}

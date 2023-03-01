import { useState } from "react";

import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { DeuxHistogrammeHorizontaux } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
}>;

export const BlocBudgetFinance = ({ entitéJuridiqueBudgetFinanceViewModel }: BlocBudgetFinanceProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours] = useState<number>(entitéJuridiqueBudgetFinanceViewModel.annéeInitiale);
  const budgetEtFinance = entitéJuridiqueBudgetFinanceViewModel.budgetEtFinanceEnCours(annéeEnCours);

  if (entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetEtFinanceNesontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_BUDGET_ET_FINANCES} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}>
      <ul className="indicateurs">
        <DeuxHistogrammeHorizontaux
          annéesManquantes={entitéJuridiqueBudgetFinanceViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
          entêtePremièreColonne={wording.TITRE_BUDGÉTAIRE}
          entêtesDesAutresColonnes={entitéJuridiqueBudgetFinanceViewModel.entêtesColonnes()}
          libellés={entitéJuridiqueBudgetFinanceViewModel.libellés()}
          nombreDAnnéeTotale={5}
          ratioLargeurSurHauteur={2}
          valeursDeDroite={entitéJuridiqueBudgetFinanceViewModel.produitsPrincipaux(budgetEtFinance)}
          valeursDeGauche={entitéJuridiqueBudgetFinanceViewModel.chargesPrincipales(budgetEtFinance)}
        />
      </ul>
    </Bloc>
  );
};

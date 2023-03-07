import { FEATURE_NAME } from "../../../utils/featureToggle";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { ResultatNetComptable } from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptable";
import { CompteDeResultat } from "./compte-de-resultat/CompteDeResultat";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";
import {
  ResultatNetComptableViewModel
} from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptableViewModel";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
  resultatNetComptableViewModel: ResultatNetComptableViewModel;
}>;
// TODO Check how to add the correct view models
export const BlocBudgetFinance = ({ entitéJuridiqueBudgetFinanceViewModel, resultatNetComptableViewModel }: BlocBudgetFinanceProps) => {
  const { wording, isFeatureEnabled } = useDependencies();

  if (!isFeatureEnabled(FEATURE_NAME.COMPTE_RESULTAT_EJ) || entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetEtFinanceNesontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_BUDGET_ET_FINANCES} />;
  }
  // CSS last child for bold
  return (
    <Bloc titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}>
      <ul className="indicateurs">
        <CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueBudgetFinanceViewModel} />
        <ResultatNetComptable resultatNetComptableViewModel={resultatNetComptableViewModel} />
      </ul>
    </Bloc>
  );
};

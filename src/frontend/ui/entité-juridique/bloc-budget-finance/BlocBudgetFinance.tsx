import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
}>;

export const BlocBudgetFinance = ({ entitéJuridiqueBudgetFinanceViewModel }: BlocBudgetFinanceProps) => {
  const { wording } = useDependencies();

  if (entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetEtFinanceNesontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_BUDGET_ET_FINANCES} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}>
      <ul className="indicateurs"></ul>
    </Bloc>
  );
};

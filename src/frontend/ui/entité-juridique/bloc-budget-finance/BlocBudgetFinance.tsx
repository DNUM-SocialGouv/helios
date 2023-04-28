import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { ResultatNetComptable } from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptable";
import { TauxDeCaf } from "../../indicateur-métier/taux-de-caf/TauxDeCaf";
import styles from "./BlocBudgetFinance.module.css";
import { CompteDeResultat } from "./compte-de-resultat/CompteDeResultat";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";
import { RatioDependanceFinanciere } from "./ratio-dependance-financiere/RatioDependanceFinanciere";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
}>;
export const BlocBudgetFinance = ({ entitéJuridiqueBudgetFinanceViewModel }: BlocBudgetFinanceProps) => {
  const { wording } = useDependencies();

  if (entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetEtFinanceNeSontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_BUDGET_ET_FINANCES} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}>
      <ul className={"indicateurs " + styles["budget"]}>
        <CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueBudgetFinanceViewModel} />
        <ResultatNetComptable estEntitéJuridique={true} resultatNetComptableViewModel={entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable} />
        <TauxDeCaf isEntiteJuridique={true} tauxDeCafViewModel={entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel} />
        <RatioDependanceFinanciere ratioDependanceFinanciereViewModel={entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere} />
      </ul>
    </Bloc>
  );
};

import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { ResultatNetComptable } from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptable";
import { TauxDeCaf } from "../../indicateur-métier/taux-de-caf/TauxDeCaf";
import { AllocationRessources } from "./allocation-ressources/AllocationRessources";
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
      {entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasAutorisés.length !== 0 ? <NotAUthorized indicateurs={entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasAutorisés} />
        : entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasRenseignee.length !== 0 ? <NoDataCallout indicateurs={entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasRenseignee} /> : <></>}

      <ul className={"indicateurs " + styles["budget"]}>
            {!entitéJuridiqueBudgetFinanceViewModel.compteDeResultatVide() && entitéJuridiqueBudgetFinanceViewModel.compteDeResultatEstIlAutorisé ? <CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueBudgetFinanceViewModel} /> : <></>}
            {entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable.auMoinsUnResultatNetRenseigné() && entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable.resultatNetComptableEstIlAutorisé ? <ResultatNetComptable estEntitéJuridique={true} resultatNetComptableViewModel={entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable} /> : <></>}
            {entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné && entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel.leTauxDeCafEstIlAutorisé ? <TauxDeCaf isEntiteJuridique={true} tauxDeCafViewModel={entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel} /> : <></>}
            {entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere.auMoinsUnRatioRenseigné() && entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere.ratioDependanceFinanciereEstIlAutorisé ? <RatioDependanceFinanciere ratioDependanceFinanciereViewModel={entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere} /> : <></>}
      </ul>

      <ul className="indicateurs">
          {!entitéJuridiqueBudgetFinanceViewModel.allocationRessources.vide() && entitéJuridiqueBudgetFinanceViewModel.allocationRessources.estIlAutorisé ? 
          <AllocationRessources allocationRessourcesViewModel={entitéJuridiqueBudgetFinanceViewModel.allocationRessources} /> : <></>}
      </ul>

    </Bloc>
  );
};

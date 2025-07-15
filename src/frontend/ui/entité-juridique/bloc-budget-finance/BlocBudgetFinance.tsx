import { AllocationRessources } from "./allocation-ressources/AllocationRessources";
import styles from "./BlocBudgetFinance.module.css";
import { CompteDeResultat } from "./compte-de-resultat/CompteDeResultat";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";
import { RatioDependanceFinanciere } from "./ratio-dependance-financiere/RatioDependanceFinanciere";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { ResultatNetComptable } from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptable";
import { TauxDeCaf } from "../../indicateur-métier/taux-de-caf/TauxDeCaf";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
  type : 'EJ' | 'ET_PNL' | 'ET_Autres'
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;
export const BlocBudgetFinance = ({ entitéJuridiqueBudgetFinanceViewModel, type, opnedBloc, toggelBlocs  }: BlocBudgetFinanceProps) => {
  const { wording } = useDependencies();

  if(type === 'EJ' || type === 'ET_PNL') 
  {
    if (entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetEtFinanceNeSontPasRenseignées && entitéJuridiqueBudgetFinanceViewModel.allocationRessources.vide()) {
       return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_BUDGET_ET_FINANCES} toggelBlocs={toggelBlocs}/>;
    }
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES} toggelBlocs={toggelBlocs}>
      {entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasAutorisés(type).length !== 0 ? <NotAUthorized indicateurs={entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasAutorisés(type)} />
        : entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasRenseignee(type).length !== 0 ? <NoDataCallout indicateurs={entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasRenseignee(type)} /> : <></>}

      {(type === 'EJ' || type === 'ET_PNL') ? (<ul className={"indicateurs " + styles["budget"]}>
            {!entitéJuridiqueBudgetFinanceViewModel.compteDeResultatVide() && entitéJuridiqueBudgetFinanceViewModel.compteDeResultatEstIlAutorisé ? <CompteDeResultat entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueBudgetFinanceViewModel} /> : <></>}
            {entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable.auMoinsUnResultatNetRenseigné() && entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable.resultatNetComptableEstIlAutorisé ? <ResultatNetComptable estEntitéJuridique={true} resultatNetComptableViewModel={entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable} /> : <></>}
            {entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné && entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel.leTauxDeCafEstIlAutorisé ? <TauxDeCaf isEntiteJuridique={true} tauxDeCafViewModel={entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel} /> : <></>}
            {entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere.auMoinsUnRatioRenseigné() && entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere.ratioDependanceFinanciereEstIlAutorisé ? <RatioDependanceFinanciere ratioDependanceFinanciereViewModel={entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere} /> : <></>}
      </ul>) : <></>}

      <ul className="indicateurs">
          {!entitéJuridiqueBudgetFinanceViewModel.allocationRessources.vide() && entitéJuridiqueBudgetFinanceViewModel.allocationRessources.estIlAutorisé ? 
          <AllocationRessources allocationRessourcesViewModel={entitéJuridiqueBudgetFinanceViewModel.allocationRessources} /> : <></>}
      </ul>

    </Bloc>
  );
};

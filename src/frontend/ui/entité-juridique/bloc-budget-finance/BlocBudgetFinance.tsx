import { AllocationRessources } from "./allocation-ressources/AllocationRessources";
import styles from "./BlocBudgetFinance.module.css";
import { BesoinFondsDeRoulement } from "./besoin-fonds-de-roulement/BesoinFondsDeRoulement";
import { CompteDeResultat } from "./compte-de-resultat/CompteDeResultat";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";
import { FondsDeRoulement } from "./fonds-de-roulement/FondsDeRoulement";
import { RatioDependanceFinanciere } from "./ratio-dependance-financiere/RatioDependanceFinanciere";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { ResultatNetComptable } from "../../indicateur-métier/resultat-net-comptable/ResultatNetComptable";
import { TauxDeCaf } from "../../indicateur-métier/taux-de-caf/TauxDeCaf";

type BlocBudgetFinanceProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
  type: 'EJ' | 'ET_PNL' | 'ET_Autres'
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;
export const BlocBudgetFinance = ({ etabTitle, etabFiness, entitéJuridiqueBudgetFinanceViewModel, type, opnedBloc, toggelBlocs }: BlocBudgetFinanceProps) => {
  const { wording } = useDependencies();
  const estEntiteJuridiqueOuPnL = type === 'EJ' || type === 'ET_PNL';
  const donneesNonAutorisees = entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasAutorisés(type);
  const donneesNonRenseignees = entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetairePasRenseignee(type);

  if (estEntiteJuridiqueOuPnL && entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetEtFinanceNeSontPasRenseignées && entitéJuridiqueBudgetFinanceViewModel.allocationRessources.vide()) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_BUDGET_ET_FINANCES} toggelBlocs={toggelBlocs} />;
  }

  const renderBlocMessages = () => {
    if (donneesNonAutorisees.length !== 0) {
      return <NotAUthorized indicateurs={donneesNonAutorisees} />;
    }
    if (donneesNonRenseignees.length !== 0) {
      return <NoDataCallout indicateurs={donneesNonRenseignees} />;
    }
    return null;
  };

  const renderBudgetEtFinancesFirstSection = () => {
    if (!estEntiteJuridiqueOuPnL) {
      return null;
    }

    const peutAfficherCompteDeResultat = !entitéJuridiqueBudgetFinanceViewModel.compteDeResultatVide() && entitéJuridiqueBudgetFinanceViewModel.compteDeResultatEstIlAutorisé;
    const peutAfficherResultatNet = entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable.auMoinsUnResultatNetRenseigné() && entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable.resultatNetComptableEstIlAutorisé;
    const peutAfficherTauxDeCaf = entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné && entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel.leTauxDeCafEstIlAutorisé;
    const peutAfficherRatioDependance = entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere.auMoinsUnRatioRenseigné() && entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere.ratioDependanceFinanciereEstIlAutorisé;

    return (
      <ul className={"indicateurs " + styles["budget"]}>
        {peutAfficherCompteDeResultat && (
          <CompteDeResultat
            className={styles["fullWidth"]}
            entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueBudgetFinanceViewModel}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
          />
        )}
        {peutAfficherResultatNet && (
          <ResultatNetComptable
            estEntitéJuridique={true}
            resultatNetComptableViewModel={entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable}
          />
        )}
        {peutAfficherTauxDeCaf && (
          <TauxDeCaf
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            isEntiteJuridique={true}
            tauxDeCafViewModel={entitéJuridiqueBudgetFinanceViewModel.tauxDeCafViewModel}
          />
        )}
        {peutAfficherRatioDependance && (
          <RatioDependanceFinanciere
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            ratioDependanceFinanciereViewModel={entitéJuridiqueBudgetFinanceViewModel.ratioDependanceFinanciere}
          />
        )}
      </ul>
    );
  };

  const renderAllocationRessources = () => {
    if (entitéJuridiqueBudgetFinanceViewModel.allocationRessources.vide() || !entitéJuridiqueBudgetFinanceViewModel.allocationRessources.estIlAutorisé) {
      return null;
    }

    return (
      <ul className="indicateurs">
        <AllocationRessources
          allocationRessourcesViewModel={entitéJuridiqueBudgetFinanceViewModel.allocationRessources}
          etabFiness={etabFiness}
          etabTitle={etabTitle}
        />
      </ul>
    );
  };

  const renderBlocBudgetEtFinancesSecondSection = () => {
    const peutAfficherFondsDeRoulement = entitéJuridiqueBudgetFinanceViewModel.fondsDeRoulement.auMoinsUnFondsDeRoulementRenseigné() && entitéJuridiqueBudgetFinanceViewModel.fondsDeRoulement.fondsDeRoulementEstIlAutorisé;
    const peutAfficherBesoinFondsDeRoulement = entitéJuridiqueBudgetFinanceViewModel.besoinFondsDeRoulement.auMoinsUnBesoinFondsDeRoulementRenseigné() && entitéJuridiqueBudgetFinanceViewModel.besoinFondsDeRoulement.besoinFondsDeRoulementEstIlAutorisé;

    return (
      <ul className={"indicateurs " + styles["budget"]}>
        {peutAfficherFondsDeRoulement && (
          <FondsDeRoulement
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            fondsDeRoulementViewModel={entitéJuridiqueBudgetFinanceViewModel.fondsDeRoulement}
          />
        )}
        {peutAfficherBesoinFondsDeRoulement && (
          <BesoinFondsDeRoulement
            besoinFondsDeRoulementViewModel={entitéJuridiqueBudgetFinanceViewModel.besoinFondsDeRoulement}
            etabFiness={etabFiness}
            etabTitle={etabTitle}
          />
        )}
      </ul>
    );
  }

  return (
    <Bloc opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES} toggelBlocs={toggelBlocs}>
      {renderBlocMessages()}
      {renderBudgetEtFinancesFirstSection()}
      {renderAllocationRessources()}
      {renderBlocBudgetEtFinancesSecondSection()}
    </Bloc>
  );
};

import styles from "./BlocBudgetEtFinancesMédicoSocial.module.css";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { TauxDeCaf } from "../../indicateur-métier/taux-de-caf/TauxDeCaf";
import { ContenuFondDeRoulementNetGlobal } from "../InfoBulle/ContenuFondDeRoulementNetGlobal";
import { ContenuMontantDeLaContributionAuxFraisDeSiège } from "../InfoBulle/ContenuMontantDeLaContributionAuxFraisDeSiège";
import { ContenuRésultatNetComptable } from "../InfoBulle/ContenuRésultatNetComptable";
import { ContenuTauxDeVétustéConstruction } from "../InfoBulle/ContenuTauxDeVétustéConstruction";
import { GraphiqueCompteDeResultat } from "./compte-de-resultat/GraphiqueCompteDeResultat";
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from "./ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel";

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  établissementTerritorialMédicoSocialBudgetEtFinancesViewModel: ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel;
  opnedBloc?: boolean;
  toggelBlocs?: () => void;
}>;

export const BlocBudgetEtFinancesMédicoSocial = ({ etabFiness, etabTitle, établissementTerritorialMédicoSocialBudgetEtFinancesViewModel, opnedBloc, toggelBlocs }: BlocBudgetEtFinancesMédicoSocialProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.lesDonnéesBudgetEtFinancesNeSontPasRenseignées) {
    return <BlocIndicateurVide opnedBloc={opnedBloc} title={wording.TITRE_BLOC_BUDGET_ET_FINANCES} toggelBlocs={toggelBlocs} />;
  }

  return (
    <Bloc isMain={false} opnedBloc={opnedBloc} titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES} toggelBlocs={toggelBlocs}>

      {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.lesDonnéesBudgetairesPasAutorisés.length !== 0 ? <NotAUthorized indicateurs={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.lesDonnéesBudgetairesPasAutorisés} /> :
        établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.lesDonnéesBudgetairesPasRenseignees.length !== 0 ? <NoDataCallout indicateurs={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.lesDonnéesBudgetairesPasRenseignees} /> : <></>}
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leCompteDeRésultatEstIlAutorisé ?
          <GraphiqueCompteDeResultat compteDeRésultatViewModel={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.compteDeResultatViewModel} />
          : <></>
        }

        {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.compteDeResultatViewModel.leCompteDeRésultatEstIlRenseigné && établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leRésultatNetComptableEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuRésultatNetComptable
                dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourRésultatNetComptable}
                source={wording.CNSA}
              />
            }
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourRésultatNetComptable}
            identifiant="budget-et-finances-résultat-net-comptable"
            nomDeLIndicateur={wording.RÉSULTAT_NET_COMPTABLE}
            source={wording.CNSA}
          >
            {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.résultatNetComptable}
          </IndicateurGraphique>
        ) : <></>}

        {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné && établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leMontantDeLaContributionAuxFraisDeSiègeEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuMontantDeLaContributionAuxFraisDeSiège
                dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège}
                source={wording.CNSA}
              />
            }
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège}
            identifiant="budget-et-finances-montant-de-la-contribution"
            nomDeLIndicateur={wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE}
            source={wording.CNSA}
          >
            {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.montantDeLaContributionAuxFraisDeSiège}
          </IndicateurGraphique>
        ) : <></>}

        {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.tauxDeCafViewModel.leTauxDeCafEstIlRenseigné && établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leTauxDeCafEstIlAutorisé ?
          <TauxDeCaf
            etabFiness={etabFiness}
            etabTitle={etabTitle}
            tauxDeCafViewModel={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.tauxDeCafViewModel}
          /> : <></>
        }

        {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leTauxDeVétustéEstIlRenseigné && établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leTauxDeVétustéEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuTauxDeVétustéConstruction
                dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
                source={wording.CNSA}
              />
            }
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
            identifiant="budget-et-finances-taux-de-vétusté-construction"
            nomDeLIndicateur={wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION}
            source={wording.CNSA}
          >
            {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.tauxDeVétustéConstructionHistogramme(etabFiness, etabTitle)}
          </IndicateurGraphique>
        ) : <></>}

        {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leFondsDeRoulementEstIlRenseigné && établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.leFondsDeRoulementEstIlAutorisé ? (
          <IndicateurGraphique
            contenuInfoBulle={
              <ContenuFondDeRoulementNetGlobal
                dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourFondDeRoulementNetGlobal}
                source={wording.CNSA}
              />
            }
            dateDeMiseÀJour={établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.dateMiseÀJourFondDeRoulementNetGlobal}
            identifiant="budget-et-finances-fond-de-roulement-net-global"
            nomDeLIndicateur={wording.FONDS_DE_ROULEMENT_NET_GLOBAL}
            source={wording.CNSA}
          >
            {établissementTerritorialMédicoSocialBudgetEtFinancesViewModel.fondDeRoulementNetGlobal}
          </IndicateurGraphique>
        ) : <></>}
      </ul>
    </Bloc>
  );
};

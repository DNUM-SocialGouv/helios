import { Bloc } from '../../commun/Bloc/Bloc'
import { useDependencies } from '../../commun/contexts/useDependencies'
import { Indicateur } from '../../commun/Indicateur/Indicateur'
import { IndicateurGraphique } from '../../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../../commun/Sources/Sources'
import { ContenuMontantDeLaContributionAuxFraisDeSiège } from '../InfoBulle/ContenuMontantDeLaContributionAuxFraisDeSiège'
import { ContenuRésultatNetComptable } from '../InfoBulle/ContenuRésultatNetComptable'
import { ContenuTauxDeVétustéConstruction } from '../InfoBulle/ContenuTauxDeVétustéConstruction'
import style from './BlocBudgetEtFinancesMédicoSocial.module.css'
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from './ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel'

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialBudgetEtFinancesViewModel: ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel
}>

export const BlocBudgetEtFinancesMédicoSocial = (
  { établissementTerritorialMédicoSocialBudgetEtFinancesViewModel: budgetEtFinancesViewModel }: BlocBudgetEtFinancesMédicoSocialProps
) => {
  const { wording } = useDependencies()

  if (
    !budgetEtFinancesViewModel.desDonnéesBudgetEtFinancesSontRenseignées
  ) {
    return (
      <Bloc titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}>
        {wording.INDICATEURS_VIDES}
      </Bloc>
    )
  }

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}
    >
      <ul className={style['liste-indicateurs']}>
        {
          budgetEtFinancesViewModel.leRésultatNetComptableEstIlRenseigné &&
          <Indicateur
            contenuInfoBulle={<ContenuRésultatNetComptable
              dateDeMiseÀJour={budgetEtFinancesViewModel.dateMiseÀJourRésultatNetComptable}
              source={Sources(wording.DIAMANT, wording.CNSA)}
            />}
            dateDeMiseÀJour={budgetEtFinancesViewModel.dateMiseÀJourRésultatNetComptable}
            identifiant="budget-et-finances-résultat-net-comptable"
            nomDeLIndicateur={wording.RÉSULTAT_NET_COMPTABLE}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          >
            {budgetEtFinancesViewModel.résultatNetComptable}
          </Indicateur>
        }
        {
          budgetEtFinancesViewModel.leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné &&
          <Indicateur
            contenuInfoBulle={<ContenuMontantDeLaContributionAuxFraisDeSiège
              dateDeMiseÀJour={budgetEtFinancesViewModel.dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège}
              source={Sources(wording.DIAMANT, wording.CNSA)}
            />}
            dateDeMiseÀJour={budgetEtFinancesViewModel.dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège}
            identifiant="budget-et-finances-montant-de-la-contribution"
            nomDeLIndicateur={wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          >
            {budgetEtFinancesViewModel.montantDeLaContributionAuxFraisDeSiège}
          </Indicateur>
        }
        <IndicateurGraphique
          contenuInfoBulle={<ContenuTauxDeVétustéConstruction
            dateDeMiseÀJour={budgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          />}
          dateDeMiseÀJour={budgetEtFinancesViewModel.dateMiseÀJourTauxDeVétustéConstruction}
          identifiant="budget-et-finances-taux-de-vétusté-construction"
          nomDeLIndicateur={wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION}
          source={Sources(wording.DIAMANT, wording.CNSA)}
        >
          {budgetEtFinancesViewModel.tauxDeVétustéConstruction}
        </IndicateurGraphique>
      </ul>
    </Bloc>

  )
}

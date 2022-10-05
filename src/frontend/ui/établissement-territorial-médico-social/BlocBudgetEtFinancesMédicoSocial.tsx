import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { Indicateur } from '../commun/Indicateur/Indicateur'
import { Sources } from '../commun/Sources/Sources'
import style from './BlocBudgetEtFinancesMédicoSocial.module.css'
import { ContenuMontantDeLaContributionAuxFraisDeSiège } from './InfoBulle/ContenuMontantDeLaContributionAuxFraisDeSiège'
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from './ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel'

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialBudgetEtFinancesViewModel: ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel
}>

export const BlocBudgetEtFinancesMédicoSocial = (
  { établissementTerritorialMédicoSocialBudgetEtFinancesViewModel: budgetEtFinancesViewModel }: BlocBudgetEtFinancesMédicoSocialProps
) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}
    >
      <ul className={style['liste-indicateurs']}>
        {
          budgetEtFinancesViewModel.leMontantDeLaContributionAuxFraisDeSiègeEstIlRenseigné &&
          <Indicateur
            contenuInfoBulle={<ContenuMontantDeLaContributionAuxFraisDeSiège
              dateDeMiseÀJour={budgetEtFinancesViewModel.dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège}
              source={Sources(wording.DIAMANT, wording.CNSA)}
            />}
            dateDeMiseÀJour={budgetEtFinancesViewModel.dateMiseÀJourMontantDeLaContributionAuxFraisDeSiège}
            identifiant="budget-et-finances-0"
            nomDeLIndicateur={wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          >
            {budgetEtFinancesViewModel.montantDeLaContributionAuxFraisDeSiège}
          </Indicateur>
        }
      </ul>
    </Bloc>

  )
}

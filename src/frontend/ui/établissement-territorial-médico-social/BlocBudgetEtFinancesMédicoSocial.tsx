import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { Indicateur } from '../commun/Indicateur/Indicateur'
import { Sources } from '../commun/Sources/Sources'
import { ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel } from './ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel'

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  établissementTerritorialMédicoSocialBudgetEtFinancesViewModel: ÉtablissementTerritorialBudgetEtFinancesMédicoSocialViewModel
}>

export const BlocBudgetEtFinancesMédicoSocial = ({ établissementTerritorialMédicoSocialBudgetEtFinancesViewModel }: BlocBudgetEtFinancesMédicoSocialProps) => {
  const { wording } = useDependencies()

  return (
    <Bloc
      estCeIdentité={false}
      titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}
    >
      <ul>
        <Indicateur
          contenuInfoBulle={<span />}
          dateDeMiseÀJour=""
          identifiant="budget-et-finances-0"
          nomDeLIndicateur={wording.MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE}
          source={Sources(wording.DIAMANT, wording.CNSA)}
        >
          <p>
            yo
          </p>
        </Indicateur>
      </ul>
    </Bloc>

  )
}

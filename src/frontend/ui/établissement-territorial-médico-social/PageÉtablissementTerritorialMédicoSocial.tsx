import Head from 'next/head'

import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { Titre } from '../commun/Titre/Titre'
import { BlocActivitéMédicoSocial } from './BlocActivitéMédicoSocial'
import { BlocAutorisationEtCapacitéMédicoSocial } from './BlocAutorisationEtCapacitéMédicoSocial'
import { BlocBudgetEtFinancesMédicoSocial } from './BlocBudgetEtFinancesMédicoSocial'
import { BlocIdentitéMédicoSocial } from './BlocIdentitéMédicoSocial'
import LogoÉtablissementTerritorial from './logo-établissement-territorial-médico-social.svg'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type ÉtablissementTerritorialProps = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}>

export const PageÉtablissementTerritorialMédicoSocial = ({ établissementTerritorialViewModel }: ÉtablissementTerritorialProps) => {
  const { paths } = useDependencies()

  useBreadcrumb([
    {
      label: établissementTerritorialViewModel.titreAccessibleDeLEntitéJuridique,
      path: `${paths.ENTITÉ_JURIDIQUE}/${établissementTerritorialViewModel.numéroFinessEntitéJuridiqueBrut}`,
    },
    {
      label: établissementTerritorialViewModel.nomDeLÉtablissementTerritorial,
      path: '',
    },
  ])

  return (
    <main className="fr-container">
      <Head>
        <title>
          {établissementTerritorialViewModel.titre}
        </title>
      </Head>
      <Titre logo={LogoÉtablissementTerritorial}>
        {établissementTerritorialViewModel.titre}
      </Titre>
      <BlocIdentitéMédicoSocial établissementTerritorialMédicoSocialViewModel={établissementTerritorialViewModel} />
      <BlocAutorisationEtCapacitéMédicoSocial établissementTerritorialMédicoSocialViewModel={établissementTerritorialViewModel} />
      <BlocActivitéMédicoSocial établissementTerritorialMédicoSocialViewModel={établissementTerritorialViewModel} />
      <BlocBudgetEtFinancesMédicoSocial
        établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={
          établissementTerritorialViewModel.établissementTerritorialBudgetEtFinancesMédicoSocialViewModel
        }
      />
    </main>
  )
}

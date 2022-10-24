import Head from 'next/head'

import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { Titre } from '../commun/Titre/Titre'
import { BlocActivitéMédicoSocial } from './bloc-activité/BlocActivitéMédicoSocial'
import { BlocAutorisationEtCapacitéMédicoSocial } from './bloc-autorisations/BlocAutorisationEtCapacitéMédicoSocial'
import { BlocBudgetEtFinancesMédicoSocial } from './bloc-budget-et-finances/BlocBudgetEtFinancesMédicoSocial'
import { BlocIdentitéMédicoSocial } from './bloc-identité/BlocIdentitéMédicoSocial'
import { BlocRessourcesHumainesMédicoSocial } from './bloc-ressources-humaines/BlocRessourcesHumainesMédicoSocial'
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
      label: établissementTerritorialViewModel.identitéViewModel.nomDeLÉtablissementTerritorial,
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
      <BlocIdentitéMédicoSocial établissementTerritorialIdentitéMédicoSocialViewModel={établissementTerritorialViewModel.identitéViewModel} />
      <BlocAutorisationEtCapacitéMédicoSocial
        établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialViewModel.autorisationsViewModel}
      />
      <BlocActivitéMédicoSocial établissementTerritorialActivitéMédicoSocialViewModel={établissementTerritorialViewModel.activitésViewModel} />
      <BlocRessourcesHumainesMédicoSocial
        établissementTerritorialMédicoSocialRessourcesHumainesViewModel={établissementTerritorialViewModel.ressourcesHumainesViewModel}
      />
      <BlocBudgetEtFinancesMédicoSocial
        établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={établissementTerritorialViewModel.budgetEtFinancesViewModel}
      />
    </main>
  )
}

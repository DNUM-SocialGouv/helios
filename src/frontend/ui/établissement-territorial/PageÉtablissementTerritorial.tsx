import Head from 'next/head'

import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { Titre } from '../commun/Titre/Titre'
import { BlocIdentitéMédicoSocial } from './BlocIdentitéMédicoSocial'
import LogoÉtablissementTerritorial from './logo-établissement-territorial-médico-social.svg'
import { ÉtablissementTerritorialViewModel } from './ÉtablissementTerritorialViewModel'

type TypeÉtablissementTerritorial = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialViewModel
}>

export const PageÉtablissementTerritorial = ({ établissementTerritorialViewModel }: TypeÉtablissementTerritorial) => {
  useBreadcrumb([
    {
      label: établissementTerritorialViewModel.titreAccessibleDeLEntitéJuridique,
      path: '',
    },
    {
      label: établissementTerritorialViewModel.titreAccessible,
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          {établissementTerritorialViewModel.titre}
        </title>
      </Head>
      <Titre logo={LogoÉtablissementTerritorial}>
        {établissementTerritorialViewModel.titre}
      </Titre>
      <BlocIdentitéMédicoSocial établissementTerritorialViewModel={établissementTerritorialViewModel} />
    </>
  )
}

import Head from 'next/head'

import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { Titre } from '../commun/Titre/Titre'
import { BlocIdentité } from './BlocIdentité'
import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'
import LogoEntitéJuridique from './logo-entité-juridique.svg'

type TypeEntitéJuridique = Readonly<{
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel
}>

export const PageEntitéJuridique = ({ entitéJuridiqueViewModel }: TypeEntitéJuridique) => {
  useBreadcrumb([
    {
      label: entitéJuridiqueViewModel.titreAccessible,
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          {entitéJuridiqueViewModel.titre}
        </title>
      </Head>
      <Titre logo={LogoEntitéJuridique}>
        {entitéJuridiqueViewModel.titre}
      </Titre>
      <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
    </>
  )
}

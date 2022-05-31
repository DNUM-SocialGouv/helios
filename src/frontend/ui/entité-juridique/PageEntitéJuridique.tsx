import Head from 'next/head'

import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { BlocIdentité } from './BlocIdentité'
import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'
import { Titre } from './Titre'

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
      <Titre>
        {entitéJuridiqueViewModel.titre}
      </Titre>
      <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
    </>
  )
}

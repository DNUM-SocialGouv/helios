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
      label: entitéJuridiqueViewModel.titre,
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          {entitéJuridiqueViewModel.titreBrute}
        </title>
      </Head>
      <Titre>
        {entitéJuridiqueViewModel.titreBrute}
      </Titre>
      <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
    </>
  )
}

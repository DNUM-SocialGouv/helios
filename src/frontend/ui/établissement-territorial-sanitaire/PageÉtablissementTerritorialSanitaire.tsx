import Head from 'next/head'

import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { BlocIdentitéSanitaire } from './BlocIdentitéSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type TypeÉtablissementTerritorial = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialSanitaireViewModel
}>

export const PageÉtablissementTerritorialSanitaire = ({ établissementTerritorialViewModel }: TypeÉtablissementTerritorial) => {
  const { wording } = useDependencies()

  useBreadcrumb([
    {
      label: wording.DONNÉES_PERSONNELLES,
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
      <BlocIdentitéSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialViewModel} />
    </>
  )
}

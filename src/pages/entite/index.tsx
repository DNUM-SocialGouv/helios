import Head from 'next/head'

import { useBreadcrumb } from '../../frontend/ui/commun/hooks/useBreadcrumb'
import { EntitéJuridique } from '../../frontend/ui/entite/EntitéJuridique'

export default function PageEntite() {
  useBreadcrumb([
    {
      label: 'Entité Juridique',
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          Entité Juridique
        </title>
      </Head>
      <EntitéJuridique />
    </>
  )
}

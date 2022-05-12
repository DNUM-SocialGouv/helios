import Head from 'next/head'

import { useBreadcrumb } from '../../frontend/ui/commun/hooks/useBreadcrumb'
import { Entité } from '../../frontend/ui/entite/Entité'

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
      <Entité />
    </>
  )
}

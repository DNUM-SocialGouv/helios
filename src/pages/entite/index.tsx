import Head from 'next/head'

import { useBreadcrumb } from '../../frontend/ui/commun/hooks/useBreadcrumb'
import { Entite } from '../../frontend/ui/entite/Entite'

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
      <Entite />
    </>
  )
}

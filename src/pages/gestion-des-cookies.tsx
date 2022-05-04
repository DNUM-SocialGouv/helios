import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useBreadcrumb } from '../frontend/ui/commun/hooks/useBreadcrumb'

export default function GestionDesCookies() {
  const { wording } = useDependencies()
  useBreadcrumb([
    {
      label: wording.GESTION_COOKIES,
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          {wording.TITRE_PAGE_GESTION_COOKIES}
        </title>
      </Head>
      <h1>
        {wording.GESTION_COOKIES}
      </h1>
      <p>
        {wording.EN_CONSTRUCTION}
      </p>
    </>
  )
}

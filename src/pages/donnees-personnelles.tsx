import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useBreadcrumb } from '../frontend/ui/commun/hooks/useBreadcrumb'

export default function DonnéesPersonnelles() {
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
          {wording.TITRE_PAGE_DONNÉES_PERSONNELLES}
        </title>
      </Head>
      <h1>
        {wording.DONNÉES_PERSONNELLES}
      </h1>
      <p>
        {wording.EN_CONSTRUCTION}
      </p>
    </>
  )
}

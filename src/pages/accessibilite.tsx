import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useBreadcrumb } from '../frontend/ui/commun/hooks/useBreadcrumb'

export default function Accessibilité() {
  const { wording } = useDependencies()
  useBreadcrumb([
    {
      label: wording.ACCESSIBILITÉ,
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          {wording.TITRE_PAGE_ACCESSIBILITÉ}
        </title>
      </Head>
      <h1>
        {wording.ACCESSIBILITÉ}
      </h1>
      <p>
        {wording.EN_CONSTRUCTION}
      </p>
    </>
  )
}

import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useBreadcrumb } from '../frontend/ui/commun/hooks/useBreadcrumb'

export default function MentionsLégales() {
  const { wording } = useDependencies()
  useBreadcrumb([
    {
      label: wording.MENTIONS_LÉGALES,
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          {wording.TITRE_PAGE_MENTIONS_LÉGALES}
        </title>
      </Head>
      <h1>
        {wording.MENTIONS_LÉGALES}
      </h1>
      <p>
        {wording.EN_CONSTRUCTION}
      </p>
    </>
  )
}

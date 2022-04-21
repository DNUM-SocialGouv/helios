import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useFileDArianne } from '../frontend/ui/commun/hooks/useFileDArianne'

export default function MentionsLégales() {
  const { wording } = useDependencies()
  useFileDArianne([
    {
      chemin: '',
      label: wording.MENTIONS_LÉGALES,
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

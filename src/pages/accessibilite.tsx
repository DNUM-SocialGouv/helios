import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useFileDArianne } from '../frontend/ui/commun/hooks/useFileDArianne'

export default function Accessibilité() {
  const { wording } = useDependencies()
  useFileDArianne([
    {
      chemin: '',
      label: wording.ACCESSIBILITÉ,
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

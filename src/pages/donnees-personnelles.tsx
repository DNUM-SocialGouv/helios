import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useFilDArianne } from '../frontend/ui/commun/hooks/useFileDArianne'

export default function DonnéesPersonnelles() {
  const { wording } = useDependencies()
  useFilDArianne([
    {
      chemin: '',
      label: wording.DONNÉES_PERSONNELLES,
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

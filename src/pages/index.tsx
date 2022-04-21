import Head from 'next/head'

import { Accueil } from '../frontend/ui/accueil/Accueil'
import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useFileDArianne } from '../frontend/ui/commun/hooks/useFileDArianne'

export default function PageDAccueil() {
  const { wording } = useDependencies()
  useFileDArianne([])

  return (
    <>
      <Head>
        <title>
          {wording.TITRE_PAGE_ACCUEIL}
        </title>
      </Head>
      <Accueil />
    </>
  )
}

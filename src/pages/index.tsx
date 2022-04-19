import Head from 'next/head'

import { Accueil } from '../frontend/ui/accueil/Accueil'
import { useDependencies } from '../frontend/ui/contexts/useDependencies'

export default function PageDAccueil() {

  const { wording } = useDependencies()

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

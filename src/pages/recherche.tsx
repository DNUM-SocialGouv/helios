import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useBreadcrumb } from '../frontend/ui/commun/hooks/useBreadcrumb'
import { Recherche } from '../frontend/ui/home/Recherche'

export default function PageDAccueil() {
  const { wording } = useDependencies()
  useBreadcrumb([])

  return (
    <>
      <Head>
        <title>
          {wording.TITRE_PAGE_ACCUEIL}
        </title>
      </Head>
      <Recherche />
    </>
  )
}

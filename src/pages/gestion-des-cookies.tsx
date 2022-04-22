import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useFilDArianne } from '../frontend/ui/commun/hooks/useFileDArianne'

export default function GestionDesCookies() {
  const { wording } = useDependencies()
  useFilDArianne([
    {
      chemin: '',
      label: wording.GESTION_COOKIES,
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

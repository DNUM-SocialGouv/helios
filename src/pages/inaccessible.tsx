import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'

export default function Inaccessible() {
  const { wording } = useDependencies()

  return (
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_INACCESSIBLE}</title>
      </Head>
      <h1 className="inaccessible">{wording.ACCÈS_REFUSÉ}</h1>
    </main>
  )
}

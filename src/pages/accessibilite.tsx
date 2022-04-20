import Head from 'next/head'

import { useDependencies } from '../frontend/ui/contexts/useDependencies'

export default function PlanDuSite() {
  const { wording } = useDependencies()

  return (
    <>
      <Head>
        <title>
          {wording.TITRE_PAGE_ACCESSIBILITÉ}
        </title>
      </Head>
      <main className="fr-container fr-mt-9w">
        <h1>
          {wording.ACCESSIBILITÉ}
        </h1>
        <p>En construction</p>
      </main>
    </>
  )
}

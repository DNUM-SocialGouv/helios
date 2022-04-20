import Head from 'next/head'

import { useDependencies } from '../frontend/ui/contexts/useDependencies'

export default function PlanDuSite() {
  const { wording } = useDependencies()

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
      <p>En construction</p>
    </>
  )
}

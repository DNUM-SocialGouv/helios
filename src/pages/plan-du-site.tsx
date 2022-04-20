import Head from 'next/head'

import { useDependencies } from '../frontend/ui/contexts/useDependencies'

export default function PlanDuSite() {
  const { wording } = useDependencies()

  return (
    <>
      <Head>
        <title>
          {wording.TITRE_PAGE_PLAN_DU_SITE}
        </title>
      </Head>
      <h1>
        {wording.PLAN_DU_SITE}
      </h1>
      <p>En construction</p>
    </>
  )
}

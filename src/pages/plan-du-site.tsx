import Head from 'next/head'

import { useDependencies } from '../frontend/ui/commun/contexts/useDependencies'
import { useFilDArianne } from '../frontend/ui/commun/hooks/useFileDArianne'

export default function PlanDuSite() {
  const { wording } = useDependencies()
  useFilDArianne([
    {
      chemin: '',
      label: wording.PLAN_DU_SITE,
    },
  ])

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
      <p>
        {wording.EN_CONSTRUCTION}
      </p>
    </>
  )
}

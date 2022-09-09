import Head from 'next/head'

import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { régions } from './régions'

export const PageRégion = ({ région }: { région: string }) => {
  const labelDeLaRégion = régions[région].label
  const { wording } = useDependencies()
  useBreadcrumb([
    {
      label: wording.régionBreadcrumb(labelDeLaRégion),
      path: '',
    },
  ])

  return (
    <main className="fr-container--fluid">
      <Head>
        <title>
          {labelDeLaRégion}
        </title>
      </Head>
      <section>
        <h1 className="fr-container">
          {labelDeLaRégion}
        </h1>
        <iframe
          height="650"
          src={régions[région].source}
          title={wording.régionAtlasSanté(régions[région].label)}
          width="100%"
        />
      </section>
    </main>
  )
}

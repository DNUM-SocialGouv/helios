import Head from 'next/head'

import { useFileDArianne } from '../../frontend/ui/commun/hooks/useFileDArianne'
import { Entite } from '../../frontend/ui/entite/Entite'

export default function PageEntite() {
  useFileDArianne([
    {
      chemin: '',
      label: 'Entité Juridique',
    },
  ])

  return (
    <>
      <Head>
        <title>
          Entité Juridique
        </title>
      </Head>
      <Entite />
    </>
  )
}

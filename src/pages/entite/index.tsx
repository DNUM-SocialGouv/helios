import Head from 'next/head'

import { useFileDArianne } from '../../frontend/ui/commun/hooks/useFileDArianne'
import { Entite } from '../../frontend/ui/entite/Entite'

export default function PageEntite() {
  useFileDArianne([
    {
      chemin: '/',
      label: 'Accueil',
    },
    {
      chemin: '/entite',
      label: 'Entité',
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

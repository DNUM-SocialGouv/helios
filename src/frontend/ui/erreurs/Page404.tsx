import Image from 'next/future/image'
import Head from 'next/head'
import Link from 'next/link'

import { useDependencies } from '../commun/contexts/useDependencies'
import erreur from './erreur.svg'
import styles from './Erreurs.module.css'

export const Page404 = () => {
  const { paths, wording } = useDependencies()

  return (
    <main className="fr-container">
      <Head>
        <title>
          {wording.PAGE_NON_TROUVÉE_404}
        </title>
      </Head>
      <div className="fr-grid-row fr-grid-row--gutters fr-my-16w">
        <div className="fr-col">
          <h1>
            {wording.PAGE_NON_TROUVÉE_404}
          </h1>
          <p className={`fr-text--sm ${styles['sous-titre']}`}>
            {wording.CODE_ERREUR_404}
          </p>
          <p className={`fr-text--xl ${styles['sous-titre']}`}>
            {wording.SOUS_TITRE_ERREUR_404}
          </p>
          <p className={`fr-text--sm ${styles['sous-titre']}`}>
            {wording.DESCRIPTION_ERREUR_404}
          </p>
          <Link
            className="fr-btn"
            href={paths.ACCUEIL}
            passHref
          >
            {wording.ACCUEIL}
          </Link>
        </div>
        <div className="fr-col-5 fr-pl-15w">
          <Image
            alt=""
            height="300"
            src={erreur}
            width="300"
          />
        </div>
      </div>
    </main>
  )
}

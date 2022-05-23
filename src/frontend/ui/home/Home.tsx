import Link from 'next/link'

import { useDependencies } from '../commun/contexts/useDependencies'

export const Home = () => {
  const { paths } = useDependencies()

  return (
    <div className="fr-mt-5w">
      <h1>Accueil</h1>
      <p>Ceci est la page d’accueil de l’application Helios</p>
      <p>
        <Link
          href={paths.ENTITE + '/010008407'}
          passHref
        >
          <a>
            Lien vers CH DU HAUT BUGEY
          </a>
        </Link>
        <br />
        <Link
          href={paths.ENTITE + '/590000741'}
          passHref
        >
          <a>
            Lien vers HOPITAL PRIVE DE VILLENEUVE D’ASCQ
          </a>
        </Link>
      </p>
    </div>
  )
}

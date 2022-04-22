import Link from 'next/link'

import { useDependencies } from '../commun/contexts/useDependencies'

export const Accueil = () => {
  const { paths } = useDependencies()

  return (
    <div className="fr-mt-5w">
      <h1>Accueil</h1>
      <p>Ceci est la page d’accueil de l’application Helios</p>
      <p>
        <Link
          href={paths.ENTITE}
          passHref
        >
          <a>
            Lien vers une entité juridique
          </a>
        </Link>
      </p>
    </div>
  )
}

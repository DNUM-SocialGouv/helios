import Link from 'next/link'

import { Paths } from '../../configuration/Paths'

export const Accueil = () => {
  return (
    <div className="fr-mt-5w">
      <h1>Accueil</h1>
      <p>Ceci est la page d’accueil de l’application Hélios</p>
      <p>
        <Link
          href={Paths.ENTITE}
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

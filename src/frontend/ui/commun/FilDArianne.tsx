import Link from 'next/link'

import '@gouvfr/dsfr/dist/component/breadcrumb/breadcrumb.min.css'
import { useFileDArianne } from './hooks/useFileDArianne'

export const FilDArianne = () => {
  const { filDArianne } = useFileDArianne()

  return (
    <nav
      aria-label="vous êtes ici :"
      className="fr-breadcrumb"
      role="navigation"
    >
      <button
        aria-controls="breadcrumb-1"
        aria-expanded="false"
        className="fr-breadcrumb__button"
      >
        Voir le fil d’Ariane
      </button>
      <div
        className="fr-collapse"
        id="breadcrumb-1"
      >
        <ol className="fr-breadcrumb__list">
          {
            filDArianne.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.chemin}
                  passHref
                >
                  <a
                    aria-current={index === filDArianne.length - 1 ? 'page' : undefined}
                    className="fr-breadcrumb__link"
                  >
                    {item.label}
                  </a>
                </Link>
              </li>
            ))
          }
        </ol>
      </div>
    </nav>
  )
}

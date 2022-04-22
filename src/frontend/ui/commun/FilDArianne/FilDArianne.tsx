import Link from 'next/link'
import '@gouvfr/dsfr/dist/component/breadcrumb/breadcrumb.min.css'

import { useDependencies } from '../contexts/useDependencies'
import { useFilDArianne } from '../hooks/useFileDArianne'

export const FilDArianne = () => {
  const { wording } = useDependencies()
  const { filDArianne } = useFilDArianne([])

  if (filDArianne.length === 0) return null

  const AccueilEtfilDArianne = [
    {
      chemin: '/',
      label: wording.ACCUEIL,
    },
  ].concat(filDArianne)

  return (
    <section className="fr-container">
      <nav
        aria-label={wording.VOUS_ÊTES_ICI}
        className="fr-breadcrumb"
      >
        <button
          aria-controls="breadcrumb-1"
          aria-expanded="false"
          className="fr-breadcrumb__button"
          type="button"
        >
          {wording.VOIR_LE_FIL_D_ARIANE}
        </button>
        <div
          className="fr-collapse"
          id="breadcrumb-1"
        >
          <ol className="fr-breadcrumb__list">
            {
              AccueilEtfilDArianne.map((item, index) => (
                <li key={index}>
                  {
                    item.chemin === '' ? (
                      <a
                        aria-current="page"
                        className="fr-breadcrumb__link"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.chemin}
                        passHref
                      >
                        <a className="fr-breadcrumb__link">
                          {item.label}
                        </a>
                      </Link>
                    )
                  }
                </li>
              ))
            }
          </ol>
        </div>
      </nav>
    </section>
  )
}

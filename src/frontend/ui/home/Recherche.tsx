import { useDependencies } from '../commun/contexts/useDependencies'
import '@gouvfr/dsfr/dist/component/button/button.min.css'
import '@gouvfr/dsfr/dist/component/input/input.min.css'
import '@gouvfr/dsfr/dist/component/search/search.min.css'
import styles from './Recherche.module.css'

import { useState } from 'react'

export const Recherche = () => {
  const { wording } = useDependencies()
  const nombreResultat = 24
  const recherche = 'Centre hospitalier de Saint Brieuc'
  const [resultatReçu, setResultatReçu] = useState(false)

  return (
    <>
      <div className="fr-grid-row fr-grid-row--center">
        <section className={'fr-col-8 ' + styles['formulaire']}>
          <h1>
            {wording.RECHERCHE_TITRE}
          </h1>
          <p>
            {wording.RECHERCHE_DESCRIPTION}
          </p>
          <form
            action="/"
            className="fr-search-bar fr-search-bar--lg"
            id="search-2"
            role="search"
          >
            <label
              className="fr-label"
              htmlFor="search-787-input"
            >
              {wording.RECHERCHE_LABEL}
            </label>
            <input
              className="fr-input"
              id="search-787-input"
              name="search-787-input"
              placeholder={wording.RECHERCHE_PLACEHOLDER}
              type="search"
            />
            <button
              className="fr-btn"
              onClick={(e) => {
                e.stopPropagation();setResultatReçu(true)
              }}
            >
              {wording.RECHERCHE_LABEL}
            </button>
          </form>
        </section>
      </div>
      {resultatReçu &&
          <section>
              <p>
                {wording.RECHERCHE_NOMBRE_RESULTAT(nombreResultat, recherche)}
              </p>
          </section>
      }
    </>
  )
}

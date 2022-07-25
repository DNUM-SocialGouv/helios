import { ChangeEventHandler, MouseEventHandler } from 'react'

import { useDependencies } from '../commun/contexts/useDependencies'
import '@gouvfr/dsfr/dist/component/button/button.min.css'
import '@gouvfr/dsfr/dist/component/input/input.min.css'
import '@gouvfr/dsfr/dist/component/search/search.min.css'
import styles from './Recherche.module.css'

type FormulaireDeRechercheProps = Readonly<{
  lancerLaRecherche: MouseEventHandler<HTMLButtonElement>,
  rechercheOnChange: ChangeEventHandler<HTMLInputElement>,
  terme: string
}>

export const FormulaireDeRecherche = ({
  lancerLaRecherche,
  rechercheOnChange,
  terme,
}: FormulaireDeRechercheProps) => {
  const { wording } = useDependencies()

  return (
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
            onChange={rechercheOnChange}
            placeholder={wording.RECHERCHE_PLACEHOLDER}
            type="search"
            value={terme}
          />
          <button
            className="fr-btn"
            onClick={lancerLaRecherche}
            type="submit"
          >
            {wording.RECHERCHE_LABEL}
          </button>
        </form>
      </section>
    </div>
  )
}

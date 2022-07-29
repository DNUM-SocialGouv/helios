import { ReactChild, useState } from 'react'

import { useDependencies } from '../contexts/useDependencies'
import { InfoBulle } from '../InfoBulle/InfoBulle'
import styles from './IndicateurGraphique.module.css'

import '@gouvfr/dsfr/dist/component/button/button.min.css'

type IndicateurProps = Readonly<{
  contenuInfoBulle: ReactChild
  dateDeMiseÀJour: string
  identifiant: string
  nomDeLIndicateur: ReactChild
  source: ReactChild
  children: ReactChild
}>

export const IndicateurGraphique = (
  { contenuInfoBulle, dateDeMiseÀJour, identifiant, nomDeLIndicateur, source, children }: IndicateurProps
) => {
  const { wording } = useDependencies()
  const [estCeOuvert, setEstCeOuvert] = useState(false)

  let miseÀJour = ''
  let wordingSource = ''

  if (dateDeMiseÀJour !== undefined && source !== undefined) {
    miseÀJour = `${wording.MISE_À_JOUR} : ${dateDeMiseÀJour} - `
    wordingSource = `${wording.SOURCE} : `
  }

  return (
    <li>
      <div>
        <p className="fr-m-0">
          {nomDeLIndicateur}
        </p>
        <div className={styles['mise-à-jour-source']}>
          <p className={`fr-text--xs ${styles['titraille']}`}>
            {miseÀJour}
            {wordingSource}
            {source}
          </p>
          <button
            aria-controls={`nom-info-bulle-${identifiant}`}
            className="fr-btn fr-fi-information-line fr-btn--icon-left fr-btn--tertiary fr-btn--sm"
            data-fr-opened={estCeOuvert}
            onClick={() => setEstCeOuvert(true)}
            type="button"
          >
            {wording.DÉTAILS}
          </button>
        </div>
      </div>
      <div className={styles['graphe']}>
        {children}
      </div>
      <InfoBulle
        contenu={contenuInfoBulle}
        estCeOuvert={estCeOuvert}
        identifiant={identifiant}
        setEstCeOuvert={setEstCeOuvert}
        titre={nomDeLIndicateur}
      />
    </li>
  )
}

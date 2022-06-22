import { ReactChild } from 'react'

import { useDependencies } from '../contexts/useDependencies'
import styles from './IndicateurGraphique.module.css'

type IndicateurProps = Readonly<{
  dateDeMiseÀJour: string;
  nomDeLIndicateur: ReactChild;
  source: ReactChild;
  children: ReactChild;
}>

export const IndicateurGraphique = ({ dateDeMiseÀJour, nomDeLIndicateur, source, children }: IndicateurProps) => {
  const { wording } = useDependencies()

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
        <p className="fr-text--xs">
          {miseÀJour}
          {wordingSource}
          {source}
        </p>
      </div>
      <div className={styles['graphe']}>
        {children}
      </div>
    </li>
  )
}

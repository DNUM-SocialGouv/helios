import { ReactChild } from 'react'

import { useDependencies } from '../contexts/useDependencies'

type IndicateurProps = Readonly<{
  dateDeMiseÀJour?: string;
  nomDeLIndicateur: ReactChild;
  source?: ReactChild;
  valeur: ReactChild;
}>

export const IndicateurIdentité = ({ dateDeMiseÀJour, nomDeLIndicateur, source, valeur }: IndicateurProps) => {
  const { wording } = useDependencies()
  let séparateur = ''
  let miseÀJour = ''
  let wordingSource = ''

  if (dateDeMiseÀJour !== undefined && source !== undefined) {
    séparateur = ' - '
    miseÀJour = `${wording.MISE_À_JOUR} : ${dateDeMiseÀJour} - `
    wordingSource = `${wording.SOURCE} : `
  }

  return (
    <li>
      <p className="fr-m-0">
        {nomDeLIndicateur}
        {séparateur}
        <span className="fr-text--xs">
          {miseÀJour}
          {wordingSource}
          {source}
        </span>
      </p>
      <p className="fr-m-0 fr-text--bold">
        {valeur}
      </p>
    </li>
  )
}

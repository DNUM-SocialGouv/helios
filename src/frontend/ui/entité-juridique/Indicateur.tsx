import { ReactChild } from 'react'

import { useDependencies } from '../commun/contexts/useDependencies'

type IndicateurProps = Readonly<{
  dateDeMiseÀJour?: string;
  label: ReactChild;
  source?: ReactChild;
  valeur: ReactChild;
}>

export const Indicateur = ({ dateDeMiseÀJour, label, source, valeur }: IndicateurProps) => {
  const { wording } = useDependencies()
  let séparateur = ''
  let miseÀJourEtSource = ''

  if (dateDeMiseÀJour !== undefined && source !== undefined) {
    séparateur = ' - '
    miseÀJourEtSource = `${wording.MISE_À_JOUR} : ${dateDeMiseÀJour} - ${wording.SOURCE} : `
  }

  return (
    <li>
      <p className="fr-m-0">
        {label}
        {séparateur}
        <span className="fr-text--xs">
          {miseÀJourEtSource}
          {source}
        </span>
      </p>
      <p className="fr-m-0 fr-text--bold">
        {valeur}
      </p>
    </li>
  )
}

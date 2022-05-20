import { ReactChild } from 'react'

import { useDependencies } from '../commun/contexts/useDependencies'

type IndicateurProps = Readonly<{
  dateDeMiseÀJour?: string;
  label: ReactChild;
  source?: ReactChild;
  valeur: string;
}>

export const Indicateur = ({ dateDeMiseÀJour, label, source, valeur }: IndicateurProps) => {
  const { wording } = useDependencies()
  let séparateur = ''
  let miseÀJourEtSource = ''
  let miseÀJour: ReactChild = <></>
  if (dateDeMiseÀJour !== undefined && source !== undefined) {
    séparateur = ' - '
    miseÀJourEtSource = ` : ${dateDeMiseÀJour} - ${wording.SOURCE} : ${source}`
    miseÀJour = wording.MISE_À_JOUR
  }
  return (
    <li>
      <p className="fr-m-0">
        {label}
        {séparateur}
        <span className="fr-text--xs">
          {miseÀJour}
          {miseÀJourEtSource}
        </span>
      </p>
      <p className="fr-m-0 fr-text--bold">
        {valeur}
      </p>
    </li>
  )
}

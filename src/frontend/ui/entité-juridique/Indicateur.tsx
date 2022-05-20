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
  let labelEtSéparateur = label
  let miseÀJourEtSource = ''
  let miseÀJour: ReactChild = <></>
  if (dateDeMiseÀJour !== undefined && source !== undefined) {
    labelEtSéparateur += ' - '
    miseÀJourEtSource = ` : ${dateDeMiseÀJour} - ${wording.SOURCE} : ${source}`
    miseÀJour = wording.MISE_À_JOUR
  }
  return (
    <div>
      <p className="fr-m-0">
        {labelEtSéparateur}
        <span className="fr-text--xs">
          {miseÀJour}
          {miseÀJourEtSource}
        </span>
      </p>
      <p className="fr-m-0 fr-text--bold">
        {valeur}
      </p>
    </div>
  )
}

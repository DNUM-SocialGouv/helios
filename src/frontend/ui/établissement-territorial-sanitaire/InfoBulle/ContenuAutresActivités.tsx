import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuAutresActivitésProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuAutresActivités = ({ dateDeMiseÀJour, source }: ContenuAutresActivitésProps) => {
  const { wording } = useDependencies()
  return (
    <>
      <p>
        Mise à jour :
        {' '}
        {dateDeMiseÀJour}
        {' '}
        - Source :
        {' '}
        {source}
      </p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p></p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p></p>
      </section>
    </>
  )
}

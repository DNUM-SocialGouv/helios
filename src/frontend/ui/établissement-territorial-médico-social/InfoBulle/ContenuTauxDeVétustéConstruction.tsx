import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuTauxDeVétustéConstructionProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuTauxDeVétustéConstruction = ({ dateDeMiseÀJour, source }: ContenuTauxDeVétustéConstructionProps) => {
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
        <p>
          Cet indicateur permet d’estimer le degré d’amortissement des constructions sur la base des éléments comptables.
          Plus le taux est élevé, plus les constructions sont amorties.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
          Amortissements des constructions / Immobilisations corporelles brutes construction
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Caisse nationale de solidarité pour l’autonomie (CNSA)
        </p>
        <ul>
          <li>
            ERRD annexe 8 (feuilles « CRP SOUMIS EQUILIBRE », « CRP NON SOUMIS EQUIL » et « CRA »)
          </li>
          <li>
            CA (feuille « ANNEXE 8 »)
          </li>
        </ul>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT
          qui est un système décisionnel national permettant de stocker des informations provenant de plusieurs sources.
          DIAMANT : Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation.
          {' '}
        </p>
      </section>
    </>
  )
}

import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuMontantDeLaContributionAuxFraisDeSiègeProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuMontantDeLaContributionAuxFraisDeSiège = ({ dateDeMiseÀJour, source }: ContenuMontantDeLaContributionAuxFraisDeSiègeProps) => {
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
          Montant que reverse l’établissement à son siège pour les frais de siège et/ou de groupement.
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
        </p>
        Le compte 655
        {' '}
        <i>Quote-parts de résultat sur opérations faites en commun</i>
        {' '}
        enregistre à son débit :
        <ul>
          <li>
            6556 - Frais de siège social du gestionnaire
          </li>
          <li>
            6558 - Quotes-parts de résultat sur opérations faites dans le cadre d’un groupement
          </li>
        </ul>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Caisse nationale de solidarité pour l’autonomie (CNSA)
          • ERRD annexe 8 (feuilles « CRP SOUMIS EQUILIBRE », « CRP NON SOUMIS EQUIL » et « CRA »)
          • ERRD annexe 10 (feuilles « CRP NON SOUMIS EQUIL » et « CRA »)
          • ERRD annexe 11 (feuille « CRA  »)

          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT
          qui est un système décisionnel national permettant de stocker des informations provenant de plusieurs sources.
          DIAMANT : Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation.
          {' '}
        </p>
      </section>
    </>
  )
}

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
          Le montant de la contribution aux frais de siège et/ou de groupement correspond aux charges du compte 655
          « Quotes-parts de résultat sur opérations faites en commun » qui enregistre à son débit :
          <br />
          6556 - Frais de siège social du gestionnaire
          <br />
          6558 - Quotes-parts de résultat sur opérations faites dans le cadre d’un groupement
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
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
            ERRD annexe 10 (feuilles « CRP NON SOUMIS EQUIL » et « CRA »)
          </li>
          <li>
            ERRD annexe 11 (feuille « CRA  »)
          </li>
        </ul>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. »,
          outil décisionnel de pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  )
}

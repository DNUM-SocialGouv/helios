import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuRésultatNetComptableProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuRésultatNetComptable = ({ dateDeMiseÀJour, source }: ContenuRésultatNetComptableProps) => {
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
          Le résultat de l’exercice consiste en la différence entre les recettes/produits et
          les dépenses/charges comptabilisés au cours de l’exercice toutes activités confondues.
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
          Amortissements des constructions / Immobilisations corporelles brutes construction.
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
            ERRD annexe 10 (feuilles « CRP NON SOUMIS EQUIL » et « CRA »)
          </li>
          <li>
            ERRD annexe 11 (feuille « CRA »)
          </li>
          <li>
            CA PH (feuilles « Charges expl. » et « Produits expl. »)
          </li>
          <li>
            CA PA (feuille « Charges-Produits »)
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

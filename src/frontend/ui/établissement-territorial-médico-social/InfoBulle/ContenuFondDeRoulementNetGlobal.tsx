import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuFondDeRoulementNetGlobalProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuFondDeRoulementNetGlobal = ({ dateDeMiseÀJour, source }: ContenuFondDeRoulementNetGlobalProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>
        {wording.miseÀJourEtSource(dateDeMiseÀJour, source)}
      </p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Le fonds de roulement représente les ressources dont dispose l’ESMS pour financier son cycle d’exploitation et son cycle d’investissement.
          Si cet agrégat est positif, cela signifie que l’ESMS dégage des ressources disponibles pour financer d’éventuels besoins liés au court ou moyen terme.
          A l’inverse, un fonds de roulement négatif traduit généralement une situation de déficit financier.
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
          <br />
          Montant du fonds de roulement (FRNG) : écart entre les capitaux permanents et les actifs immobilisés, soit la soustraction entre :
        </p>
        <ul>
          <li>
            La somme des comptes débiteurs de classes 1 et 2
          </li>
          <li>
            La somme des comptes créditeurs de classe 1 et 2, ainsi que les comptes créditeurs 39, 49 et 59
          </li>
        </ul>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Caisse nationale de solidarité pour l’autonomie (CNSA)
        </p>
        <ul>
          <li>
            ERRD annexe 8 (feuille « Ratios financiers »)
          </li>
        </ul>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation »,
          outil décisionnel de pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  )
}

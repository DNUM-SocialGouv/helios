import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuDuNombreDEtpRéaliséProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuDuNombreDEtpRéalisé = ({ dateDeMiseÀJour, source }: ContenuDuNombreDEtpRéaliséProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Le nombre total d’équivalent temps plein (ETP) réalisé, quelle que soit la catégorie de l’établissement (EHPAD, FAM-SAMSAH, autres etc.).
          <br />
          Un ETP est une unité de mesure proportionnelle au nombre d’heures travaillées par un salarié sur un an.
          <br />
          Exemple : 1 salarié à mi-temps sur 12 mois = 0,5 ETP. L’équivalent temps plein (ETP) est calculé à partir de la durée mensuelle légale de travail,
          égale à 151,67 heures.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Annuelle
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Caisse nationale de solidarité pour l’autonomie (CNSA)
        </p>
        <ul>
          <li>ERRD annexe 9h_j Tableau des effectifs et des rémunérations</li>
          <li>CA PA (feuille « Effectifs »)</li>
          <li>CA PH (feuilles « Tableau des effectifs »)</li>
        </ul>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de
          pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  )
}

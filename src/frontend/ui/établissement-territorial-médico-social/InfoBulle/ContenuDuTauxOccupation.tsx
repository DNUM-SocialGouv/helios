import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuDuTauxOccupationProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuDuTauxOccupation = ({ dateDeMiseÀJour, source }: ContenuDuTauxOccupationProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          C’est une donnée qui mesure l’activité réalisée au regard de la capacité totale de l’établissement. Il permet de mettre en lumière le niveau de
          fréquentation des places existantes et de souligner la pression de la demande.
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
          Calculé en divisant le nombre de journées réalisées dans l’année par l’établissement ou le service + les journées d’absence de moins de 72 heures pour
          convenance personnelle ou hospitalisation par le nombre de journées théoriques correspondant à la capacité autorisée et financée multiplié par le
          nombre de journées d’ouverture de l’établissement ou du service (capacité × nombre de jours d’ouverture annuel).
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
        </p>
        <ul>
          <li>ERRD annexe 9a-9d (feuilles « EHPAD-PUV-AJ-HT »)</li>
        </ul>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Les ERRD (État Réalisé des Recettes et des Dépenses) et les CA (Compte Administratif), qu’ils soient dédiés PA ou PH, présentent une synthèse de
          l’activité de l’établissement (nombre de journées, nombre de bénéficiaires, taux d’occupation etc.).
        </p>
      </section>
    </>
  )
}

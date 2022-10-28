import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuDuTauxDEtpVacantsProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuDuTauxDEtpVacants = ({ dateDeMiseÀJour, source }: ContenuDuTauxDEtpVacantsProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>
        {wording.miseÀJourEtSource(dateDeMiseÀJour, source)}
      </p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Les postes vacants font référence aux postes non pourvus et aux postes pourvus grâce à une prestation externe, libérale ou conventionnelle.
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
          Les postes sont considérés comme vacants dès lors que l’absence est supérieure à 6 mois.
          Le nombre d’ETP vacants est à comprendre comme la différence entre les ETP budgétés et les ETP réalisés.
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Tableau de bord de la performance dans le secteur médico-social - Agence technique de l’information sur l’hospitalisation (ATIH)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Les ERRD (État Réalisé des Recettes et des Dépenses) et les CA (Compte Administratif), qu’ils soient dédiés PA ou PH,
          présentent une synthèse de l’activité de l’établissement (nombre de journées, nombre de bénéficiaires, taux d’occupation etc.).
        </p>
      </section>
    </>
  )
}

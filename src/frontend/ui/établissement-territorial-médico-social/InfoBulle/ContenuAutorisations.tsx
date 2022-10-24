import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuAutorisationsProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuAutorisations = ({ dateDeMiseÀJour, source }: ContenuAutorisationsProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>
        {wording.miseÀJourEtSource(dateDeMiseÀJour, source)}
      </p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Les établissements sont caractérisés dans FINESS par les activités, ou disciplines, qu’ils sont autorisés à exercer.
          Ces informations sont la traduction d’une réglementation et de la possibilité de pluridisciplinarité des établissements.
          Dans le domaine social et médico-social, les autorisations sont enregistrées directement au niveau des établissements.
          Pour indiquer les services offerts, FINESS identifie ceux-ci à l’aide d’un triplet composé des éléments suivants : Discipline/Fonctionnement/Clientèle
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Hebdomadaire
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Fichier National des Établissements Sanitaires et Sociaux (FINESS) - Agence du Numérique en Santé (ANS)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          FINESS constitue la référence en matière d’inventaire des structures et équipements des domaines sanitaire,
          médico-social, social et de formation aux professions de ces secteurs.

          Les données de ce répertoire sont actualisées de façon continue par des agents en service dans les agences régionales de santé
          et dans les services déconcentrés de l’État.
        </p>
      </section>
    </>
  )
}

import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuCapacitéParActivitésProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuCapacitéParActivités = ({ dateDeMiseÀJour, source }: ContenuCapacitéParActivitésProps) => {
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
          Permet de caractériser les capacités d’accueil de l’établissement et les alternatives à l’hospitalisation conventionnelle avec nuitée dont il dispose.
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
          Le nombre de places installées au 31 décembre de l’année est égal au nombre de patients pouvant être accueillis en même temps.
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Statistique annuelle des établissements de santé (SAE) - Direction de la Recherche, des Études, de l’Évaluation et des Statistiques (DREES).
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          La Statistique annuelle des établissements de santé (SAE) est une enquête administrative exhaustive obligatoire, réalisée chaque année par la DREES
          auprès de tous les établissements de santé de France, pour recueillir des informations sur leur activité, leurs capacités, leurs équipements,
          et leurs personnel médicaux et non-médicaux.
        </p>
      </section>
    </>
  )
}

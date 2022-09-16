import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuNombreDePassagesAuxUrgencesProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuNombreDePassagesAuxUrgences =
  ({ dateDeMiseÀJour, source }: ContenuNombreDePassagesAuxUrgencesProps) => {
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
            Un résumé de passages aux urgences (RPU) est un recueil standardisé de données médico-administratives pour chaque passage aux urgences.
            La transmission des RPU par les établissements de santé publics ou privés ayant une activité de médecine d’urgence a été rendue obligatoire
            par arrêté du 24 juillet 2013 dans un objectif de veille et de sécurité sanitaire mais également d’amélioration des connaissances de
            l’activité des services d’urgences.
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
          <p>
            Nombre de RPU transmis dans l’année par l’établissement à l’ATIH.
            Sont supprimés les RPU dont la durée de passage est négative, nulle ou supérieure à 72H.
          </p>
        </section>
        <section aria-label={wording.SOURCES}>
          <p>
            <span className="fr-text--bold">Source(s) : </span>
          </p>
          <ul>
            <li>Urgences - fichiers RPU (Résumé de passage aux urgences) - Agence technique de l’information sur l’hospitalisation (ATIH)</li>
          </ul>
        </section>
        <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        </section>
      </>
    )
  }

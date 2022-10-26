import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuDesTauxDAbsentéismesProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuDesTauxDAbsentéismes = ({ dateDeMiseÀJour, source }: ContenuDesTauxDAbsentéismesProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>
        {wording.miseÀJourEtSource(dateDeMiseÀJour, source)}
      </p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Cet indicateur permet d’estimer l’absentéisme au global et pour les motifs suivants :
        </p>
        <ul>
          <li>arrêts maladie</li>
          <li>AT-MP</li>
          <li>maternité</li>
          <li>congés spéciaux (hors congés payés)</li>
        </ul>
        <p>au sein des effectifs.</p>
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
          Numérateur :
          Somme des nombres de jours calendaires d’absence par motif :
        </p>
        <ul>
          <li>maladie ordinaire / de courte durée</li>
          <li>maladie longue durée</li>
          <li>maladie moyenne durée</li>
          <li>maternité / paternité</li>
          <li>accident du travail / maladie professionnelle</li>
          <li>congés spéciaux dont les congés sans solde (hors congés payés)</li>
        </ul>
        <p>
          Dénominateur :
          Nombre d’ETP réels x 365
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
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. »,
          outil décisionnel de pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  )
}

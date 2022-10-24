import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuReconnaissancesContractuellesProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuReconnaissancesContractuelles = ({ dateDeMiseÀJour, source }: ContenuReconnaissancesContractuellesProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>
        {wording.miseÀJourEtSource(dateDeMiseÀJour, source)}
      </p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Seules les autorisations non caduques sont transmises à FINESS par ARHGOS et sont donc publiées.
          Hormis les autorisations en attente de première mise en œuvre, toutes les autorisations publiées peuvent donc être considérées comme actives.
          Dans le domaine sanitaire les autorisations sont données à une entité juridique puis mises en oeuvre dans un établissement.
          Pour indiquer les services offerts, FINESS identifie ceux-ci à l’aide d’un triplet composé des éléments suivants : Activité/Modalité/Forme.

          Une activité soumise à reconnaissance contractuelle est une activité non soumise à autorisation du DG ARS mais soumise à
          reconnaissance contractuelle dans le cadre et la durée du CPOM (contrat pluriannuel d’objectif et de moyens).
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
          Agence Régionale Hospitalière Gestion des Objectifs Sanitaire (ARHGOS) - Fichier National des Établissements Sanitaires et Sociaux (FINESS)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Ces données prennent leur source dans le SI agence régionale hospitalière gestion des objectifs sanitaire (ARHGOS) et sont reprises
          dans le fichier national des établissements sanitaires et sociaux (FINESS).
          ARHGOS est l’outil de gestion des autorisations des activités de soins et des équipements matériels lourds (EML)
          pour les établissements sanitaires, ainsi que des activités soumises à reconnaissance contractuelle et
          des autres activités (pharmacies à usage intérieur, chirurgie esthétique, prélèvements de cellules, tissus et organes…).
        </p>
      </section>
    </>
  )
}

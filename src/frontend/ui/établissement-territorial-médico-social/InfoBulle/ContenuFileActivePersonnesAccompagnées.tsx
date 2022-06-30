import { ReactChild } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuFileActivePersonnesAccompagnéesProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuFileActivePersonnesAccompagnées = ({ dateDeMiseÀJour, source }: ContenuFileActivePersonnesAccompagnéesProps) => {
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
          A la différence du nombre de places autorisé pour la structure, la file active permet d’identifier le nombre de personnes vues pendant
          l’année écoulée. L’appellation « personne accompagnée » est le terme actuellement retenu dans les politique sociales et médico-sociales.
          Cette terminologie présente l’avantage de ne pas être stigmatisante et spécialisée (le terme d’accompagnement peut convenir pour un
          enfant d’ITEP ou un adulte de SESSAD ou une personne âgée vivant en établissement ou à domicile).
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
          Nombre de personnes accompagnées dans l’effectif au 31/12 + Nombre de sorties définitives dans l’année
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
          Conçu par l’Agence nationale d’appui à la performance des établissements de santé et médico-sociaux (ANAP) en étroite collaboration
          avec les représentants du secteur et mis en œuvre par l’ATIH à la demande conjointe du Ministère des solidarités et de la santé
          et de la Caisse nationale de solidarité pour l’autonomie (CNSA), le Tableau de bord de la performance est devenu un outil
          de référence pour l’ensemble des acteurs du secteur médico-social.
        </p>
      </section>
    </>
  )
}

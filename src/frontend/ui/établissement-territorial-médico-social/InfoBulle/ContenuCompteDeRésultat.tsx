import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuCompteDeRésultatProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuCompteDeRésultat = ({ dateDeMiseÀJour, source }: ContenuCompteDeRésultatProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          L’Etat Réalisé des Recettes et des Dépenses (ERRD) remplace le Compte Administratif (CA) pour les ESMS qui sont passés sous le régime de l’Etat
          Prévisionnel des Recettes et des Dépenses (EPRD). L’article 58 de la loi d’adaptation de la société au vieillissement complété par les lois de
          financement de la sécurité sociale créent les conditions d’un pilotage par les ressources (et non plus par les dépenses) avec l’introduction de l’EPRD
          qui se caractérise par une inversion de la logique antérieure : la prévision des produits détermine dorénavant celle des charges.
          <br />
          GROUPE I : PRODUITS DE LA TARIFICATION
          <br />
          GROUPE II : AUTRES PRODUITS RELATIF A L’EXPLOITATION
          <br />
          GROUPE III : PRODUITS FINANCIERS, PRODUITS EXCEPTIONNELS ET PRODUITS NON ENCAISSABLES
          <br />
          GROUPE I : CHARGES AFFERENTES A L’EXPOITATION COURANTTE
          <br />
          GROUPE II : CHARGES AFFERENTES AU PERSONNEL
          <br />
          GROUPE III : CHARGES AFFERENTES A LA STRUCTURE
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}></section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Caisse nationale de solidarité pour l’autonomie (CNSA)
        </p>
        <ul>
          <li>ERRD annexe 8 (feuilles « CRP SOUMIS EQUILIBRE », « CRP NON SOUMIS EQUIL » et « CRA ») </li>
          <li>ERRD annexe 10 (feuilles « CRP NON SOUMIS EQUIL » et « CRA »)</li>
          <li>ERRD annexe 11 (feuille « CRA »)</li>
          <li>CA PH (feuilles « Charges expl. » et « Produits expl. »)</li>
          <li>CA PA (feuille « Charges-Produits »)</li>
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

import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuDePrestationsExternesProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuDePrestationsExternes = ({ dateDeMiseÀJour, source }: ContenuDePrestationsExternesProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>
        {wording.miseÀJourEtSource(dateDeMiseÀJour, source)}
      </p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Cet indicateur permet d’estimer l’importance financière de l’externalisation de prestations directes. Il vient compléter les indicateurs RH internes
          pour donner une vision plus large des ressources mobilisées pour mettre en œuvre une mission.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <span className="fr-text--bold">Mode de calcul : </span>
        <p>
          Numérateur : Somme des comptes (en €) :
        </p>
        <ul>
          <li>6111 « Prestations à caractère médical » (M22) / « Sous-traitance à caractère médical » (M21) </li>
          <li>6112 « Prestations à caractère médico-social » (M22) / « Sous-traitance à caractère médico-social » (M21) </li>
          <li>
            621 « Personnel extérieur à l’établissement » en lien avec des prestations directes (hors 62111 « Personnel administratif et hôtelier » et autres
            personnels sans lien avec des prestations directes) (M21 et M22)
            {' '}
          </li>
          <li>6223 « Intervenants médicaux (consultants exceptionnels) » (M21 et M22) </li>
          <li>6226 « Honoraires » en lien avec des prestations directes (M21 et M22) </li>
        </ul>
        <p>
          Dénominateur :
          <br />
          Total des dépenses de personnel (groupe 2 de dépenses ou du titre I) (en €)
          <br />
          + montant du compte 6111 « Prestations à caractère médical» (M22) / « Sous-traitance à caractère médical » (M21)
          <br />
          + montant du compte 6112 « Prestations à caractère médico-social »(M22) / « Sous-traitance à caractère médico-social» (M21)
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
          Les ERRD (État Réalisé des Recettes et des Dépenses) et les CA (Compte Administratif), qu’ils soient dédiés PA ou PH, présentent une synthèse de
          l’activité de l’établissement (nombre de journées, nombre de bénéficiaires, taux d’occupation etc.).
        </p>
      </section>
    </>
  )
}

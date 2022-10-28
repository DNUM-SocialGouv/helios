import { ReactElement } from 'react'

import { useDependencies } from '../../commun/contexts/useDependencies'

type ContenuDuNombreDeCddDeRemplacementProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuDuNombreDeCddDeRemplacement = ({ dateDeMiseÀJour, source }: ContenuDuNombreDeCddDeRemplacementProps) => {
  const { wording } = useDependencies()

  return (
    <>
      <p>
        {wording.miseÀJourEtSource(dateDeMiseÀJour, source)}
      </p>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          La donnée renseignée est obligatoirement un nombre entier car elle concerne le nombre de contrats de remplacements signés dans l’année.

          Le Code du travail définit les motifs autorisés de recours aux CDD.

          Les ESMS doivent indiquer dans le TdB MS le nombre de CDD de remplacement d’un salarié du fait :
        </p>
        <ul>
          <li>d’absence ;</li>
          <li>de passage provisoire à temps partiel, conclu par avenant à son contrat de travail ou par échange écrit entre ce salarié et son employeur ;</li>
          <li>de suspension de son contrat de travail ;</li>
          <li>
            de départ définitif précédant la suppression de son poste de travail après consultation du comité d’entreprise ou, à défaut,
            des délégués du personnel, s’il en existe ;
          </li>
          <li>d’attente de l’entrée en service effective du salarié recruté par contrat à durée indéterminée appelé à le remplacer.</li>
        </ul>
        <p>
          Le recours à des CDD de remplacement pour augmentation temporaire d’activité et saisonnalité ne sont pas à saisir dans
          le Tableau de bord de la performance médico-sociale car juridiquement non applicable dans le secteur médico-social.
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

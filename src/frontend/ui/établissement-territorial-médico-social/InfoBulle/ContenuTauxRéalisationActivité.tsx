import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuDuTauxDeRéalisationDeLActivitéProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuTauxRéalisationActivité = ({ dateDeMiseÀJour, source }: ContenuDuTauxDeRéalisationDeLActivitéProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>Permet de mesurer le niveau d’activité de la structure.</p>
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
        <ul>
          <li>
            Numérateur : Nombre de journées réalisées, y compris hébergement temporaire, accueil de jour et quel que soit le mode d’accompagnement (internat,
            semi-internat, etc.)
          </li>
          <li>Dénominateur : Nombre de journées financées (y compris hébergement temporaire, accueil de jour et quel que soit le mode d’accompagnement).</li>
        </ul>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          Tableau de bord de la performance dans le secteur médico-social - Agence technique de l’information sur l’hospitalisation (ATIH)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Conçu par l’Agence nationale d’appui à la performance des établissements de santé et médico-sociaux (ANAP) en étroite collaboration avec les
          représentants du secteur et mis en œuvre par l’ATIH à la demande conjointe du Ministère des solidarités et de la santé et de la Caisse nationale de
          solidarité pour l’autonomie (CNSA), le Tableau de bord de la performance est devenu un outil de référence pour l’ensemble des acteurs du secteur
          médico-social.
        </p>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de
          pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
};

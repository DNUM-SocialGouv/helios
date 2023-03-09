import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuCompteDeRésultatEJProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuCompteDeRésultatEJ = ({ dateDeMiseÀJour, source }: ContenuCompteDeRésultatEJProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Le plan comptable officiel des établissements publics de santé (EPS) et des établissements de santé privé d’intérêt collectif (ESPIC), dénommé M21,
          met à la disposition des gestionnaires un système commun de classification de budget qui permet ainsi d’affecter des dépenses à un budget défini.
          <br /> Le budget des hôpitaux publics s’organise dans le cadre d’un budget principal (activité hospitalière ou budget H) et, en fonction des activités
          assurées par les établissements, un ou plusieurs budgets annexes.
          <br />
          <br />
          Budget principal (Hospitalier) : il présente les opérations financières correspondant à l’activité sanitaire hors soins de longue durée des
          établissements de santé, couvrant le court et moyen séjour, l’hospitalisation à domicile et la psychiatrie.
          <br />
          <br />
          Budget annexe : distinct du budget principal, il présente les opérations financières relatives aux activités de soins de longue durée ou aux activités
          non sanitaires des hôpitaux publics, notamment des établissements d’hébergement pour personnes âgées dépendantes (Ehpad), des instituts de formation,
          des services de soins infirmiers à domicile (SSIAD), …
          <br />
          <br />
          Budget global : ensemble des budgets (budget principal et budgets annexes) du secteur public, consolidés des flux internes entre les différentes
          unités.
        </p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence : </span>
          Quotidienne
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) : </span>
          ANCRE (Application Nationale Compte financier Rapport infra-annuel Eprd) - Agence technique de l’information sur l’hospitalisation (ATIH)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de
          pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.
        </p>
      </section>
    </>
  );
};

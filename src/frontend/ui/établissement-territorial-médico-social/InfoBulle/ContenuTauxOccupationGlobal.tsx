import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuDuTauxOccupationGlobalProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuTauxOccupationGlobal = ({ dateDeMiseÀJour, source }: ContenuDuTauxOccupationGlobalProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>Le taux d’occupation est un indicateur permettant d’évaluer l’utilisation réelle des places disponibles dans un Établissement ou Service Médico-Social (ESMS).
          Il est couramment utilisé pour mesurer l’adéquation entre l’offre et la demande dans ces structures.</p>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span> Annuelle
        </p>
      </section>
      <section aria-label={wording.MODE_DE_CALCUL}>
        <p>
          <span className="fr-text--bold">Mode de calcul : </span>
        </p>
        <p>
          Calculé en divisant le nombre de journées réalisées sur les modalités Externat, semi internat, Internat, Séances, Autre1, Autre2 et Autre3
          (c’est-à-dire le nombre total de journées d’accompagnement effectuées par les bénéficiaires)
          et le nombre de journées théoriques sur les modalités Externat, semi internat, Internat, Séances, Autre1, Autre2 et Autre3
          (c’est-à-dire la capacité maximale théorique de l’ESMS sur une période, en fonction de son autorisation de places et de sa durée de fonctionnement).
        </p>
        <p>
          Si les données journées réalisées et/ou journées théoriques sont manquantes pour l&apos;établissement consulté alors le taux d’occupation global n’est pas calculé.
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span> ERRD Annexe 9a-9d (feuilles Activité Autres ESMS)
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
        <p>
          Les ERRD (État Réalisé des Recettes et des Dépenses) et les CA (Compte Administratif), qu’ils soient dédiés PA ou PH,
          présentent une synthèse de l’activité de l’établissement (nombre de journées, nombre de bénéficiaires, taux d’occupation etc.)
        </p>
        <p>
          Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. »,
          outil décisionnel de pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.”
        </p>
      </section>
    </>
  );
};

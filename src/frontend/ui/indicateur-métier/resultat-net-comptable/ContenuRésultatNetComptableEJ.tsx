import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuRésultatNetComptableProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuRésultatNetComptableEJ = ({ dateDeMiseÀJour, source }: ContenuRésultatNetComptableProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        <p>
          Le résultat de l’exercice consiste en la différence entre les recettes/produits et les dépenses/charges comptabilisés au cours de l’exercice toutes
          activités confondues.
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

import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuCertificationHASProps = Readonly<{
  source: ReactElement;
}>;

export const ContenuCertificationHAS = ({ source }: ContenuCertificationHASProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
        Qualiscope vous permet de consulter les résultats de l’évaluation des établissements de santé,
        ou ceux des établissements et services sociaux et médico-sociaux. Ces deux types d’évaluation sont
        réalisés selon des méthodes différentes, mais partagent un même objectif : informer les usagers et
        les professionnels sur la qualité des soins et des accompagnements.
      </section>
    </>
  );
};

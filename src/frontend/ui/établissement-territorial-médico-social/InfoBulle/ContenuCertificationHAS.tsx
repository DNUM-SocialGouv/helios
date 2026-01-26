import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuCertificationHASProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuCertificationHAS = ({ dateDeMiseÀJour, source }: ContenuCertificationHASProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
      <section aria-label={wording.ÉLÉMENTS_DE_COMPRÉHENSION}>
      </section>
      <section aria-label={wording.FRÉQUENCE}>
        <p>
          <span className="fr-text--bold">Fréquence :</span>
        </p>
      </section>
      <section aria-label={wording.SOURCES}>
        <p>
          <span className="fr-text--bold">Source(s) :</span>
        </p>
      </section>
      <section aria-label={wording.INFOS_COMPLÉMENTAIRES}>
      </section>
    </>
  );
};

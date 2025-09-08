import { ReactElement, ReactNode } from "react";

import { useDependencies } from "../contexts/useDependencies";

type IndicateurProps = Readonly<{
  children: ReactNode;
  dateDeMiseÀJour: string;
  nomDeLIndicateur: ReactNode;
  source: ReactElement;
}>;

export const IndicateurIdentité = ({ children, dateDeMiseÀJour, nomDeLIndicateur, source }: IndicateurProps) => {
  const { wording } = useDependencies();

  return (
    <li>
      <p className="fr-m-0">
        {nomDeLIndicateur}
        {" - "}
        <span className="fr-text--xs">{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</span>
      </p>
      <p className="fr-m-0 fr-text--bold">{children}</p>
    </li>
  );
};

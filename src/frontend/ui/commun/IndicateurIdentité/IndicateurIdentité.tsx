import { ReactChild, ReactElement } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { NotAUthorized } from "../notAuthorized/Notauthorized";

type IndicateurProps = Readonly<{
  children: ReactChild;
  dateDeMiseÀJour: string;
  nomDeLIndicateur: ReactChild;
  source: ReactElement;
  authorisé: boolean;
}>;

export const IndicateurIdentité = ({ authorisé, children, dateDeMiseÀJour, nomDeLIndicateur, source }: IndicateurProps) => {
  const { wording } = useDependencies();

  return (
    <li>
      <p className="fr-m-0">
        {nomDeLIndicateur}
        {authorisé ? (<>
          {" - "}
          <span className="fr-text--xs">{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</span>
        </>) : <></>}
      </p>
      {authorisé ? (<>
        <p className="fr-m-0 fr-text--bold">{children}</p>
      </>) : <NotAUthorized />}

    </li>
  );
};

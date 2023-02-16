import { ReactChild, ReactElement, useState } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { InfoBulle } from "../InfoBulle/InfoBulle";
import styles from "./Indicateur.module.css";

import "@gouvfr/dsfr/dist/component/button/button.min.css";

type IndicateurProps = Readonly<{
  children: ReactElement;
  contenuInfoBulle: ReactElement;
  dateDeMiseÀJour: string;
  identifiant: string;
  nomDeLIndicateur: ReactChild;
  source: ReactElement;
}>;

// TODO regarder la difference entre Indicateur vs Indicateur Graphic
export const Indicateur = ({ children, contenuInfoBulle, dateDeMiseÀJour, identifiant, nomDeLIndicateur, source }: IndicateurProps) => {
  const { wording } = useDependencies();
  const [estCeOuvert, setEstCeOuvert] = useState(false);

  return (
    <li>
      <div>
        <h6 className="fr-m-0 fr-text--bold ">{nomDeLIndicateur}</h6>
        <div className={styles["mise-a-jour-source"]}>
          <p className={`fr-text--xs ${styles["titraille"]}`}>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
          <button
            aria-controls={`nom-info-bulle-${identifiant}`}
            className="fr-btn fr-fi-information-line fr-btn--icon-left fr-btn--tertiary-no-outline fr-btn--sm"
            data-fr-opened={estCeOuvert}
            onClick={() => setEstCeOuvert(true)}
            type="button"
          >
            {wording.DÉTAILS}
          </button>
        </div>
      </div>
      {children}
      <InfoBulle estCeOuvert={estCeOuvert} identifiant={identifiant} setEstCeOuvert={setEstCeOuvert} titre={nomDeLIndicateur}>
        {contenuInfoBulle}
      </InfoBulle>
    </li>
  );
};

import { ReactNode, ReactElement, useState } from "react";

import styles from "./IndicateurGraphique.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { InfoBulle } from "../InfoBulle/InfoBulle";

import "@gouvfr/dsfr/dist/component/button/button.min.css";

type IDetailsProps = Readonly<{
  contenuInfoBulle: ReactElement;
  dateDeMiseÀJour?: string;
  identifiant: string;
  nomDeLIndicateur: ReactNode;
  source: ReactElement;
}>;

export const IDetails = ({ contenuInfoBulle, dateDeMiseÀJour, identifiant, nomDeLIndicateur, source }: IDetailsProps) => {
  const { wording } = useDependencies();
  const [estCeOuvert, setEstCeOuvert] = useState(false);

  return (
    <>
      {!dateDeMiseÀJour && <button
        aria-controls={`nom-info-bulle-${identifiant}`}
        className="fr-btn fr-fi-information-line fr-btn--icon-left fr-btn--tertiary-no-outline fr-btn--sm"
        data-fr-opened={estCeOuvert}
        onClick={() => setEstCeOuvert(true)}
        title="Détails de l'indicateur"
        type="button"
      >
        {wording.DÉTAILS}
      </button>}

      {dateDeMiseÀJour && source && <div className={styles["mise-a-jour-source"]}>
        <p className={`fr-text--xs ${styles["titraille"]}`}>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
        <button
          aria-controls={`nom-info-bulle-${identifiant}`}
          className="fr-btn fr-fi-information-line fr-btn--icon-left fr-btn--tertiary-no-outline fr-btn--sm"
          data-fr-opened={estCeOuvert}
          onClick={() => setEstCeOuvert(true)}
          title="Détails de l'indicateur"
          type="button"
        >
          {wording.DÉTAILS}
        </button>
      </div>}
      <InfoBulle estCeOuvert={estCeOuvert} identifiant={identifiant} setEstCeOuvert={setEstCeOuvert} titre={nomDeLIndicateur}>
        {contenuInfoBulle}
      </InfoBulle>
    </>
  );
};

import { ReactChild, ReactElement, useState } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { InfoBulle } from "../InfoBulle/InfoBulle";
import { SelectionAnneeTags } from "../Tag/SelectionAnneeTags";
import styles from "./IndicateurGraphique.module.css";
import "@gouvfr/dsfr/dist/component/button/button.min.css";

type IndicateurProps = Readonly<{
  années?: { liste: number[]; setAnnéeEnCours: (annee: number) => void };
  children: ReactElement;
  contenuInfoBulle: ReactElement;
  dateDeMiseÀJour?: string;
  identifiant: string;
  nomDeLIndicateur: ReactChild;
  source?: ReactElement;
  prefixSelect?: string;
}>;

export const IndicateurGraphique = ({ années, children, contenuInfoBulle, dateDeMiseÀJour, identifiant, nomDeLIndicateur, source, prefixSelect }: IndicateurProps) => {
  const { wording } = useDependencies();
  const [estCeOuvert, setEstCeOuvert] = useState(false);

  return (
    <li className={styles["print-only"]}>
      <div className={styles["mise-a-jour-source"]}>
        <h3 className={`fr-m-0 fr-text--bold ${styles["intitule"]} fr-h6`}>
          {nomDeLIndicateur}
        </h3>
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
      </div>

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
      {années ? <SelectionAnneeTags annees={années.liste} id={identifiant} prefix={prefixSelect} setAnnéeEnCours={années.setAnnéeEnCours} /> : <></>}
      <div className={styles["graphe"]}>{children}</div>
      <InfoBulle estCeOuvert={estCeOuvert} identifiant={identifiant} setEstCeOuvert={setEstCeOuvert} titre={nomDeLIndicateur}>
        {contenuInfoBulle}
      </InfoBulle>
    </li>
  );
};

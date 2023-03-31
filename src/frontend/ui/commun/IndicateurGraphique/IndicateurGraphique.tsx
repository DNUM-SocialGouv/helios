import { ReactChild, ReactElement, useState } from "react";

import { useDependencies } from "../contexts/useDependencies";
import { SelectionAnnee } from "../Graphique/SelectionAnnee";
import { InfoBulle } from "../InfoBulle/InfoBulle";
import styles from "./IndicateurGraphique.module.css";
import "@gouvfr/dsfr/dist/component/button/button.min.css";

type IndicateurProps = Readonly<{
  années?: { liste: number[]; setAnnéeEnCours: (annee: number) => void };
  children: ReactElement;
  contenuInfoBulle: ReactElement;
  dateDeMiseÀJour: string;
  identifiant: string;
  nomDeLIndicateur: ReactChild;
  source: ReactElement;
}>;

export const IndicateurGraphique = ({ années, children, contenuInfoBulle, dateDeMiseÀJour, identifiant, nomDeLIndicateur, source }: IndicateurProps) => {
  const { wording } = useDependencies();
  const [estCeOuvert, setEstCeOuvert] = useState(false);

  return (
    <li>
      <div>
        <h6 className={`fr-m-0 fr-text--bold ${styles["intitule"]}`}>
          {nomDeLIndicateur}
          {années ? <SelectionAnnee annees={années.liste} setAnnéeEnCours={années.setAnnéeEnCours} /> : <></>}
        </h6>
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
      <div className={styles["graphe"]}>{children}</div>
      <InfoBulle estCeOuvert={estCeOuvert} identifiant={identifiant} setEstCeOuvert={setEstCeOuvert} titre={nomDeLIndicateur}>
        {contenuInfoBulle}
      </InfoBulle>
    </li>
  );
};

import { useRouter } from "next/router";
import { useState } from "react";

import styles from "./ActionsButton.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";

type ActionsButtonProps = Readonly<{
  finess: string;
  typeEtab: string;
  downloadPDF: () => void;
}>;

export const ActionsButton = ({ finess, typeEtab, downloadPDF }: ActionsButtonProps) => {

  const { wording } = useDependencies();
  const router = useRouter();
  const [displayActions, setDisplayActions] = useState<boolean>(false);
  const listFinessNumbers = { finess };

  const lancerComparaison = () => {
    sessionStorage.setItem("listFinessNumbers", JSON.stringify(listFinessNumbers));
    sessionStorage.setItem("comparaisonType", typeEtab);
    document.cookie = `list=${encodeURIComponent(JSON.stringify(listFinessNumbers))}; path=/`;
    document.cookie = `type=${encodeURIComponent(typeEtab)}; path=/`;
    router.push("/comparaison");
  }

  return (
    <div className={styles["button-position"]}>
      <button className={displayActions ? "fr-btn fr-btn--icon-right fr-icon-arrow-down-s-line fr-btn--secondary fr-mt-1w" : "fr-btn fr-btn--icon-right fr-icon-arrow-up-s-line fr-btn--secondary fr-mt-1w"} onClick={() => setDisplayActions(!displayActions)} type="button"> {wording.ACTIONS} </button>
      {displayActions &&
        <ul className={styles["menu"]}>
          <li className={styles["menu-item"]}>
            <button className="fr-btn fr-btn--tertiary-no-outline" disabled onClick={lancerComparaison}>
              {wording.COMPARER}
            </button>
          </li>
          <li className={styles["menu-item"]}>
            <button
              className="fr-btn fr-btn--tertiary-no-outline fr-fi-download-line fr-btn--icon-left"
              name={wording.TÉLÉCHARGER_EN_PDF}
              onClick={downloadPDF}
              title={wording.TÉLÉCHARGER_EN_PDF}
              type="button"
            >
              {wording.TÉLÉCHARGER_EN_PDF}
            </button>
          </li>
        </ul>
      }
    </div >
  );
}

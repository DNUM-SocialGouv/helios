import { useRouter } from "next/router";
import { useState } from "react";

import styles from "./ActionsButton.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";

type ActionsButtonProps = Readonly<{
  finess: string;
  downloadPDF: () => void;
  exportET?: () => void;
}>;

export const ActionsButton = ({ finess, downloadPDF, exportET }: ActionsButtonProps) => {

  const { wording } = useDependencies();
  const router = useRouter();
  const [displayActions, setDisplayActions] = useState<boolean>(false);

  const lancerComparaison = () => {
    sessionStorage.setItem("listFinessNumbers", JSON.stringify([finess]));
    router.push("/comparaison");
  }

  return (
    <div className={styles["button-position"]}>
      <button className={displayActions ? "fr-btn fr-btn--icon-right fr-icon-arrow-down-s-line fr-btn--secondary fr-mt-1w" : "fr-btn fr-btn--icon-right fr-icon-arrow-up-s-line fr-btn--secondary fr-mt-1w"} onClick={() => setDisplayActions(!displayActions)} type="button"> {wording.ACTIONS} </button>
      {displayActions &&
        <ul className={styles["menu"]}>
          <li className={styles["menu-item"]}>
            <button className="fr-btn fr-btn--tertiary-no-outline" onClick={lancerComparaison}>
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
          {
            exportET &&
            <li className={styles["menu-item"]}>
              <button
                className="fr-btn fr-btn--tertiary-no-outline"
                name={wording.EXPORT_ET_RATTACHES}
                onClick={exportET}
                title={wording.EXPORT_ET_RATTACHES}
                type="button"
              >
                {wording.EXPORT_ET_RATTACHES}
              </button>
            </li>
          }
        </ul >
      }
    </div >
  );
}

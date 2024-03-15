import { ReactElement } from "react";

import { RechercheViewModel } from "../../home/RechercheViewModel";
import { StarButton } from "../StarButton/StarButton";
import styles from "./Titre.module.css";

type TitreProps = Readonly<{
  logo: ReactElement;
  children: ReactElement | string;
  rechercheViewModel: RechercheViewModel | undefined;
  downloadPDF?: any;
}>;

export const Titre = ({ logo, children, rechercheViewModel, downloadPDF }: TitreProps) => {
  return (
    <div className={styles["titre"]}>
      <span className="logoContainer">{logo}</span>

      <h1>
        {children}
        <span className="hiddenPdf">
          <StarButton favorite={rechercheViewModel} parent="titre" />
        </span>
      </h1>
      {downloadPDF && <div className="hiddenPdf">{downloadPDF}</div>}
    </div>
  );
};

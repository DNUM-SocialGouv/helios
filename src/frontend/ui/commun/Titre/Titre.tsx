import { ReactElement } from "react";

import styles from "./Titre.module.css";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { StarButtonList } from "../StarButtonList/StarButtonList";

type TitreProps = Readonly<{
  logo: ReactElement;
  children: ReactElement | string;
  rechercheViewModel: RechercheViewModel;
  downloadPDF?: any;
}>;

export const Titre = ({ logo, children, rechercheViewModel, downloadPDF }: TitreProps) => {
  return (
    <div className={styles["titre"]}>
      <span className="logoContainer">{logo}</span>

      <h1>
        {children}
        <span className="hiddenPdf">
          <StarButtonList favorite={rechercheViewModel} parent="titre" />
        </span>
      </h1>
      {downloadPDF && <div className="hiddenPdf">{downloadPDF}</div>}
    </div>
  );
};

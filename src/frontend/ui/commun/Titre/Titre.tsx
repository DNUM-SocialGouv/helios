import { ReactElement } from "react";

import styles from "./Titre.module.css";
import { ActionsButton } from "../../etablissement/ActionsButton";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { StarButtonList } from "../StarButtonList/StarButtonList";

type TitreProps = Readonly<{
  logo: ReactElement;
  children: ReactElement | string;
  rechercheViewModel: RechercheViewModel;
  downloadPDF: () => void;
}>;

export const Titre = ({ logo, children, rechercheViewModel, downloadPDF }: TitreProps) => {
  return (
    <div className={styles["titre"]}>
      <span className="logoContainer">{logo}</span>

      <h1>
        {children}
        <span className="hiddenPdf">
          <StarButtonList numeroFiness={rechercheViewModel.numéroFiness} parent="titre" />
        </span>
      </h1>
      <div className="hiddenPdf"><ActionsButton downloadPDF={downloadPDF} finess={rechercheViewModel.numéroFiness} /></div>
    </div >
  );
};

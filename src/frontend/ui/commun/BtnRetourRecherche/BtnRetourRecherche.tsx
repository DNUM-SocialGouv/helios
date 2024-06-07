import Link from "next/link";
import React from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../contexts/BackToSearchContext";
import { useDependencies } from "../contexts/useDependencies";
import styles from './BtnRetourRecherche.module.css';


type BtnRetourRechercheProps = Readonly<{
}>;

export const BtnRetourRecherche = ({ }: BtnRetourRechercheProps) => {
  const { wording } = useDependencies();
  const backToSearchContext = React.useContext(BackToSearchContext) as BackToSearchContextValue;

  const setItisClicked = () => {
    localStorage.setItem('FromBackToSearch', 'true');
  }

  return (
    <div className={styles["btnRetourRechercheStyle"]}>
      {backToSearchContext && backToSearchContext.isInfoPage && localStorage.getItem('searchItem') !== null ? (
        <Link className="fr-link" href="/" onClick={setItisClicked} title={wording.BACK_TO_SEARCH}>
          {wording.BACK_TO_SEARCH}
        </Link>
      ) : null}
    </div>
  );
}
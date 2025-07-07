import Link from "next/link";
import { useRouter } from 'next/router';
import React from "react";

import styles from './BtnRetourRecherche.module.css';
import { useDependencies } from "../contexts/useDependencies";

export const BtnRetourRecherche = () => {
  const { wording } = useDependencies();

  const router = useRouter();
  const { termeSimple } = router.query;

  const setItisClicked = () => {
    localStorage.setItem('FromBackToSearch', 'true');
  }

  return (
    <div className={styles["btnRetourRechercheStyle"]}>
      {termeSimple && (
        <Link className="fr-link" href="/" onClick={setItisClicked} title={wording.BACK_TO_SEARCH}>
          {wording.BACK_TO_SEARCH}
        </Link>
      )}
    </div>
  );
}

import Head from "next/head";

import { useDependencies } from "../commun/contexts/useDependencies";
import { FormulaireDeConnexion } from "./FormulaireDeConnexion";

export const PageDeConnexion = () => {
  const { wording } = useDependencies();

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.TITRE_PAGE_CONNEXION}</title>
      </Head>
      <FormulaireDeConnexion />
    </main>
  );
};

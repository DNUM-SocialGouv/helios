import Head from "next/head";

import { FormulaireDeConnexion } from "./FormulaireDeConnexion";
import { useDependencies } from "../commun/contexts/useDependencies";

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

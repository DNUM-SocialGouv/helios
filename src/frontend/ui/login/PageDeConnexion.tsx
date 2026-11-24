import Head from "next/head";
import { signIn } from "next-auth/react";

import { BoutonProConnect } from "../commun/BoutonProConnect/BoutonProConnect";
import { useDependencies } from "../commun/contexts/useDependencies";

export const PageDeConnexion = () => {
  const { wording } = useDependencies();

  const handleProconnect = () => {
   signIn("proconnect", { redirect: true, callbackUrl: "/" });
  };

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.TITRE_PAGE_CONNEXION}</title>
      </Head>
      <div className="fr-grid-row  fr-grid-row--center">
        <BoutonProConnect handleProconnect={handleProconnect} />
      </div> 
    </main>
  );
};

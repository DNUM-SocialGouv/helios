import Head from "next/head";
import { signIn } from "next-auth/react";
import "@gouvfr/dsfr/dist/component/card/card.min.css";

import { BoutonProConnect } from "../commun/BoutonProConnect/BoutonProConnect";
import { useDependencies } from "../commun/contexts/useDependencies";

export const PageDeConnexion = () => {
  const { wording } = useDependencies();

  const handleProconnect = () => {
   signIn("proconnect", { redirect: true, callbackUrl: "/" });
  };

  return (
    <main className="fr-container" id="content" style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Head>
        <title>{wording.TITRE_PAGE_CONNEXION}</title>
      </Head>
      <div className="fr-grid-row fr-grid-row--center" style={{ width: "100%" }}>
        <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <div className="fr-card fr-p-4w" style={{ textAlign: "center" }}>
            <h1>{wording.CONNEXION_LIBELLE}</h1>
            <p>{wording.DESCRIPTION_CONNEXION}</p>
            <BoutonProConnect handleProconnect={handleProconnect} />
          </div>
        </div>
      </div>
    </main>
  );
};

import Head from "next/head";

import { RegistrationForm } from "./RegistrationForm";
import { useDependencies } from "../commun/contexts/useDependencies";

export const RegistrationPage = () => {
  const { wording } = useDependencies();

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.TITRE_PAGE_CONNEXION}</title>
      </Head>
      <RegistrationForm />
    </main>
  );
};

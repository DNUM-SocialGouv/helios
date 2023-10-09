import Head from "next/head";

import { useDependencies } from "../commun/contexts/useDependencies";
import { RegistrationForm } from "./RegistrationForm";

export const RegistrationPage = () => {
    const { wording } = useDependencies();

    return (
        <main className="fr-container">
            <Head>
                <title>{wording.TITRE_PAGE_CONNEXION}</title>
            </Head>
            <RegistrationForm />
        </main>
    );
};

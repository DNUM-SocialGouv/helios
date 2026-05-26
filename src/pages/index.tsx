import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { checkPasswordStatusEndpoint } from "../backend/infrastructure/controllers/checkPasswordStatusEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { PasswordStatus } from "../backend/métier/entities/Utilisateur/RésultatLogin";
import { MessageAccueil } from "../backend/métier/gateways/MessageAccueilLoader";
import { PageRecherche } from "../frontend/ui/home/PageRecherche";


type RouterProps = Readonly<{ passwordStatus: PasswordStatus; messageAccueil: MessageAccueil | null }>;

export default function Router({ passwordStatus, messageAccueil }: RouterProps) {
  return <PageRecherche messageAccueil={messageAccueil} passwordStatus={passwordStatus} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  const session = await getSession(context);
  const email = session?.user.email as string;
  const passwordStatus = await checkPasswordStatusEndpoint(dependencies, email);
  const messageAccueil = await dependencies.messageAccueilLoader.getLastMessage();

  return {
    props: { passwordStatus, messageAccueil: messageAccueil ? JSON.parse(JSON.stringify(messageAccueil)) : null },
  };
}

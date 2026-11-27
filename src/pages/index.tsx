import { GetStaticPropsResult } from "next";

import { dependencies } from "../backend/infrastructure/dependencies";
import { MessageAccueil } from "../backend/métier/gateways/MessageAccueilLoader";
import { PageRecherche } from "../frontend/ui/home/PageRecherche";


type RouterProps = Readonly<{ messageAccueil: MessageAccueil | null }>;

export default function Router({ messageAccueil }: RouterProps) {
  return <PageRecherche messageAccueil={messageAccueil}  />;
}

export async function getServerSideProps(): Promise<GetStaticPropsResult<RouterProps>> {
  const messageAccueil = await dependencies.messageAccueilLoader.getLastMessage();

  return {
    props: { messageAccueil: messageAccueil ? JSON.parse(JSON.stringify(messageAccueil)) : null },
  };
}

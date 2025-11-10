import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";

import { getAideEndpoint } from "../backend/infrastructure/controllers/getAideEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { GestionAide } from "../frontend/ui/parametrage-aide";
import type { ContenuAide } from "../frontend/ui/parametrage-aide";

type PageParametrageAideProps = Readonly<{
  contenuInitial: ContenuAide;
}>;

export default function PageParametrageAide({ contenuInitial }: PageParametrageAideProps) {

  return <GestionAide contenuInitial={contenuInitial} />;
}

export async function getServerSideProps(
  contexte: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageParametrageAideProps>> {
  try {
    const session = await getSession(contexte);
    if (session?.user?.role !== 1) {
      return {
        redirect: {
          permanent: false,
          destination: "/inaccessible",
        },
      };
    }


    const contenu = await getAideEndpoint(dependencies);

    if (!contenu || typeof contenu !== "object" || Array.isArray(contenu)) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        contenuInitial: JSON.parse(JSON.stringify(contenu)) as ContenuAide,
      },
    };
  } catch (erreur: any) {
    dependencies.logger.error(erreur?.message ?? erreur);
    return {
      notFound: true,
    };
  }
}

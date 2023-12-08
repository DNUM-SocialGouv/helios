import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLEntitéJuridiqueEndpoint } from "../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { EntitéJuridiqueNonTrouvée } from "../../backend/métier/entities/EntitéJuridiqueNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { Cookies } from "../../frontend/ui/cookies/Cookies";

type RouterProps = Readonly<{}>;

export default function Router({}: RouterProps) {
  const { wording, paths } = useDependencies();

  return <Cookies />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    return {
      props: {},
    };
  } catch (error) {
    if (error instanceof EntitéJuridiqueNonTrouvée) {
      dependencies.logger.error(error.message);
      return {
        notFound: true,
      };
    }
    throw error;
  }
}

import { GetStaticPathsResult, GetStaticPropsResult } from "next";

import { récupèreLÉtablissementTerritorialMédicoSocialEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialMédicoSocialEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialMédicoSocial } from "../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { PageÉtablissementTerritorialMédicoSocial } from "../../frontend/ui/établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "../../frontend/ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel";

type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialMédicoSocial;
}>;

export default function Router({ établissementTerritorial }: RouterProps) {
  const { paths, wording } = useDependencies();

  if (!établissementTerritorial) return null;

  const établissementTerritorialViewModel = new ÉtablissementTerritorialMédicoSocialViewModel(établissementTerritorial, wording, paths);
  return <PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialViewModel} />;
}

export function getStaticPaths(): GetStaticPathsResult {
  return {
    fallback: "blocking",
    paths: [],
  };
}

export async function getStaticProps({ params }: { params: { numeroFiness: string } }): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const { environmentVariables } = dependencies;
    const établissementTerritorial = (await récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
      dependencies,
      params.numeroFiness
    )) as ÉtablissementTerritorialMédicoSocial;

    return { props: { établissementTerritorial }, revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE) };
  } catch (error) {
    if (error instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      dependencies.logger.error(error.message);
      return { notFound: true, revalidate: 1 };
    }
    throw error;
  }
}

import { GetStaticPathsResult, GetStaticPropsResult } from "next";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLÉtablissementTerritorialMédicoSocialEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialMédicoSocialEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialMédicoSocial } from "../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { PageÉtablissementTerritorialMédicoSocial } from "../../frontend/ui/établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "../../frontend/ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel";


type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialMédicoSocial;
  rechercheResult: any;
}>;

export default function Router({ rechercheResult, établissementTerritorial }: RouterProps) {
  const { paths, wording } = useDependencies();
  if (!établissementTerritorial) return null;

  const établissementTerritorialViewModel = new ÉtablissementTerritorialMédicoSocialViewModel(établissementTerritorial, wording, paths);
  const rechercheViewModel = new RechercheViewModel(rechercheResult.résultats[0], paths);

  return (
    <>
      {rechercheViewModel ? (
        <PageÉtablissementTerritorialMédicoSocial
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialViewModel={établissementTerritorialViewModel}
        />
      ) : (
        <Spinner />
      )}
    </>

  )
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

    const rechercheResult = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, params.numeroFiness, 1);

    return { props: { établissementTerritorial, rechercheResult: rechercheResult, }, revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE) };
  } catch (error) {
    if (error instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      dependencies.logger.error(error.message);
      return { notFound: true, revalidate: 1 };
    }
    throw error;
  }
}

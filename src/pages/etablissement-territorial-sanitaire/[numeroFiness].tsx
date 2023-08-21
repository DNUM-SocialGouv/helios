import { GetStaticPathsResult, GetStaticPropsResult } from "next";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialSanitaire } from "../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { PageÉtablissementTerritorialSanitaire } from "../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireViewModel } from "../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel";

type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialSanitaire;
  rechercheResult: any;
}>;

export default function Router({ rechercheResult, établissementTerritorial }: RouterProps) {
  const { paths, wording } = useDependencies();

  if (!établissementTerritorial) return null;

  const établissementTerritorialSanitaireViewModel = new ÉtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording, paths);
  const rechercheViewModel = new RechercheViewModel(rechercheResult.résultats[0], paths);

  return (
    <>
      {rechercheViewModel ? (
        <PageÉtablissementTerritorialSanitaire
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      ) : (
        <Spinner />
      )}
    </>

  );
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
    const établissementTerritorial = (await récupèreLÉtablissementTerritorialSanitaireEndpoint(
      dependencies,
      params.numeroFiness
    )) as ÉtablissementTerritorialSanitaire;
    const rechercheResult = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, params.numeroFiness, 1);
    return { props: { établissementTerritorial, rechercheResult: rechercheResult }, revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE) };
  } catch (error) {
    if (error instanceof ÉtablissementTerritorialSanitaireNonTrouvée) {
      dependencies.logger.error(error.message);
      return { notFound: true, revalidate: 1 };
    }
    throw error;
  }
}

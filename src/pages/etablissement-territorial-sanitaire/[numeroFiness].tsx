import { GetStaticPathsResult, GetStaticPropsResult } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialSanitaire } from "../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { useRecherche } from "../../frontend/ui/home/useRecherche";
import { PageÉtablissementTerritorialSanitaire } from "../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireViewModel } from "../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel";

type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialSanitaire;
}>;

export default function Router({ établissementTerritorial }: RouterProps) {
  const { paths, wording } = useDependencies();
  const router = useRouter();

  const { rechercher, résultats } = useRecherche();
  const [rechercheViewModel, setRechercheViewModel] = useState<RechercheViewModel>();

  useEffect(() => {
    rechercher(router.query["numeroFiness"] as string, 1);
  }, [])

  useEffect(() => {
    setRechercheViewModel(résultats[0] as RechercheViewModel);
  }, [résultats])

  if (!établissementTerritorial) return null;

  const établissementTerritorialSanitaireViewModel = new ÉtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording, paths);
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
    return { props: { établissementTerritorial }, revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE) };
  } catch (error) {
    if (error instanceof ÉtablissementTerritorialSanitaireNonTrouvée) {
      dependencies.logger.error(error.message);
      return { notFound: true, revalidate: 1 };
    }
    throw error;
  }
}

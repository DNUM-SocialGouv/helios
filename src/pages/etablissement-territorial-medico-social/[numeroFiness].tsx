import { GetStaticPathsResult, GetStaticPropsResult } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { récupèreLÉtablissementTerritorialMédicoSocialEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialMédicoSocialEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialMédicoSocial } from "../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { useRecherche } from "../../frontend/ui/home/useRecherche";
import { PageÉtablissementTerritorialMédicoSocial } from "../../frontend/ui/établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "../../frontend/ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel";


type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialMédicoSocial;
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

  const établissementTerritorialViewModel = new ÉtablissementTerritorialMédicoSocialViewModel(établissementTerritorial, wording, paths);

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

    return { props: { établissementTerritorial }, revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE) };
  } catch (error) {
    if (error instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      dependencies.logger.error(error.message);
      return { notFound: true, revalidate: 1 };
    }
    throw error;
  }
}

import { GetStaticPathsResult, GetStaticPropsResult } from "next";
import { useEffect, useState } from "react";

import { récupèreLEntitéJuridiqueEndpoint } from "../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { EntitéJuridique } from "../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialRattaché } from "../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { EntitéJuridiqueNonTrouvée } from "../../backend/métier/entities/EntitéJuridiqueNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { EntitéJuridiqueViewModel } from "../../frontend/ui/entité-juridique/EntitéJuridiqueViewModel";
import { EtablissementsTerritoriauxRattachésViewModel } from "../../frontend/ui/entité-juridique/liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { PageEntitéJuridique } from "../../frontend/ui/entité-juridique/PageEntitéJuridique";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { useRecherche } from "../../frontend/ui/home/useRecherche";

type RouterProps = Readonly<{
  entitéJuridique: EntitéJuridique;
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[];
}>;

export default function Router({ entitéJuridique, établissementsTerritoriauxRattachés }: RouterProps) {
  const { wording } = useDependencies();

  const { rechercher, résultats } = useRecherche();
  const [rechercheViewModel, setRechercheViewModel] = useState<RechercheViewModel>();

  useEffect(() => {
    rechercher(entitéJuridiqueViewModel.numéroFiness, 1);
  }, [])

  useEffect(() => {
    setRechercheViewModel(résultats[0] as RechercheViewModel);
  }, [résultats])

  if (!établissementsTerritoriauxRattachés || !entitéJuridique) return null;

  const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel(entitéJuridique, wording);
  const établissementsTerritoriauxRattachéesViewModel = new EtablissementsTerritoriauxRattachésViewModel(établissementsTerritoriauxRattachés, wording);

  return (
    <>
      {rechercheViewModel ? (
        <PageEntitéJuridique
          entitéJuridiqueViewModel={entitéJuridiqueViewModel}
          rechercheViewModel={rechercheViewModel}
          établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachéesViewModel}
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
    const entitéJuridiqueEndpoint = (await récupèreLEntitéJuridiqueEndpoint(dependencies, params.numeroFiness)) as RouterProps;

    return {
      props: {
        entitéJuridique: entitéJuridiqueEndpoint.entitéJuridique,
        établissementsTerritoriauxRattachés: entitéJuridiqueEndpoint.établissementsTerritoriauxRattachés,
      },
      revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE),
    };
  } catch (error) {
    if (error instanceof EntitéJuridiqueNonTrouvée) {
      dependencies.logger.error(error.message);
      return {
        notFound: true,
        revalidate: 1,
      };
    }
    throw error;
  }
}
